// Punto de entrada del texto: `dict[lang]` junta todos los archivos por sección.

import { common, careerStart, langs, type Lang } from './common';
import { hero } from './hero';
import { system } from './system';
import { work, type Job } from './work';
import { projects, type Project } from './projects';
import { skills } from './skills';
import { contact } from './contact';
import { terminal } from './terminal';

function build(lang: Lang) {
  return {
    ...common[lang],
    ...hero[lang],
    ...system[lang],
    ...work[lang],
    ...projects[lang],
    ...skills[lang],
    ...contact[lang],
    ...terminal[lang],
  };
}

export type Dict = ReturnType<typeof build>;
export const dict: Record<Lang, Dict> = { es: build('es'), en: build('en') };

export { careerStart, langs };
export type { Lang, Job, Project };
