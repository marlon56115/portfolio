// Sección "autoalojado": panel en vivo y flujos interactivos.
// - Panel: consulta /api/status solo mientras está a la vista y la pestaña visible.
// - Flujos: pasar el cursor, enfocar o tocar una etapa muestra su descripción.
// - Cada respuesta real dispara un "ping" que recorre el camino de ida y vuelta.
// Respeta prefers-reduced-motion (sin conteo animado ni ping; CSS quita los bucles).

import { $, $$, finePointer, pageLang, reducedMotion } from '../../lib/dom';
import { fetchStatus, fmtCount, fmtUptime, onStatus, startPolling, stopPolling, type Status } from '../status';

const POLL_MS = 15000;

export function initSystem(): void {
  $$<HTMLElement>('[data-flow]').forEach(initFlow);
  initPanel();
}

// ---------- flujos ----------
function initFlow(flow: HTMLElement): void {
  const stages = $$<HTMLButtonElement>('[data-stage]', flow);
  const items = $$<HTMLElement>('[data-detail]', flow);
  const select = (btn: HTMLButtonElement) => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    stages.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    items.forEach((it) => it.classList.toggle('is-on', it.dataset.detail === btn.dataset.stage));
  };
  stages.forEach((b) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('focus', () => select(b));
    b.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && finePointer.matches) select(b);
    });
  });
  // Flechas para moverse entre etapas (como una barra de herramientas).
  flow.addEventListener('keydown', (e) => {
    const i = stages.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: stages.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    stages[(next + stages.length) % stages.length].focus();
  });

  // Los bucles CSS se pausan fuera de pantalla.
  new IntersectionObserver((es) => es.forEach((en) => flow.classList.toggle('is-visible', en.isIntersecting))).observe(flow);
}

