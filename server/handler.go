package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"io/fs"
	"log/slog"
	"mime"
	"net"
	"net/http"
	"path"
	"strconv"
	"strings"
	"time"
)

// CSP sin 'unsafe-inline' ni 'unsafe-eval': el build de Astro no deja scripts ni estilos inline.
// Trusted Types bloquea cualquier sink de HTML con cadenas (innerHTML y similares).
const csp = "default-src 'none'; " +
	"script-src 'self'; " +
	"style-src 'self'; " +
	"img-src 'self' data:; " +
	"font-src 'self'; " +
	"connect-src 'self'; " +
	"manifest-src 'self'; " +
	"base-uri 'none'; " +
	"form-action 'none'; " +
	"frame-ancestors 'none'; " +
	"object-src 'none'; " +
	"require-trusted-types-for 'script'; " +
	"trusted-types 'none'; " +
	"upgrade-insecure-requests"

type asset struct {
	body  []byte
	etag  string
	ctype string
}

type handler struct {
	files     map[string]*asset // clave: ruta sin "/" inicial, p. ej. "es/index.html"
	notFound  *asset
	collector *collector
	log       *slog.Logger
	limiter   *limiter
	apiLimit  *limiter
}

func newHandler(site fs.FS, c *collector, log *slog.Logger) http.Handler {
	h := &handler{
		files:     map[string]*asset{},
		collector: c,
		log:       log,
		limiter:   newLimiter(30, 120), // 30 peticiones/s por IP, ráfaga de 120 (una carga completa pide ~25 archivos)
		apiLimit:  newLimiter(0.5, 10), // /api/status: 1 cada 2 s por IP, ráfaga de 10
	}
	// Todo el sitio se carga en memoria al arrancar (pesa unos pocos MB) con su ETag calculado una vez.
	_ = fs.WalkDir(site, ".", func(p string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return err
		}
		b, err := fs.ReadFile(site, p)
		if err != nil {
			return err
		}
		sum := sha256.Sum256(b)
		ct := mime.TypeByExtension(path.Ext(p))
		if ct == "" {
			ct = http.DetectContentType(b)
		}
		h.files[p] = &asset{body: b, etag: `"` + hex.EncodeToString(sum[:12]) + `"`, ctype: ct}
		return nil
	})
	h.notFound = h.files["404.html"]
	log.Info("site loaded", "files", len(h.files))
	return h
}

func (h *handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
	setSecurityHeaders(sw.Header())

	defer func() {
		if sw.status >= 400 || strings.HasPrefix(r.URL.Path, "/api/") {
			h.log.Info("request", "method", r.Method, "path", truncate(r.URL.Path, 120), "status", sw.status, "ms", time.Since(start).Milliseconds())
		}
	}()

	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		sw.Header().Set("Allow", "GET, HEAD")
		http.Error(sw, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ip := limitKey(clientIP(r))
	if !h.limiter.allow(ip) {
		sw.Header().Set("Retry-After", "5")
		http.Error(sw, "too many requests", http.StatusTooManyRequests)
		return
	}

	switch r.URL.Path {
	case "/healthz":
		sw.Header().Set("Content-Type", "text/plain; charset=utf-8")
		sw.Header().Set("Cache-Control", "no-store")
		_, _ = sw.Write([]byte("ok\n"))
		return
	case "/api/status":
		if !h.apiLimit.allow(ip) {
			sw.Header().Set("Retry-After", "10")
			http.Error(sw, "too many requests", http.StatusTooManyRequests)
			return
		}
		h.serveStatus(sw, r)
		return
	case "/":
		h.redirectLang(sw, r)
		return
	}

	h.serveStatic(sw, r)
}

func (h *handler) serveStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	body := h.collector.snapshot()
	if body == nil {
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusServiceUnavailable)
		_, _ = w.Write([]byte(`{"ok":false}`))
		return
	}
	// Cloudflare y el navegador pueden reutilizarlo unos segundos: los datos cambian cada 15 s.
	w.Header().Set("Cache-Control", "public, max-age=10")
	if r.Method == http.MethodHead {
		return
	}
	_, _ = w.Write(body)
}

// Idioma de la primera visita: cookie elegida por el visitante > país (Cloudflare) > navegador.
func (h *handler) redirectLang(w http.ResponseWriter, r *http.Request) {
	lang := pickLang(r)
	w.Header().Set("Cache-Control", "private, no-store")
	w.Header().Set("Vary", "Cookie, CF-IPCountry, Accept-Language")
	w.Header().Set("Content-Language", lang)
	http.Redirect(w, r, "/"+lang+"/", http.StatusFound)
}

