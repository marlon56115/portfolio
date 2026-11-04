import { fetchStatus, fmtRate, fmtUptime, onStatus, pct, startPolling, type Status } from './status';
import { initTerminal } from './terminal';

const root = document.documentElement;
const lang = root.dataset.lang === 'es' ? 'es' : 'en';
const $ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) => el.querySelector<T>(sel as string) as T | null;
const $$ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(sel as string));

// ---------- tema ----------
const media = window.matchMedia('(prefers-color-scheme: dark)');
function storedTheme(): 'light' | 'dark' | null {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}
export function applyTheme(theme: 'light' | 'dark', persist: boolean) {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* modo privado: no pasa nada */
    }
  }
}
applyTheme(storedTheme() ?? (media.matches ? 'dark' : 'light'), false);
media.addEventListener('change', (e) => {
  if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light', false);
});
$('[data-theme-toggle]')?.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

// ---------- idioma: la elección manual gana a la detección por país ----------
export function rememberLang(l: 'es' | 'en') {
  document.cookie = `lang=${l}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}
$$<HTMLAnchorElement>('[data-set-lang]').forEach((a) =>
  a.addEventListener('click', () => {
    const l = a.dataset.setLang === 'es' ? 'es' : 'en';
    rememberLang(l);
    if (location.hash) a.href = `/${l}/${location.hash}`;
  }),
);

// ---------- cabecera y navegación ----------
const header = $('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const navLinks = $$<HTMLAnchorElement>('[data-nav]');
const sections = navLinks.map((a) => document.getElementById(a.dataset.nav ?? '')).filter(Boolean) as HTMLElement[];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === e.target.id));
    });
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
sections.forEach((s) => navObserver.observe(s));

// ---------- aparición al hacer scroll ----------
const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      }
    }),
  { rootMargin: '0px 0px -8% 0px' },
);
$$('[data-reveal]').forEach((el) => reveal.observe(el));

// ---------- copiar correo ----------
$$<HTMLButtonElement>('[data-copy]').forEach((b) =>
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy ?? '');
      const prev = b.textContent;
      b.textContent = b.dataset.copied ?? 'ok';
      window.setTimeout(() => (b.textContent = prev), 1400);
    } catch {
      /* sin permiso de portapapeles */
    }
  }),
);

// ---------- galerías ----------
$$('[data-gallery]').forEach((g) => {
  const screens = $$<HTMLImageElement>('[data-screen]', g);
  const thumbs = $$<HTMLButtonElement>('[data-thumb]', g);
  thumbs.forEach((b) =>
    b.addEventListener('click', () => {
      const i = b.dataset.thumb;
      screens.forEach((s) => (s.hidden = s.dataset.screen !== i));
      thumbs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    }),
  );
});

// ---------- diagrama de arquitectura ----------
const arch = $('[data-arch]');
if (arch) {
  const nodes = $$<HTMLButtonElement>('[data-node]', arch);
  const details = $$('[data-detail]', arch);
  nodes.forEach((n) =>
    n.addEventListener('click', () => {
      nodes.forEach((m) => m.setAttribute('aria-pressed', String(m === n)));
      details.forEach((d) => (d.hidden = d.dataset.detail !== n.dataset.node));
    }),
  );
}

// ---------- panel en vivo ----------
const panel = $('[data-status-panel]');
const metric = (k: string) => $$(`[data-metric="${k}"]`);
const set = (k: string, v: string) => metric(k).forEach((el) => (el.textContent = v));
const bar = (k: string, v: number) => {
  const el = $(`[data-bar="${k}"]`);
  if (el) el.style.width = `${Math.max(0, Math.min(1, v)) * 100}%`;
};
const L = {
  es: { updated: 'actualizado', offline: 'sin conexión con Prometheus', ns: 'namespaces', serving: 'servido desde homelab · uptime' },
  en: { updated: 'updated', offline: 'Prometheus unreachable', ns: 'namespaces', serving: 'served from homelab · uptime' },
}[lang];

function spark(values: number[]) {
  const svg = $<SVGSVGElement>('[data-spark]');
  if (!svg || values.length < 2) return;
  const w = 240;
  const h = 56;
  const max = Math.max(0.25, ...values) * 1.1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - (v / max) * (h - 4) - 2] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  svg.querySelector('.spark-line')?.setAttribute('d', line);
  svg.querySelector('.spark-area')?.setAttribute('d', `${line} L${w} ${h} L0 ${h} Z`);
}

function render(s: Status | null) {
  const led = $('[data-status-led]');
  const meta = $('[data-status-meta]');
  const heroLed = $('[data-hero-led]');
  const heroStatus = $('[data-hero-status]');
  if (!s) {
    panel?.setAttribute('data-state', 'offline');
    led?.classList.add('is-off');
    heroLed?.classList.add('is-off');
    if (meta) meta.textContent = L.offline;
    return;
  }
  panel?.setAttribute('data-state', 'online');
  led?.classList.remove('is-off');
  led?.classList.add('is-pulse');
  heroLed?.classList.remove('is-off');
  if (s.uptimeSeconds !== undefined) {
    set('uptime', fmtUptime(s.uptimeSeconds, lang));
    if (heroStatus) heroStatus.textContent = `${L.serving} ${fmtUptime(s.uptimeSeconds, lang)}`;
  }
  if (s.cpu !== undefined) {
    set('cpu', pct(s.cpu));
    bar('cpu', s.cpu);
  }
  if (s.memory !== undefined) {
    set('mem', pct(s.memory));
    bar('mem', s.memory);
  }
  if (s.pods !== undefined) set('pods', String(s.pods));
  if (s.namespaces !== undefined) set('namespaces', `${s.namespaces} ${L.ns}`);
  if (s.cpuTempC !== undefined) set('temp', `${s.cpuTempC.toFixed(0)} °C`);
  if (s.netRxBps !== undefined && s.netTxBps !== undefined) set('net', `↓ ${fmtRate(s.netRxBps)}\n↑ ${fmtRate(s.netTxBps)}`);
  if (s.diskData !== undefined) {
    set('disk', pct(s.diskData));
    bar('disk', s.diskData);
  }
  const sys = [s.os, s.k8s ? `k3s ${s.k8s}` : ''].filter(Boolean).join(' · ');
  set('sys', sys);
  if (s.cpuHistory) spark(s.cpuHistory);
  if (meta) {
    const d = s.generatedAt ? new Date(s.generatedAt) : new Date();
    meta.textContent = `${L.updated} ${d.toLocaleTimeString(lang === 'es' ? 'es-SV' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  }
}
onStatus(render);

// Solo se consulta mientras el panel o el hero están a la vista.
if (panel) {
  let polling = false;
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && !polling) {
      polling = true;
      startPolling(15000);
    }
  });
  io.observe(panel);
  void fetchStatus();
}

initTerminal({ lang, applyTheme, rememberLang });
