package main

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"testing/fstest"
	"time"
)

func testHandler(t *testing.T) http.Handler {
	t.Helper()
	site := fstest.MapFS{
		"es/index.html":            {Data: []byte("<html>es</html>")},
		"en/index.html":            {Data: []byte("<html>en</html>")},
		"404.html":                 {Data: []byte("<html>404</html>")},
		"_astro/app.abc.js":        {Data: []byte("console.log(1)")},
		"theme-init.js":            {Data: []byte("1")},
		".well-known/x":            {Data: []byte("secret")},
		".well-known/security.txt": {Data: []byte("Contact: mailto:x")},
		".env":                     {Data: []byte("secret")},
	}
	log := slog.New(slog.NewTextHandler(io.Discard, nil))
	return newHandler(site, newCollector("", time.Second, log), log)
}

func do(h http.Handler, method, target string, hdr map[string]string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, target, nil)
	for k, v := range hdr {
		r.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	return w
}

func TestLangRedirect(t *testing.T) {
	h := testHandler(t)
	cases := []struct {
		name string
		hdr  map[string]string
		want string
	}{
		{"default english", nil, "/en/"},
		{"salvador", map[string]string{"CF-IPCountry": "SV"}, "/es/"},
		{"spain lowercase", map[string]string{"CF-IPCountry": "es"}, "/es/"},
		{"us", map[string]string{"CF-IPCountry": "US", "Accept-Language": "es-ES"}, "/en/"},
		{"unknown country uses browser", map[string]string{"CF-IPCountry": "XX", "Accept-Language": "es-MX,es;q=0.9"}, "/es/"},
		{"cookie wins", map[string]string{"CF-IPCountry": "SV", "Cookie": "lang=en"}, "/en/"},
		{"bad cookie ignored", map[string]string{"Cookie": "lang=../../x", "Accept-Language": "es"}, "/es/"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			w := do(h, "GET", "/", c.hdr)
			if w.Code != http.StatusFound || w.Header().Get("Location") != c.want {
				t.Fatalf("got %d %q, want 302 %q", w.Code, w.Header().Get("Location"), c.want)
			}
			if !strings.Contains(w.Header().Get("Cache-Control"), "no-store") {
				t.Fatal("language redirect must not be cached")
			}
		})
	}
}

func TestSecurityHeadersEverywhere(t *testing.T) {
	h := testHandler(t)
	for _, p := range []string{"/", "/es/", "/nope", "/api/status", "/healthz"} {
		w := do(h, "GET", p, nil)
		csp := w.Header().Get("Content-Security-Policy")
		if !strings.Contains(csp, "default-src 'none'") || strings.Contains(csp, "unsafe-inline") {
			t.Fatalf("%s: weak or missing CSP: %q", p, csp)
		}
		for _, k := range []string{"Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"} {
			if w.Header().Get(k) == "" {
				t.Fatalf("%s: missing %s", p, k)
			}
		}
	}
}

func TestStatic(t *testing.T) {
	h := testHandler(t)
	if w := do(h, "GET", "/es/", nil); w.Code != 200 || w.Body.String() != "<html>es</html>" {
		t.Fatalf("es: %d %q", w.Code, w.Body.String())
	}
	if w := do(h, "GET", "/es", nil); w.Code != http.StatusMovedPermanently || w.Header().Get("Location") != "/es/" {
		t.Fatalf("es redirect: %d %q", w.Code, w.Header().Get("Location"))
	}
	w := do(h, "GET", "/_astro/app.abc.js", nil)
	if w.Code != 200 || !strings.Contains(w.Header().Get("Cache-Control"), "immutable") {
		t.Fatalf("asset: %d %q", w.Code, w.Header().Get("Cache-Control"))
	}
	etag := w.Header().Get("ETag")
	if w := do(h, "GET", "/_astro/app.abc.js", map[string]string{"If-None-Match": etag}); w.Code != http.StatusNotModified {
		t.Fatalf("etag: %d", w.Code)
	}
}

func TestNothingLeaks(t *testing.T) {
	h := testHandler(t)
	for _, p := range []string{
		"/../../etc/passwd", "/es/../../main.go", "/%2e%2e/%2e%2e/etc/passwd", "/.well-known/x",
		"/404.html", "/.env", "/es/.env", "/es/index.html/", "/_astro/", "/main.go", "/es\\..\\x",
	} {
		w := do(h, "GET", p, nil)
		if w.Code == 200 && !strings.Contains(w.Body.String(), "<html>") {
			t.Fatalf("%s served unexpected content", p)
		}
		if strings.Contains(w.Body.String(), "secret") {
			t.Fatalf("%s leaked a hidden file", p)
		}
	}
}

func TestSecurityTxt(t *testing.T) {
	if w := do(testHandler(t), "GET", "/.well-known/security.txt", nil); w.Code != 200 {
		t.Fatalf("security.txt: %d", w.Code)
	}
}

func TestMethods(t *testing.T) {
	h := testHandler(t)
	for _, m := range []string{"POST", "PUT", "DELETE", "PATCH", "OPTIONS", "TRACE"} {
		if w := do(h, m, "/es/", nil); w.Code != http.StatusMethodNotAllowed {
			t.Fatalf("%s: %d", m, w.Code)
		}
	}
	if w := do(h, "HEAD", "/es/", nil); w.Code != 200 || w.Body.Len() != 0 {
		t.Fatalf("HEAD: %d len %d", w.Code, w.Body.Len())
	}
}

func TestStatusUnavailableWithoutPrometheus(t *testing.T) {
	h := testHandler(t)
	w := do(h, "GET", "/api/status", nil)
	if w.Code != http.StatusServiceUnavailable || w.Body.String() != `{"ok":false}` {
		t.Fatalf("%d %q", w.Code, w.Body.String())
	}
}

func TestRateLimitPerIP(t *testing.T) {
	h := testHandler(t)
	limited := 0
	for i := 0; i < 30; i++ {
		if do(h, "GET", "/api/status", map[string]string{"CF-Connecting-IP": "203.0.113.7"}).Code == http.StatusTooManyRequests {
			limited++
		}
	}
	if limited == 0 {
		t.Fatal("api limiter never kicked in")
	}
	if w := do(h, "GET", "/api/status", map[string]string{"CF-Connecting-IP": "203.0.113.8"}); w.Code == http.StatusTooManyRequests {
		t.Fatal("another IP must not be limited")
	}
}

func TestLimiterBoundedMemory(t *testing.T) {
	l := newLimiter(1, 1)
	l.maxKeys = 100
	for i := 0; i < 1000; i++ {
		l.allow(strings.Repeat("x", i%50) + string(rune('a'+i%26)) + time.Now().String())
	}
	if len(l.buckets) > 100 {
		t.Fatalf("limiter grew to %d keys", len(l.buckets))
	}
}
