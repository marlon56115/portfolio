// Sección "autoalojado": panel de métricas en vivo y diagrama de arquitectura.
// Dueño en la fase 2: pf-system. Movido tal cual desde main.ts, salvo que ya NO se muestran
// SO ni versión del orquestador (regla de privacidad); el servidor todavía los envía (pendiente).

import { $, $$, pageLang } from '../../lib/dom';
import { fetchStatus, fmtRate, fmtUptime, onStatus, pct, startPolling, type Status } from '../status';

export function initSystem(): void {
  const lang = pageLang();

  // ---------- diagrama ----------
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

  // ---------- panel ----------
  const panel = $('[data-status-panel]');
  if (!panel) return;
  const set = (k: string, v: string) => $$(`[data-metric="${k}"]`).forEach((el) => (el.textContent = v));
  const bar = (k: string, v: number) => {
    const el = $(`[data-bar="${k}"]`);
    if (el) el.style.width = `${Math.max(0, Math.min(1, v)) * 100}%`;
  };
  const L = {
    es: { updated: 'actualizado', offline: 'sin conexión con las métricas', ns: 'servicios' },
    en: { updated: 'updated', offline: 'metrics unreachable', ns: 'services' },
  }[lang];

  const spark = (values: number[]) => {
    const svg = $<SVGSVGElement>('[data-spark]');
    if (!svg || values.length < 2) return;
    const w = 240;
    const h = 56;
    const max = Math.max(0.25, ...values) * 1.1;
    const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - (v / max) * (h - 4) - 2] as const);
    const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    svg.querySelector('.spark-line')?.setAttribute('d', line);
    svg.querySelector('.spark-area')?.setAttribute('d', `${line} L${w} ${h} L0 ${h} Z`);
  };

  const render = (s: Status | null) => {
    const led = $('[data-status-led]');
    const meta = $('[data-status-meta]');
    if (!s) {
      panel.setAttribute('data-state', 'offline');
      led?.classList.add('is-off');
      if (meta) meta.textContent = L.offline;
      return;
    }
    panel.setAttribute('data-state', 'online');
    led?.classList.remove('is-off');
    led?.classList.add('is-pulse');
    if (s.uptimeSeconds !== undefined) set('uptime', fmtUptime(s.uptimeSeconds, lang));
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
    if (s.cpuHistory) spark(s.cpuHistory);
    if (meta) {
      const d = s.generatedAt ? new Date(s.generatedAt) : new Date();
      meta.textContent = `${L.updated} ${d.toLocaleTimeString(lang === 'es' ? 'es-SV' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  };
  onStatus(render);

  // Solo se consulta mientras el panel está a la vista.
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
