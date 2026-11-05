// Traza de la carrera (Work.astro): pestañas accesibles, reescalado con la fecha de hoy y cursor de osciloscopio.
// - Pestañas: patrón ARIA tabs vertical (flechas, Inicio/Fin), foco itinerante.
// - Reescalado: las posiciones del build se recalculan con el mes actual (el sitio puede no reconstruirse).
// - Cursor: solo con ratón; lee el mes bajo el puntero. Una lectura de layout al entrar, escrituras con transform.
// - Enlaces #job-<id> (desde el stack o la terminal) eligen ese puesto.

import { $, $$, finePointer, pageLang, reducedMotion } from '../../lib/dom';
import { currentYM, formatYM, monthsBetween, parseYM } from '../../lib/time';

export function initTrace(): void {
  const root = $('[data-trace]');
  if (!root) return;
  const start = root.dataset.start ?? '2022-04';
  const tabs = $$<HTMLButtonElement>('[data-tab]', root);
  const panels = $$<HTMLElement>('[data-panel]', root);
  if (!tabs.length) return;

  rescale(root, start, tabs);

  const select = (i: number, focus = false) => {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const id = tabs[i].dataset.tab;
    panels.forEach((p) => p.toggleAttribute('data-active', p.dataset.panel === id));
    if (focus) tabs[i].focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let next = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next < 0) return;
      e.preventDefault();
      select(next, true);
    });
  });

  // #job-<id>: elige el puesto (al cargar, al cambiar el hash y al pulsar un enlace al mismo hash).
  const fromHash = (hash: string): boolean => {
    const m = /^#job-(.+)$/.exec(hash);
    if (!m) return false;
    const i = tabs.findIndex((t) => t.dataset.tab === m[1]);
    if (i < 0) return false;
    select(i);
    return true;
  };
  fromHash(location.hash);
  window.addEventListener('hashchange', () => fromHash(location.hash));
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#job-"]');
    if (a) fromHash(a.getAttribute('href') ?? '');
  });

  initCursor(root, start, tabs[0]);
}

/** Recalcula x/width de cada canal y de la regla con el mes actual. */
function rescale(root: HTMLElement, start: string, tabs: HTMLButtonElement[]): void {
  const now = currentYM();
  const total = monthsBetween(start, now) + 1;
  const pct = (n: number) => `${Math.min(100, Math.max(0, (n / total) * 100)).toFixed(3)}%`;
  tabs.forEach((t) => {
    const from = t.dataset.from ?? start;
    const to = t.dataset.to || null;
    const a = monthsBetween(start, from);
    const b = to ? monthsBetween(start, to) + 1 : total;
    const xa = pct(a);
    const xb = to ? pct(b) : '100%';
    const set = (sel: string, attrs: Record<string, string>) =>
      $$(sel, t).forEach((n) => Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)));
    set('[data-fill]', { x: xa, width: pct(b - a) });
    set('[data-lo-a]', { x2: xa });
    set('[data-rise]', { x1: xa, x2: xa });
    set('[data-hi]', { x1: xa, x2: xb });
    set('[data-fall]', { x1: xb, x2: xb });
    set('[data-lo-b]', { x1: xb });
  });
  $$<SVGGElement>('[data-year-tick]', root).forEach((g) => {
    const x = pct(monthsBetween(start, `${g.dataset.yearTick}-01`));
    g.querySelectorAll('line').forEach((l) => (l.setAttribute('x1', x), l.setAttribute('x2', x)));
    g.querySelector('text')?.setAttribute('x', x);
  });
}

/** Cursor vertical que sigue al ratón sobre la traza y muestra el mes. */
function initCursor(root: HTMLElement, start: string, sample: HTMLButtonElement): void {
  if (!finePointer.matches || reducedMotion.matches) return;
  const grid = $('.la-grid', root);
  const line = $('[data-cursor-line]', root);
  const tag = $('[data-cursor-tag]', root);
  const wave = $('.la-wave', sample);
  if (!grid || !line || !tag || !wave) return;
  const lang = pageLang();
  const s = parseYM(start);
  let box = { gx: 0, x0: 0, w: 1 };
  let raf = 0;
  let px = 0;

  const measure = () => {
    const g = grid.getBoundingClientRect();
    const r = wave.getBoundingClientRect();
    box = { gx: g.left, x0: r.left - g.left, w: Math.max(1, r.width) };
  };
  const paint = () => {
    raf = 0;
    const rel = px - box.gx - box.x0;
    if (rel < 0 || rel > box.w) {
      line.classList.remove('is-on');
      return;
    }
    const total = monthsBetween(start, currentYM()) + 1;
    const idx = Math.min(total - 1, Math.floor((rel / box.w) * total));
    const y = s.y + Math.floor((s.m - 1 + idx) / 12);
    const m = ((s.m - 1 + idx) % 12) + 1;
    const label = formatYM(`${y}-${String(m).padStart(2, '0')}`, lang);
    if (tag.textContent !== label) tag.textContent = label;
    line.style.transform = `translateX(${(box.x0 + rel).toFixed(1)}px)`;
    line.classList.add('is-on');
  };

  grid.addEventListener('pointerenter', measure);
  grid.addEventListener('pointermove', (e) => {
    px = e.clientX;
    if (!raf) raf = requestAnimationFrame(paint);
  });
  grid.addEventListener('pointerleave', () => line.classList.remove('is-on'));
  window.addEventListener('resize', measure, { passive: true });
}
