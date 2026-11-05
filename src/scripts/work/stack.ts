// Secuencia "reproducible desde git" (LayerStack.astro): enciende las capas en orden al entrar en pantalla.
// "Reconstruir" la repite. Con movimiento reducido todo queda encendido desde el inicio.

import { $, $$, reducedMotion } from '../../lib/dom';

export function initStack(): void {
  $$('[data-stack]').forEach((stack) => {
    $$('[data-layer]', stack).forEach((l, i) => l.style.setProperty('--i', String(i)));
    const run = () => stack.classList.add('is-run');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      run();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(stack);
    }

    $('[data-stack-run]', stack)?.addEventListener('click', () => {
      stack.classList.remove('is-run');
      void stack.offsetWidth; // reinicia las transiciones (una sola lectura, fuera de cualquier bucle)
      requestAnimationFrame(run);
    });
  });
}