func (h *handler) serveStatic(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path
	if !strings.HasPrefix(p, "/") || strings.Contains(p, "\x00") || strings.Contains(p, "\\") {
		h.serve404(w, r)
		return
	}
	clean := path.Clean(p)
	key := strings.TrimPrefix(clean, "/")

	// Carpetas: /es -> /es/ y /es/ -> es/index.html
	if a, ok := h.files[key+"/index.html"]; ok {
		if !strings.HasSuffix(p, "/") {
			http.Redirect(w, r, clean+"/", http.StatusMovedPermanently)
			return
		}
		h.writeAsset(w, r, a, "no-cache")
		return
	}
	// Archivos ocultos o el propio 404 no se sirven por su ruta.
	if key == "" || key == "404.html" || (strings.Contains("/"+key, "/.") && key != ".well-known/security.txt") {
		h.serve404(w, r)
		return
	}
	a, ok := h.files[key]
	if !ok || clean != p {
		h.serve404(w, r)
		return
	}
	cache := "public, max-age=3600"
	switch {
	case strings.HasPrefix(key, "_astro/"):
		cache = "public, max-age=31536000, immutable" // nombres con hash del contenido
	case strings.HasSuffix(key, ".html"):
		cache = "no-cache"
	}
	h.writeAsset(w, r, a, cache)
}

func (h *handler) serve404(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	if h.notFound == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", h.notFound.ctype)
	w.WriteHeader(http.StatusNotFound)
	if r.Method != http.MethodHead {
		_, _ = w.Write(h.notFound.body)
	}
}

func (h *handler) writeAsset(w http.ResponseWriter, r *http.Request, a *asset, cache string) {
	hd := w.Header()
	hd.Set("Content-Type", a.ctype)
	hd.Set("Cache-Control", cache)
	hd.Set("ETag", a.etag)
	if match := r.Header.Get("If-None-Match"); match != "" && strings.Contains(match, a.etag) {
		w.WriteHeader(http.StatusNotModified)
		return
	}
	hd.Set("Content-Length", strconv.Itoa(len(a.body)))
	if r.Method == http.MethodHead {
		return
	}
	_, _ = bytes.NewReader(a.body).WriteTo(w)
}

func setSecurityHeaders(h http.Header) {
	h.Set("Content-Security-Policy", csp)
	h.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("X-Frame-Options", "DENY")
	h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
	h.Set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()")
	h.Set("Cross-Origin-Opener-Policy", "same-origin")
	h.Set("Cross-Origin-Resource-Policy", "same-origin")
	h.Set("X-Permitted-Cross-Domain-Policies", "none")
}

// La IP real la pone Cloudflare en CF-Connecting-IP. Se puede confiar en ella porque el pod
// solo acepta tráfico de cloudflared (NetworkPolicy) y no hay Ingress que la deje falsificar.
func clientIP(r *http.Request) string {
	if v := strings.TrimSpace(r.Header.Get("CF-Connecting-IP")); v != "" {
		if ip := net.ParseIP(v); ip != nil {
			return ip.String()
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// limitKey agrupa IPv6 por /64: un atacante suele tener un /64 entero y podría rotar direcciones
// para esquivar el límite o llenar la tabla.
func limitKey(ip string) string {
	p := net.ParseIP(ip)
	if p == nil || p.To4() != nil {
		return ip
	}
	return p.Mask(net.CIDRMask(64, 128)).String() + "/64"
}

var spanishCountries = map[string]bool{
	"SV": true, "GT": true, "HN": true, "NI": true, "CR": true, "PA": true, "MX": true, "CU": true,
	"DO": true, "PR": true, "CO": true, "VE": true, "EC": true, "PE": true, "BO": true, "CL": true,
	"AR": true, "UY": true, "PY": true, "ES": true, "GQ": true,
}

func pickLang(r *http.Request) string {
	if c, err := r.Cookie("lang"); err == nil && (c.Value == "es" || c.Value == "en") {
		return c.Value
	}
	if cc := strings.ToUpper(strings.TrimSpace(r.Header.Get("CF-IPCountry"))); len(cc) == 2 {
		if spanishCountries[cc] {
			return "es"
		}
		if cc != "XX" && cc != "T1" { // XX: desconocido; T1: Tor. Ahí decide el navegador.
			return "en"
		}
	}
	if al := strings.ToLower(r.Header.Get("Accept-Language")); strings.HasPrefix(strings.TrimSpace(al), "es") {
		return "es"
	}
	return "en"
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (s *statusWriter) WriteHeader(code int) {
	s.status = code
	s.ResponseWriter.WriteHeader(code)
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n]
}
