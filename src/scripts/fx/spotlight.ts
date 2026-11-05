// Foco de luz en los paneles (.panel) y en lo marcado con [data-spot]: cerca del puntero el filete se
// enciende en --ion y el fondo recibe un halo muy tenue. Aquí solo se escriben --fx-sx/--fx-sy (una
// lectura de layout por cuadro, en rAF) y la clase .fx-spot; el dibujo es CSS:
// - .panel: fx.css sobre los ::before/::after que ya pintan el borde y la superficie del panel.
// - .spot (tarjetas de proyecto y del puesto): fx.css añade un halo propio en ::after.
// - otros [data-spot] (tarjetas de contacto) leen --fx-sx/--fx-sy en su propio CSS.
// Solo con ratón/trackpad y sin movimiento reducido.

import { $$, finePointer, reducedMotion } from '../../lib/dom';

const SEL = '.panel, [data-spot]';

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
