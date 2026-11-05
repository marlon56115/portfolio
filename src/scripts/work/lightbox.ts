// Lightbox de capturas sobre un <dialog> nativo (showModal: el resto de la página queda inerte).
// Teclado: Esc cierra (nativo), ←/→ navegan, Tab queda atrapado dentro. Táctil: deslizar cambia de captura.
// Al cerrar, el foco vuelve al enlace que lo abrió. La imagen se cambia con setAttribute (sin innerHTML).

import { $, $$, reducedMotion } from '../../lib/dom';

export interface LbItem {
  src: string;
  srcDark?: string;
  caption: string;
  phone?: boolean;
}

let dialog: HTMLDialogElement | null = null;
let list: LbItem[] = [];
let index = 0;
let opener: HTMLElement | null = null;
let onMove: ((i: number) => void) | null = null;

const isLight = () => document.documentElement.dataset.theme === 'light';

function show(i: number): void {
  if (!dialog) return;
  index = (i + list.length) % list.length;
  const it = list[index];
  const img = $<HTMLImageElement>('[data-lb-img]', dialog);
  const src = !isLight() && it.srcDark ? it.srcDark : it.src;
  if (img && img.getAttribute('src') !== src) {
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.setAttribute('src', src);
    img.setAttribute('alt', it.caption);
  }
  const cap = $('[data-lb-caption]', dialog);
  if (cap) cap.textContent = it.caption;
  const count = $('[data-lb-count]', dialog);
  if (count) count.textContent = `${index + 1} / ${list.length}`;
  onMove?.(index);
}

export function openLightbox(items: LbItem[], i: number, from: HTMLElement, move?: (i: number) => void): void {
  dialog ??= init();
  if (!dialog || typeof dialog.showModal !== 'function') {
    window.location.href = items[i].src; // navegador sin <dialog>: abre la imagen
    return;
  }
  list = items;
  opener = from;
  onMove = move ?? null;
  show(i);
  dialog.showModal();
  document.documentElement.classList.add('is-locked');
  $<HTMLButtonElement>('[data-lb-close]', dialog)?.focus();
}

function init(): HTMLDialogElement | null {
  const d = $<HTMLDialogElement>('[data-lightbox]');
  if (!d) return null;
  $('[data-lb-close]', d)?.addEventListener('click', () => d.close());
  $('[data-lb-prev]', d)?.addEventListener('click', () => show(index - 1));
  $('[data-lb-next]', d)?.addEventListener('click', () => show(index + 1));

  d.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    opener?.focus({ preventScroll: true });
  });
  // Clic en el fondo (fuera de la imagen y de los controles) cierra.
  $('[data-lb-stage]', d)?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).matches('[data-lb-stage]')) d.close();
  });

  d.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), show(index + 1));
    else if (e.key === 'ArrowLeft') (e.preventDefault(), show(index - 1));
    else if (e.key === 'Tab') {
      const f = $$<HTMLElement>('button:not([disabled])', d);
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
    }
  });

  // Deslizar horizontalmente en táctil.
  let x0 = 0;
  let y0 = 0;
  d.addEventListener('pointerdown', (e) => ((x0 = e.clientX), (y0 = e.clientY)), { passive: true });
  d.addEventListener(
    'pointerup',
    (e) => {
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - y0) * 1.5) show(index + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );

  // Si cambia el tema con el lightbox abierto, se cambia a la variante que toque.
  document.documentElement.addEventListener('themechange', () => d.open && show(index));
  if (reducedMotion.matches) d.classList.add('is-still');
  return d;
}
