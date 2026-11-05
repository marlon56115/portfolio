// Experiencia y stack. Dueño en la fase 2: pf-work.
// main.ts solo llama a initWork(); la matriz del stack (Skills.astro) también se inicia aquí
// porque no tiene un init propio en main.ts.

import { safe } from '../../lib/dom';
import { initTrace } from '../work/trace';
import { initSkills } from '../work/skills';

export function initWork(): void {
  safe('work:trace', initTrace);
  safe('work:skills', initSkills);
}
