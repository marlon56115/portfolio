package main

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

var quiet = slog.New(slog.NewTextHandler(io.Discard, nil))

// fakeProm responde a cualquier consulta con etiquetas "secretas" para comprobar que no salen.
func fakeProm(t *testing.T, queries *atomic.Int64) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		queries.Add(1)
		w.Header().Set("Content-Type", "application/json")
		labels := `{"pod":"secret-pod","namespace":"secret-ns","instance":"10.0.0.1:9100","nodename":"secret-host"}`
		if r.URL.Path == "/api/v1/query_range" {
			var b strings.Builder
			b.WriteString(`{"status":"success","data":{"resultType":"matrix","result":[{"metric":` + labels + `,"values":[`)
			for i := 0; i < 90; i++ { // más de 60 puntos: debe recortarse
				if i > 0 {
					b.WriteString(",")
				}
				b.WriteString(`[1,"0.2"]`)
			}
			b.WriteString(`,[2,"NaN"],[3,"1.7"]]}]}}`)
			_, _ = io.WriteString(w, b.String())
			return
		}
		_, _ = io.WriteString(w, `{"status":"success","data":{"resultType":"vector","result":[{"metric":`+labels+`,"value":[1,"0.123456"]}]}}`)
	}))
}

func TestCollectorPublishesOnlyAggregates(t *testing.T) {
	var n atomic.Int64
	prom := fakeProm(t, &n)
	defer prom.Close()

	c := newCollector(prom.URL, time.Minute, quiet)
	c.refresh(context.Background())
	h := newHandler(testSite(), c, quiet).(*handler)

	w := do(h, "GET", "/api/status", nil)
	body := w.Body.String()
	if w.Code != 200 {
		t.Fatalf("status %d", w.Code)
	}
	for _, leak := range []string{"secret", "10.0.0.1", "9100", "pod", "namespace", "instance", "node"} {
		if strings.Contains(body, leak) {
			t.Fatalf("status leaks %q: %s", leak, body)
		}
	}
	var raw map[string]any
	if err := json.Unmarshal([]byte(body), &raw); err != nil {
		t.Fatal(err)
	}
	allowed := map[string]bool{"ok": true, "generatedAt": true, "uptimeSeconds": true, "requestsServed": true, "cpu": true, "memory": true, "cpuHistory": true}
	for k := range raw {
		if !allowed[k] {
			t.Fatalf("unexpected field %q in %s", k, body)
		}
	}
	for _, gone := range []string{"os", "k8s", "namespaces", "pods", "cpuTempC", "netRxBps", "netTxBps", "diskData", "memoryTotalBytes"} {
		if _, ok := raw[gone]; ok {
			t.Fatalf("removed field %q is back: %s", gone, body)
		}
	}
	var s status
	if err := json.Unmarshal([]byte(body), &s); err != nil {
		t.Fatal(err)
	}
	if !s.OK || s.CPU == nil || *s.CPU != 0.1235 || s.Memory == nil || *s.Memory != 0.1235 {
		t.Fatalf("unexpected snapshot: %s", body)
	}
	if len(s.CPUHistory) != maxHistory {
		t.Fatalf("history has %d points, want %d", len(s.CPUHistory), maxHistory)
	}
	for _, v := range s.CPUHistory {
		if v < 0 || v > 1 {
			t.Fatalf("history value out of range: %v", v)
		}
	}
}

func TestVisitorsNeverQueryMetrics(t *testing.T) {
	var n atomic.Int64
	prom := fakeProm(t, &n)
	defer prom.Close()

	c := newCollector(prom.URL, time.Minute, quiet)
	c.refresh(context.Background())
	before := n.Load()
	h := newHandler(testSite(), c, quiet)
	for i := 0; i < 5; i++ {
		do(h, "GET", "/api/status", map[string]string{"CF-Connecting-IP": "198.51.100.1"})
	}
	if n.Load() != before {
		t.Fatalf("visitor requests reached the metrics source (%d → %d)", before, n.Load())
	}
}

func TestCollectorDown(t *testing.T) {
	c := newCollector("http://127.0.0.1:1", time.Minute, quiet)
	c.refresh(context.Background())
	if c.latest() != nil {
		t.Fatal("metrics should be empty when the source is down")
	}
}

func TestCollectorStale(t *testing.T) {
	c := newCollector("", time.Minute, quiet)
	v := 0.5
	c.current.Store(&snapshot{m: metrics{CPU: &v}, at: time.Now().Add(-3 * time.Minute)})
	if c.latest() != nil {
		t.Fatal("stale metrics must not be published")
	}
}
