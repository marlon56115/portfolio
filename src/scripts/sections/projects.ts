// Proyectos: galerías con lightbox y la secuencia de capas de la plataforma. Dueño en la fase 2: pf-work.

import { safe } from '../../lib/dom';
import { initGalleries } from '../work/gallery';
import { initStack } from '../work/stack';

export function initProjects(): void {
  safe('projects:gallery', initGalleries);
  safe('projects:stack', initStack);
}
