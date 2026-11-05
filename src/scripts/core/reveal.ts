// Aparición al hacer scroll. Marcado: data-reveal (sube) o data-reveal="fade".
// Escalonado: data-reveal-stagger en un contenedor reparte retrasos entre sus hijos [data-reveal].
// Con movimiento reducido o sin IntersectionObserver, todo se muestra de inmediato.

import { $$, reducedMotion } from '../../lib/dom';

export function initReveal(): void {
  const items = $$('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  $$('[data-reveal-stagger]').forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 70;
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * step}ms`));
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
}
