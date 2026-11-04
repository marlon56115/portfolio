// Cliente del endpoint /api/status (servidor Go). Una sola petición compartida por toda la página.

export interface Status {
  ok: boolean;
  generatedAt: string;
  uptimeSeconds?: number;
  cpu?: number;
  memory?: number;
  memoryTotalBytes?: number;
  pods?: number;
  namespaces?: number;
  cpuTempC?: number;
  netRxBps?: number;
  netTxBps?: number;
  diskData?: number;
  k8s?: string;
  os?: string;
  cpuHistory?: number[];
}

type Listener = (s: Status | null) => void;
const listeners = new Set<Listener>();
let last: Status | null = null;
let timer: number | undefined;
let inflight: Promise<Status | null> | null = null;

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function sanitize(raw: unknown): Status | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.ok !== true) return null;
  const s: Status = { ok: true, generatedAt: typeof r.generatedAt === 'string' ? r.generatedAt : '' };
  for (const k of ['uptimeSeconds', 'cpu', 'memory', 'memoryTotalBytes', 'pods', 'namespaces', 'cpuTempC', 'netRxBps', 'netTxBps', 'diskData'] as const) {
    if (isNum(r[k])) s[k] = r[k] as number;
  }
  if (typeof r.k8s === 'string') s.k8s = r.k8s.slice(0, 32);
  if (typeof r.os === 'string') s.os = r.os.slice(0, 48);
  if (Array.isArray(r.cpuHistory)) s.cpuHistory = r.cpuHistory.filter(isNum).slice(-120);
  return s;
}

export async function fetchStatus(): Promise<Status | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const ctrl = new AbortController();
      const to = window.setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch('/api/status', { headers: { accept: 'application/json' }, signal: ctrl.signal, cache: 'no-store' });
      window.clearTimeout(to);
      if (!res.ok) throw new Error(String(res.status));
      last = sanitize(await res.json());
    } catch {
      last = null;
    } finally {
      inflight = null;
    }
    listeners.forEach((l) => l(last));
    return last;
  })();
  return inflight;
}

export function onStatus(l: Listener) {
  listeners.add(l);
  if (last) l(last);
}

export function startPolling(ms = 15000) {
  const tick = () => {
    if (document.visibilityState === 'visible') void fetchStatus();
  };
  tick();
  window.clearInterval(timer);
  timer = window.setInterval(tick, ms);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') tick();
  });
}

// ---------- formato ----------
export function fmtUptime(sec: number, lang: string): string {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const dl = lang === 'es' ? 'd' : 'd';
  if (d > 0) return `${d}${dl} ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
export const pct = (v: number) => `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`;
export function fmtBytes(b: number): string {
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (b >= 1024 && i < u.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(b < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}
export const fmtRate = (bps: number) => `${fmtBytes(bps)}/s`;
