// Servidor del portafolio: un solo binario estático que
//   - sirve el sitio de Astro embebido (solo GET/HEAD, sin listados de directorio),
//   - añade cabeceras de seguridad y una CSP estricta a todo,
//   - redirige "/" al idioma (cookie > país de Cloudflare > Accept-Language),
//   - expone /api/status: tiempo activo del proceso, páginas servidas y, si hay fuente de
//     métricas, CPU y memoria agregadas que se refrescan en segundo plano.
//
// Ninguna petición de un visitante dispara una consulta de métricas: el handler solo lee la
// última instantánea en memoria. Así el tráfico público no puede amplificarse hacia dentro.
package main

import (
	"context"
	"embed"
	"errors"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

//go:embed all:public
var embedded embed.FS

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg := loadConfig()

	site, err := fs.Sub(embedded, "public")
	if err != nil {
		logger.Error("embedded site missing", "err", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	collector := newCollector(cfg.prometheusURL, cfg.refresh, logger)
	go collector.run(ctx)

	handler := newHandler(site, collector, logger)

	srv := &http.Server{
		Addr:              cfg.addr,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      20 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    16 << 10,
		ErrorLog:          slog.NewLogLogger(logger.Handler(), slog.LevelWarn),
	}

	go func() {
		logger.Info("listening", "addr", cfg.addr, "prometheus", cfg.prometheusURL != "")
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "err", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
	logger.Info("stopped")
}

type config struct {
	addr          string
	prometheusURL string
	refresh       time.Duration
}

func loadConfig() config {
	c := config{
		addr:          envOr("LISTEN_ADDR", ":8080"),
		prometheusURL: os.Getenv("PROMETHEUS_URL"), // vacío = sin CPU/memoria (el resto del panel sigue)
		refresh:       15 * time.Second,
	}
	if v := os.Getenv("REFRESH_INTERVAL"); v != "" {
		if d, err := time.ParseDuration(v); err == nil && d >= 5*time.Second {
			c.refresh = d
		}
	}
	return c
}

func envOr(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
