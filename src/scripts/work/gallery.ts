// Galerías (Gallery.astro): la pista con scroll-snap ya se desliza sola; esto añade miniaturas,
// anterior/siguiente, contador, pie de foto y la apertura del lightbox.

import { $, $$, reducedMotion } from '../../lib/dom';
import { openLightbox, type LbItem } from './lightbox';

export function initGalleries(): void {
  $$('[data-gallery]').forEach(setup);
}

function setup(g: HTMLElement): void {
  const track = $<HTMLElement>('[data-track]', g);
  if (!track) return;
  const links = $$<HTMLAnchorElement>('[data-open]', g);
  const thumbs = $$<HTMLButtonElement>('[data-thumb]', g);
  const prev = $<HTMLButtonElement>('[data-prev]', g);
  const next = $<HTMLButtonElement>('[data-next]', g);
  const count = $('[data-count]', g);
  const caption = $('[data-caption-out]', g);
  const n = links.length;
  let current = -1;
  let raf = 0;

  const items = (): LbItem[] =>
    links.map((a) => ({
      src: a.dataset.full ?? a.href,
      srcDark: a.dataset.fullDark,
      caption: a.dataset.caption ?? '',
      phone: a.hasAttribute('data-phone'),
    }));

  const mark = (i: number) => {
    if (i === current) return;
    current = i;
    links.forEach((a, k) => (a.tabIndex = k === i ? 0 : -1));
    thumbs.forEach((t, k) => (k === i ? t.setAttribute('aria-current', 'true') : t.removeAttribute('aria-current')));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === n - 1;
    if (count) count.textContent = String(i + 1);
    if (caption) caption.textContent = links[i].dataset.caption ?? '';
  };

  const go = (i: number) => {
    const k = Math.max(0, Math.min(n - 1, i));
    track.scrollTo({ left: k * track.clientWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    mark(k);
  };

  track.addEventListener(
    'scroll',
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const w = track.clientWidth || 1;
        mark(Math.round(track.scrollLeft / w));
      });
    },
    { passive: true },
  );

  thumbs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  prev?.addEventListener('click', () => go(current - 1));
  next?.addEventListener('click', () => go(current + 1));

  // Flechas con el foco dentro de la pista.
  track.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    go(current + (e.key === 'ArrowRight' ? 1 : -1));
    links[current]?.focus({ preventScroll: true });
  });

  links.forEach((a, i) =>
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // nueva pestaña: comportamiento normal
      e.preventDefault();
      openLightbox(items(), i, () => links[current], (k) => go(k));
    }),
  );

  mark(0);
}
