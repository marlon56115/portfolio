package main

import (
	"mime"
	"sync"
	"time"
)

func init() {
	// Tipos que no siempre trae la tabla de Go ni la imagen distroless (no tiene /etc/mime.types).
	for ext, t := range map[string]string{
		".woff2":       "font/woff2",
		".woff":        "font/woff",
		".txt":         "text/plain; charset=utf-8",
		".ico":         "image/x-icon",
		".webmanifest": "application/manifest+json",
	} {
		_ = mime.AddExtensionType(ext, t)
	}
}

// limiter: un token bucket por IP, en memoria. Con una sola réplica basta; Cloudflare frena antes
// los abusos grandes. El mapa tiene tope de tamaño para que no se pueda usar para agotar memoria.
type limiter struct {
	mu      sync.Mutex
	rate    float64 // tokens por segundo
	burst   float64
	buckets map[string]*bucket
	maxKeys int
	lastGC  time.Time
}

type bucket struct {
	tokens float64
	last   time.Time
}

func newLimiter(rate, burst float64) *limiter {
	return &limiter{rate: rate, burst: burst, buckets: map[string]*bucket{}, maxKeys: 20000, lastGC: time.Now()}
}

func (l *limiter) allow(key string) bool {
	now := time.Now()
	l.mu.Lock()
	defer l.mu.Unlock()

	// Limpieza periódica; si la tabla se llena, como mucho una vez por segundo para que un flood
	// de IP distintas no convierta cada petición en un recorrido completo bajo el candado.
	if since := now.Sub(l.lastGC); since > time.Minute || (len(l.buckets) >= l.maxKeys && since > time.Second) {
		l.gc(now)
	}
	b, ok := l.buckets[key]
	if !ok {
		if len(l.buckets) >= l.maxKeys {
			return false // tabla llena incluso tras limpiar: se rechaza en vez de crecer
		}
		b = &bucket{tokens: l.burst, last: now}
		l.buckets[key] = b
	}
	b.tokens += now.Sub(b.last).Seconds() * l.rate
	if b.tokens > l.burst {
		b.tokens = l.burst
	}
	b.last = now
	if b.tokens < 1 {
		return false
	}
	b.tokens--
	return true
}

// gc borra los buckets que ya se rellenaron del todo (nadie los está usando).
func (l *limiter) gc(now time.Time) {
	full := time.Duration(l.burst/l.rate*float64(time.Second)) + time.Second
	for k, b := range l.buckets {
		if now.Sub(b.last) > full {
			delete(l.buckets, k)
		}
	}
	l.lastGC = now
}
