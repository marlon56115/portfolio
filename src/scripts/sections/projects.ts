// Proyectos: galerías de capturas con miniaturas. Dueño en la fase 2: pf-work.

import { $$ } from '../../lib/dom';

export function initProjects(): void {
  $$('[data-gallery]').forEach((g) => {
    const screens = $$<HTMLImageElement>('[data-screen]', g);
    const thumbs = $$<HTMLButtonElement>('[data-thumb]', g);
    thumbs.forEach((b) =>
      b.addEventListener('click', () => {
        const i = b.dataset.thumb;
        screens.forEach((s) => (s.hidden = s.dataset.screen !== i));
        thumbs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
      }),
    );
  });
}
