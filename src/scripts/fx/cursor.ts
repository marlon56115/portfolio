// Seguidor del cursor: cuatro esquinas de mira que siguen al puntero con un pequeño retardo y,
// sobre un elemento interactivo, se abren hasta enmarcarlo. Muestra las coordenadas en mono.
// El cursor nativo NUNCA se oculta. Sobre campos de texto el seguidor desaparece.
// Además: botones "magnéticos" ([data-magnetic]) que se inclinan hacia el puntero.
// Solo con puntero fino (ratón/trackpad) y sin movimiento reducido.

import { $$, finePointer, reducedMotion } from '../../lib/dom';

const TARGETS = 'a[href], button, summary, [role="button"], label[for], [data-cursor="target"]';
const TEXTY = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-cursor="none"]';
const IDLE = 9; // media distancia de las esquinas en reposo (px)
const PAD = 6; // margen alrededor del objetivo

export function initCursor(): void {
  if (!finePointer.matches || reducedMotion.matches) return;
  initMagnetic();

  const root = document.createElement('div');
  root.className = 'fx-cursor';
  root.setAttribute('aria-hidden', 'true');
  const corners = (['tl', 'tr', 'bl', 'br'] as const).map((c) => {
    const s = document.createElement('span');
    s.className = 'fx-cursor__corner';
    s.dataset.c = c;
    root.append(s);
    return s;
  });
  const readout = document.createElement('span');
  readout.className = 'fx-cursor__readout';
  root.append(readout);
  document.body.append(root);

  const pos = { x: 0, y: 0, tx: 0, ty: 0 };
  // caja actual (centro + medio ancho/alto) y la caja objetivo
  const box = { cx: 0, cy: 0, hw: IDLE, hh: IDLE };
  let target: Element | null = null;
  let raf = 0;
  let shown = false;

  const frame = () => {
    raf = 0;
    pos.x += (pos.tx - pos.x) * 0.3;
    pos.y += (pos.ty - pos.y) * 0.3;

    let goal = { cx: pos.x, cy: pos.y, hw: IDLE, hh: IDLE };
    if (target && target.isConnected) {
      const r = target.getBoundingClientRect();
      goal = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, hw: r.width / 2 + PAD, hh: r.height / 2 + PAD };
    }
    const k = 0.26;
    box.cx += (goal.cx - box.cx) * k;
    box.cy += (goal.cy - box.cy) * k;
    box.hw += (goal.hw - box.hw) * k;
    box.hh += (goal.hh - box.hh) * k;

    const L = box.cx - box.hw;
    const R = box.cx + box.hw - 7;
    const T = box.cy - box.hh;
    const B = box.cy + box.hh - 7;
    const pts = [
      [L, T],
      [R, T],
      [L, B],
      [R, B],
    ];
    corners.forEach((c, i) => {
      const p = pts[i] ?? [0, 0];
      c.style.transform = `translate3d(${p[0]!.toFixed(1)}px, ${p[1]!.toFixed(1)}px, 0)`;
    });
    readout.style.transform = `translate3d(${(pos.x + 16).toFixed(1)}px, ${(pos.y + 14).toFixed(1)}px, 0)`;

    const moving =
      Math.abs(pos.tx - pos.x) > 0.2 ||
      Math.abs(pos.ty - pos.y) > 0.2 ||
      Math.abs(goal.cx - box.cx) > 0.2 ||
      Math.abs(goal.cy - box.cy) > 0.2 ||
      Math.abs(goal.hw - box.hw) > 0.2 ||
      Math.abs(goal.hh - box.hh) > 0.2;
    if (moving) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!shown) {
        shown = true;
        pos.x = pos.tx;
        pos.y = pos.ty;
        box.cx = pos.x;
        box.cy = pos.y;
        root.classList.add('is-on');
      }
      readout.textContent = `${String(Math.round(e.clientX)).padStart(4, '0')} · ${String(Math.round(e.clientY)).padStart(4, '0')}`;
      kick();
    },
    { passive: true },
  );

  // Si la página se mueve bajo un objetivo, la mira lo sigue.
  window.addEventListener('scroll', () => target && kick(), { passive: true });

  document.addEventListener('pointerover', (e) => {
    const el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    const hide = !!el.closest(TEXTY);
    root.classList.toggle('is-hidden', hide);
    const t = hide ? null : el.closest(TARGETS);
    if (t !== target) {
      target = t;
      root.classList.toggle('is-target', !!t);
      kick();
    }
  });
  document.documentElement.addEventListener('pointerleave', () => {
    shown = false;
    root.classList.remove('is-on');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
}

/** [data-magnetic]: el elemento se desplaza hasta 6 px hacia el puntero (vía --mx/--my, sin tocar transform). */
function initMagnetic(): void {
  const MAX = 6;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty('--mx', `${(nx * MAX).toFixed(1)}px`);
      el.style.setProperty('--my', `${(ny * MAX * 0.6).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}
