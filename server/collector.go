package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"sync/atomic"
	"time"
)

// Consultas fijas: el visitante no puede elegir ni modificar ninguna. Solo agregados del nodo;
// ningún nombre de pod, namespace, IP o etiqueta interna sale de aquí.
var instantQueries = map[string]string{
	"uptimeSeconds":    `max(time() - node_boot_time_seconds)`,
	"cpu":              `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))`,
	"memory":           `max(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)`,
	"memoryTotalBytes": `max(node_memory_MemTotal_bytes)`,
	"pods":             `count(kube_pod_status_phase{phase="Running"} == 1)`,
	"namespaces":       `count(kube_namespace_created)`,
	"cpuTempC":         `max(node_hwmon_temp_celsius{chip=~"pci0000:00_0000:00:18_3"})`,
	"netRxBps":         `sum(rate(node_network_receive_bytes_total{device!~"lo|veth.*|cni.*|flannel.*|tailscale.*"}[5m]))`,
	"netTxBps":         `sum(rate(node_network_transmit_bytes_total{device!~"lo|veth.*|cni.*|flannel.*|tailscale.*"}[5m]))`,
	"diskData":         `max(1 - node_filesystem_avail_bytes{mountpoint="/srv/data"} / node_filesystem_size_bytes{mountpoint="/srv/data"})`,
}

const (
	cpuRangeQuery = `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[2m]))`
	infoQuery     = `kube_node_info`
	maxBody       = 1 << 20 // 1 MiB por respuesta de Prometheus
)

type status struct {
	OK               bool      `json:"ok"`
	GeneratedAt      string    `json:"generatedAt"`
	UptimeSeconds    *float64  `json:"uptimeSeconds,omitempty"`
	CPU              *float64  `json:"cpu,omitempty"`
	Memory           *float64  `json:"memory,omitempty"`
	MemoryTotalBytes *float64  `json:"memoryTotalBytes,omitempty"`
	Pods             *float64  `json:"pods,omitempty"`
	Namespaces       *float64  `json:"namespaces,omitempty"`
	CPUTempC         *float64  `json:"cpuTempC,omitempty"`
	NetRxBps         *float64  `json:"netRxBps,omitempty"`
	NetTxBps         *float64  `json:"netTxBps,omitempty"`
	DiskData         *float64  `json:"diskData,omitempty"`
	K8s              string    `json:"k8s,omitempty"`
	OS               string    `json:"os,omitempty"`
	CPUHistory       []float64 `json:"cpuHistory,omitempty"`
}

type collector struct {
	base     string
	interval time.Duration
	client   *http.Client
	log      *slog.Logger
	current  atomic.Pointer[[]byte]
	fetched  atomic.Int64 // unix del último éxito
}

func newCollector(base string, interval time.Duration, log *slog.Logger) *collector {
	return &collector{
		base:     base,
		interval: interval,
		log:      log,
		client: &http.Client{
			Timeout: 5 * time.Second,
			// Nunca seguir redirecciones: Prometheus no las necesita.
			CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse },
		},
	}
}

// snapshot devuelve el último JSON. Si lleva más de 2 minutos sin refrescar, se considera caído.
func (c *collector) snapshot() []byte {
	p := c.current.Load()
	if p == nil || time.Since(time.Unix(c.fetched.Load(), 0)) > 2*time.Minute {
		return nil
	}
	return *p
}

func (c *collector) run(ctx context.Context) {
	if c.base == "" {
		c.log.Info("PROMETHEUS_URL not set: live status disabled")
		return
	}
	t := time.NewTicker(c.interval)
	defer t.Stop()
	for {
		c.refresh(ctx)
		select {
		case <-ctx.Done():
			return
		case <-t.C:
		}
	}
}

