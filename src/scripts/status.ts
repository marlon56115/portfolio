// Cliente de /api/status (servidor Go). Una sola petición compartida por toda la página:
// la usan el panel de la sección "autoalojado", la línea de estado del hero y la terminal.
//
// Contrato (todo opcional salvo ok/generatedAt; el cliente sanea cada campo):
//   { ok, generatedAt (ISO), uptimeSeconds (proceso, múltiplo de 60), requestsServed (páginas HTML
//     desde que arrancó), cpu 0–1, memory 0–1, cpuHistory 0–1[] (≤ 60 puntos, uno por minuto) }
// `latencyMs` no viene del servidor: es el viaje de ida y vuelta medido en este navegador.

export interface Status {
  ok: boolean;
  generatedAt: string;
  uptimeSeconds?: number;
  requestsServed?: number;
  cpu?: number;
  memory?: number;
  cpuHistory?: number[];
  /** Ida y vuelta de esta petición medida en el navegador (ms). */
  latencyMs?: number;
}

type Listener = (s: Status | null) => void;
const listeners = new Set<Listener>();
let last: Status | null = null;
let timer: number | undefined;
let inflight: Promise<Status | null> | null = null;
let visibilityBound = false;

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const unit = (v: unknown): number | undefined => (isNum(v) ? Math.min(1, Math.max(0, v)) : undefined);
const count = (v: unknown, max: number): number | undefined => (isNum(v) && v >= 0 ? Math.min(Math.floor(v), max) : undefined);
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/** Acepta solo los campos del contrato, con tipo y rango; todo lo demás se descarta. */
export function sanitize(raw: unknown): Status | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.ok !== true) return null;
  const s: Status = { ok: true, generatedAt: typeof r.generatedAt === 'string' && ISO.test(r.generatedAt) ? r.generatedAt : '' };
  const up = count(r.uptimeSeconds, 1e10);
  if (up !== undefined) s.uptimeSeconds = up;
  const req = count(r.requestsServed, Number.MAX_SAFE_INTEGER);
  if (req !== undefined) s.requestsServed = req;
  const cpu = unit(r.cpu);
  if (cpu !== undefined) s.cpu = cpu;
  const mem = unit(r.memory);
  if (mem !== undefined) s.memory = mem;
  if (Array.isArray(r.cpuHistory)) {
    const h = r.cpuHistory.filter(isNum).slice(-60).map((v) => Math.min(1, Math.max(0, v)));
    if (h.length) s.cpuHistory = h;
  }
  return s;
}

export async function fetchStatus(): Promise<Status | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    const ctrl = new AbortController();
    const to = window.setTimeout(() => ctrl.abort(), 6000);
    try {
      const t0 = performance.now();
      const res = await fetch('/api/status', { headers: { accept: 'application/json' }, signal: ctrl.signal, cache: 'no-store' });
      const body: unknown = await res.json();
      const rtt = performance.now() - t0;
      last = res.ok ? sanitize(body) : null;
      if (last) last.latencyMs = Math.round(rtt);
    } catch {
      last = null;
    } finally {
      window.clearTimeout(to);
      inflight = null;
    }
    listeners.forEach((l) => l(last));
    return last;
  })();
  return inflight;
}

/** Suscribe a cada resultado (null = sin respuesta). Si ya hay uno, se entrega enseguida. */
export function onStatus(l: Listener): () => void {
  listeners.add(l);
  if (last) l(last);
  return () => listeners.delete(l);
}

export const lastStatus = (): Status | null => last;

/** Consulta cada `ms` mientras la pestaña está visible. Llamarla otra vez solo reinicia el reloj. */
export function startPolling(ms = 15000): void {
  const tick = () => {
    if (document.visibilityState === 'visible') void fetchStatus();
  };
  tick();
  window.clearInterval(timer);
  timer = window.setInterval(tick, ms);
  if (!visibilityBound) {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && timer !== undefined) tick();
    });
  }
}

export function stopPolling(): void {
  window.clearInterval(timer);
  timer = undefined;
}

// ---------- formato ----------
/** Tiempo activo redondeado: "3d 4h", "5h 12m", "8m". */
export function fmtUptime(sec: number, _lang?: string): string {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${Math.max(1, m)}m`;
}
export const pct = (v: number) => `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`;
/** Número con separadores del idioma: 12 345 / 12,345. */
export const fmtCount = (n: number, lang = 'en') => new Intl.NumberFormat(lang === 'es' ? 'es-SV' : 'en-US').format(n);
export const fmtMs = (ms: number) => `${Math.max(1, Math.round(ms))} ms`;
