// Matriz del stack (Skills.astro): botones de frente con aria-pressed (uno a la vez, "todo" incluido).
// El resaltado y la lista "dónde lo usé" son CSS sobre data-front del contenedor.

import { $, $$ } from '../../lib/dom';

export function initSkills(): void {
  const root = $('[data-skills]');
  if (!root) return;
  const buttons = $$<HTMLButtonElement>('[data-front-btn]', root);
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const f = b.dataset.frontBtn ?? '';
      // Pulsar el frente activo vuelve a "todo".
      const next = root.dataset.front === f ? '' : f;
      root.dataset.front = next;
      buttons.forEach((x) => x.setAttribute('aria-pressed', String((x.dataset.frontBtn ?? '') === next)));
    }),
  );
}