// Ping: la petición real recorre las etapas de ida y vuelta (solo opacidad).
function ping(): void {
  if (reducedMotion.matches) return;
  const flow = $('[data-flow="path"]');
  if (!flow || !flow.classList.contains('is-visible')) return;
  const marks = $$<HTMLElement>('.stage-ping', flow);
  const route = [...marks, ...marks.slice(0, -1).reverse()];
  route.forEach((m, i) =>
    m.animate([{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], { duration: 420, delay: i * 110, easing: 'ease-out' }),
  );
  const led = $('[data-ping-led]', flow);
  led?.animate([{ opacity: 0.3 }, { opacity: 1 }, { opacity: 0.3 }], { duration: 600, delay: route.length * 110 });
}

// ---------- panel ----------
function initPanel(): void {
  const panel = $('[data-status-panel]');
  if (!panel) return;
  const lang = pageLang();
  const L = {
    es: { connecting: 'conectando…', online: 'en línea', offline: 'sin señal · reintentando', updated: 'actualizado' },
    en: { connecting: 'connecting…', online: 'online', offline: 'no signal · retrying', updated: 'updated' },
  }[lang];
  const locale = lang === 'es' ? 'es-SV' : 'en-US';

  const metric = (k: string) => $(`[data-metric="${k}"]`, panel);
  const set = (k: string, v: string) => {
    const el = metric(k);
    if (el && el.textContent !== v) el.textContent = v;
  };
  const led = $('[data-status-led]', panel);
  const state = $('[data-status-state]', panel);
  const time = $('[data-status-time]', panel);
  const pingMs = $('[data-ping-ms]');
  const pingLed = $('[data-ping-led]');

  const idle = (k: 'cpu' | 'memory', on: boolean) => {
    const tile = $(`[data-tile="${k}"]`, panel);
    const note = $(`[data-note="${k}"]`, panel);
    tile?.toggleAttribute('data-idle', on);
    if (note) note.textContent = (on ? note.dataset.noteIdle : note.dataset.noteOn) ?? '';
    if (on) set(k, '—');
  };

  // Conteo animado del contador de páginas.
  let shownReq = -1;
  let raf = 0;
  let settle = 0;
  const countTo = (target: number) => {
    cancelAnimationFrame(raf);
    const from = shownReq < 0 ? Math.max(0, target - Math.min(target, 40)) : shownReq;
    // El valor final siempre se escribe, aunque el navegador no dé cuadros (pestaña en segundo plano).
    window.clearTimeout(settle);
    settle = window.setTimeout(() => {
      cancelAnimationFrame(raf);
      shownReq = target;
      set('requests', fmtCount(target, lang));
    }, 800);
    if (reducedMotion.matches || from === target || document.visibilityState !== 'visible') {
      shownReq = target;
      set('requests', fmtCount(target, lang));
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 700);
      const v = Math.round(from + (target - from) * (1 - (1 - p) ** 3));
      set('requests', fmtCount(v, lang));
      shownReq = v;
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const spark = (values: number[]) => {
    const svg = $<SVGSVGElement>('[data-spark]', panel);
    if (!svg) return;
    const w = 240;
    const h = 64;
    const pts = values.length === 1 ? [values[0], values[0]] : values;
    const max = Math.max(0.2, ...pts) * 1.15;
    const xy = pts.map((v, i) => [(i / (pts.length - 1)) * w, h - 2 - (v / max) * (h - 6)] as const);
    const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    svg.querySelector('.spark-line')?.setAttribute('d', line);
    svg.querySelector('.spark-area')?.setAttribute('d', `${line} L${w} ${h} L0 ${h} Z`);
  };

  const render = (s: Status | null) => {
    if (!s) {
      panel.dataset.state = 'offline';
      led?.classList.add('is-off');
      led?.classList.remove('is-pulse');
      if (state) state.textContent = L.offline;
      set('latency', '—');
      if (pingMs) pingMs.textContent = '—';
      pingLed?.classList.add('is-off');
      return;
    }
    panel.dataset.state = 'online';
    led?.classList.remove('is-off');
    if (!reducedMotion.matches) led?.classList.add('is-pulse');
    if (state) state.textContent = L.online;

    if (s.uptimeSeconds !== undefined) set('uptime', fmtUptime(s.uptimeSeconds, lang));
    if (s.requestsServed !== undefined) countTo(s.requestsServed);
    if (s.latencyMs !== undefined) {
      set('latency', String(Math.max(1, s.latencyMs)));
      if (pingMs) pingMs.textContent = `${Math.max(1, s.latencyMs)} ms`;
      pingLed?.classList.remove('is-off');
    }

    if (s.cpu !== undefined) {
      idle('cpu', false);
      set('cpu', (s.cpu * 100).toFixed(s.cpu < 0.1 ? 1 : 0));
      spark(s.cpuHistory?.length ? s.cpuHistory : [s.cpu]);
    } else idle('cpu', true);

    if (s.memory !== undefined) {
      idle('memory', false);
      set('memory', (s.memory * 100).toFixed(s.memory < 0.1 ? 1 : 0));
      const g = $<HTMLElement>('[data-gauge="memory"]', panel);
      if (g) g.style.transform = `scaleX(${s.memory})`;
    } else {
      idle('memory', true);
      const g = $<HTMLElement>('[data-gauge="memory"]', panel);
      if (g) g.style.transform = 'scaleX(0)';
    }

    if (time) {
      const d = s.generatedAt ? new Date(s.generatedAt) : new Date();
      time.textContent = `${L.updated} ${d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
    ping();
  };
  onStatus(render);

  // Solo se consulta mientras el panel está a la vista (startPolling ya se salta pestañas ocultas).
  let polling = false;
  new IntersectionObserver(
    (es) => {
      const on = es.some((e) => e.isIntersecting);
      if (on && !polling) startPolling(POLL_MS);
      if (!on && polling) stopPolling();
      polling = on;
    },
    { rootMargin: '120px 0px' },
  ).observe(panel);

  // Una consulta inicial para la línea de estado del hero, aunque el panel no se vea todavía.
  void fetchStatus();
}
