package main

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestCollectorPublishesOnlyAggregates(t *testing.T) {
	prom := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("query")
		w.Header().Set("Content-Type", "application/json")
		switch {
		case r.URL.Path == "/api/v1/query_range":
			_, _ = io.WriteString(w, `{"status":"success","data":{"resultType":"matrix","result":[{"metric":{},"values":[[1,"0.1"],[2,"0.2"],[3,"NaN"]]}]}}`)
		case q == infoQuery:
			_, _ = io.WriteString(w, `{"status":"success","data":{"resultType":"vector","result":[{"metric":{"kubelet_version":"v1.36.5+k3s1","os_image":"Ubuntu 26.04.1 LTS","internal_ip":"192.168.0.250","kernel_version":"7.0.0-38-generic"},"value":[1,"1"]}]}}`)
		default:
			_, _ = io.WriteString(w, `{"status":"success","data":{"resultType":"vector","result":[{"metric":{"pod":"secret-pod","namespace":"secret-ns"},"value":[1,"0.123456"]}]}}`)
		}
	}))
	defer prom.Close()

	c := newCollector(prom.URL, time.Minute, slog.New(slog.NewTextHandler(io.Discard, nil)))
	c.refresh(context.Background())
	b := c.snapshot()
	if b == nil {
		t.Fatal("no snapshot")
	}
	body := string(b)
	for _, leak := range []string{"secret-pod", "secret-ns", "192.168", "7.0.0", "1.36.5"} {
		if strings.Contains(body, leak) {
			t.Fatalf("snapshot leaks %q: %s", leak, body)
		}
	}
	var s status
	if err := json.Unmarshal(b, &s); err != nil {
		t.Fatal(err)
	}
	if !s.OK || s.CPU == nil || *s.CPU != 0.1235 || s.K8s != "v1.36" || s.OS != "Ubuntu 26.04" || len(s.CPUHistory) != 2 {
		t.Fatalf("unexpected snapshot: %s", body)
	}
}

func TestCollectorDown(t *testing.T) {
	c := newCollector("http://127.0.0.1:1", time.Minute, slog.New(slog.NewTextHandler(io.Discard, nil)))
	c.refresh(context.Background())
	if c.snapshot() != nil {
		t.Fatal("snapshot should be empty when Prometheus is down")
	}
}