func (c *collector) refresh(ctx context.Context) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	s := status{OK: true, GeneratedAt: time.Now().UTC().Format(time.RFC3339)}
	fields := map[string]**float64{
		"uptimeSeconds": &s.UptimeSeconds, "cpu": &s.CPU, "memory": &s.Memory, "memoryTotalBytes": &s.MemoryTotalBytes,
		"pods": &s.Pods, "namespaces": &s.Namespaces, "cpuTempC": &s.CPUTempC, "netRxBps": &s.NetRxBps,
		"netTxBps": &s.NetTxBps, "diskData": &s.DiskData,
	}
	okCount := 0
	for k, q := range instantQueries {
		v, err := c.scalar(ctx, q)
		if err != nil {
			c.log.Debug("query failed", "key", k, "err", err)
			continue
		}
		v = round(v, 4)
		*fields[k] = &v
		okCount++
	}
	if okCount == 0 {
		c.log.Warn("prometheus unreachable")
		return
	}
	if hist, err := c.rangeQuery(ctx, cpuRangeQuery, time.Hour, 2*time.Minute); err == nil {
		s.CPUHistory = hist
	}
	if k8s, osImage, err := c.nodeInfo(ctx); err == nil {
		s.K8s, s.OS = k8s, osImage
	}

	b, err := json.Marshal(s)
	if err != nil {
		return
	}
	c.current.Store(&b)
	c.fetched.Store(time.Now().Unix())
}

type promResp struct {
	Status string `json:"status"`
	Data   struct {
		ResultType string `json:"resultType"`
		Result     []struct {
			Metric map[string]string `json:"metric"`
			Value  []any             `json:"value"`
			Values [][]any           `json:"values"`
		} `json:"result"`
	} `json:"data"`
}

func (c *collector) get(ctx context.Context, endpoint string, params url.Values) (*promResp, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.base+endpoint+"?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/json")
	res, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("prometheus status %d", res.StatusCode)
	}
	var pr promResp
	if err := json.NewDecoder(io.LimitReader(res.Body, maxBody)).Decode(&pr); err != nil {
		return nil, err
	}
	if pr.Status != "success" {
		return nil, errors.New("prometheus error")
	}
	return &pr, nil
}

func (c *collector) scalar(ctx context.Context, q string) (float64, error) {
	pr, err := c.get(ctx, "/api/v1/query", url.Values{"query": {q}})
	if err != nil {
		return 0, err
	}
	if len(pr.Data.Result) == 0 || len(pr.Data.Result[0].Value) != 2 {
		return 0, errors.New("empty result")
	}
	return parseSample(pr.Data.Result[0].Value[1])
}

func (c *collector) rangeQuery(ctx context.Context, q string, span, step time.Duration) ([]float64, error) {
	end := time.Now()
	pr, err := c.get(ctx, "/api/v1/query_range", url.Values{
		"query": {q},
		"start": {strconv.FormatInt(end.Add(-span).Unix(), 10)},
		"end":   {strconv.FormatInt(end.Unix(), 10)},
		"step":  {strconv.Itoa(int(step.Seconds()))},
	})
	if err != nil {
		return nil, err
	}
	if len(pr.Data.Result) == 0 {
		return nil, errors.New("empty result")
	}
	vals := pr.Data.Result[0].Values
	out := make([]float64, 0, len(vals))
	for _, pair := range vals {
		if len(pair) != 2 {
			continue
		}
		if v, err := parseSample(pair[1]); err == nil {
			out = append(out, round(v, 4))
		}
	}
	if len(out) > 120 {
		out = out[len(out)-120:]
	}
	return out, nil
}

var (
	reK8s = regexp.MustCompile(`^v(\d+)\.(\d+)`)
	reOS  = regexp.MustCompile(`^([A-Za-z]+) (\d+\.\d+)`)
)

// nodeInfo publica solo versión mayor.menor de k3s y del SO (sin kernel ni parches).
func (c *collector) nodeInfo(ctx context.Context) (string, string, error) {
	pr, err := c.get(ctx, "/api/v1/query", url.Values{"query": {infoQuery}})
	if err != nil {
		return "", "", err
	}
	if len(pr.Data.Result) == 0 {
		return "", "", errors.New("empty result")
	}
	m := pr.Data.Result[0].Metric
	k8s, osImage := "", ""
	if g := reK8s.FindStringSubmatch(m["kubelet_version"]); g != nil {
		k8s = "v" + g[1] + "." + g[2]
	}
	if g := reOS.FindStringSubmatch(m["os_image"]); g != nil {
		osImage = g[1] + " " + g[2]
	}
	return k8s, osImage, nil
}

func parseSample(v any) (float64, error) {
	s, ok := v.(string)
	if !ok {
		return 0, errors.New("bad sample")
	}
	f, err := strconv.ParseFloat(s, 64)
	if err != nil || math.IsNaN(f) || math.IsInf(f, 0) {
		return 0, errors.New("bad sample")
	}
	return f, nil
}

func round(v float64, places int) float64 {
	p := math.Pow(10, float64(places))
	return math.Round(v*p) / p
}
