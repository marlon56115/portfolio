// Pliegues móviles (ui/Fold.astro): el botón abre o cierra su bloque y cambia su texto.
// El ocultado es CSS (solo < 768 px), así que en escritorio el botón no existe y nada cambia.

import { $, $$ } from '../../lib/dom';

export function initFold(): void {
  $$<HTMLButtonElement>('[data-fold-btn]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls') ?? '');
    const label = $('[data-fold-label]', btn);
    if (!target || !label) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      target.classList.toggle('is-open', open);
      label.textContent = (open ? btn.dataset.less : btn.dataset.more) ?? '';
    });
  });
}
