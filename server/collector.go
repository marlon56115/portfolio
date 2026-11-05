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
	"strconv"
	"sync/atomic"
	"time"
)

// Consultas fijas: el visitante no puede elegir ni modificar ninguna. Solo dos agregados
// (porcentaje de CPU y de memoria) y la serie de CPU de la última hora. Ninguna etiqueta,
// nombre ni dirección sale de aquí: solo se leen números.
const (
	cpuQuery      = `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))`
	memoryQuery   = `max(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)`
	cpuRangeQuery = `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[2m]))`

	historySpan   = time.Hour
	historyStep   = time.Minute
	maxHistory    = 60      // puntos como máximo en cpuHistory
	maxBody       = 1 << 20 // 1 MiB por respuesta de Prometheus
	staleAfter    = 2 * time.Minute
	uptimeRoundTo = 60 // segundos
)

// metrics es la parte que viene de Prometheus. Se refresca en segundo plano.
type metrics struct {
	CPU        *float64  `json:"cpu,omitempty"`
	Memory     *float64  `json:"memory,omitempty"`
	CPUHistory []float64 `json:"cpuHistory,omitempty"`
}

// status es el contrato público de /api/status. Cualquier campo nuevo aquí es público:
// solo agregados, nunca datos que describan la infraestructura.
type status struct {
	OK             bool      `json:"ok"`
	GeneratedAt    string    `json:"generatedAt"`
	UptimeSeconds  *int64    `json:"uptimeSeconds,omitempty"`
	RequestsServed *uint64   `json:"requestsServed,omitempty"`
	CPU            *float64  `json:"cpu,omitempty"`
	Memory         *float64  `json:"memory,omitempty"`
	CPUHistory     []float64 `json:"cpuHistory,omitempty"`
}

type snapshot struct {
	m  metrics
	at time.Time
}

type collector struct {
	base     string
	interval time.Duration
	client   *http.Client
	log      *slog.Logger
	current  atomic.Pointer[snapshot]
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

// latest devuelve las últimas métricas, o nil si no hay o llevan demasiado sin refrescar.
func (c *collector) latest() *metrics {
	s := c.current.Load()
	if s == nil || time.Since(s.at) > staleAfter {
		return nil
	}
	return &s.m
}

func (c *collector) run(ctx context.Context) {
	if c.base == "" {
		c.log.Info("PROMETHEUS_URL not set: cpu/memory metrics disabled")
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

	var m metrics
	ok := 0
	for _, f := range []struct {
		q   string
		dst **float64
	}{{cpuQuery, &m.CPU}, {memoryQuery, &m.Memory}} {
		v, err := c.scalar(ctx, f.q)
		if err != nil {
			c.log.Debug("query failed", "err", err)
			continue
		}
		v = round(clamp01(v), 4)
		*f.dst = &v
		ok++
	}
	if ok == 0 {
		c.log.Warn("metrics source unreachable")
		return
	}
	if hist, err := c.rangeQuery(ctx, cpuRangeQuery, historySpan, historyStep); err == nil {
		m.CPUHistory = hist
	}
	c.current.Store(&snapshot{m: m, at: time.Now()})
}

type promResp struct {
	Status string `json:"status"`
	Data   struct {
		Result []struct {
			Value  []any   `json:"value"`
			Values [][]any `json:"values"`
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
		return nil, fmt.Errorf("metrics status %d", res.StatusCode)
	}
	var pr promResp
	if err := json.NewDecoder(io.LimitReader(res.Body, maxBody)).Decode(&pr); err != nil {
		return nil, err
	}
	if pr.Status != "success" {
		return nil, errors.New("metrics error")
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
			out = append(out, round(clamp01(v), 4))
		}
	}
	if len(out) > maxHistory {
		out = out[len(out)-maxHistory:]
	}
	if len(out) == 0 {
		return nil, errors.New("empty result")
	}
	return out, nil
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

func clamp01(v float64) float64 { return math.Max(0, math.Min(1, v)) }

func round(v float64, places int) float64 {
	p := math.Pow(10, float64(places))
	return math.Round(v*p) / p
}
