// Foco de luz en los paneles (.panel): cerca del puntero el filete se enciende en --ion y el fondo
// recibe un halo muy tenue. El dibujo es CSS (fx.css) sobre los ::before/::after que ya pintan el
// borde y la superficie del panel; aquí solo se escriben --fx-sx/--fx-sy (una lectura de layout por
// cuadro, en rAF) y la clase .fx-spot. Solo con ratón/trackpad y sin movimiento reducido.

import { $$, finePointer, reducedMotion } from '../../lib/dom';

const SEL = '.panel';

export function initSpotlight(): void {
  if (!finePointer.matches || reducedMotion.matches) return;

  $$(SEL).forEach((panel) => {
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      const r = panel.getBoundingClientRect();
      panel.style.setProperty('--fx-sx', `${(x - r.left).toFixed(0)}px`);
      panel.style.setProperty('--fx-sy', `${(y - r.top).toFixed(0)}px`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    panel.addEventListener(
      'pointerenter',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        move(e);
        panel.classList.add('fx-spot');
      },
      { passive: true },
    );
    panel.addEventListener('pointermove', move, { passive: true });
    panel.addEventListener(
      'pointerleave',
      () => {
        cancelAnimationFrame(raf);
        raf = 0;
        panel.classList.remove('fx-spot');
      },
      { passive: true },
    );
  });
}
