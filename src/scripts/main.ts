// Punto de entrada del cliente: solo importa e inicia. Cada módulo es dueño de su lógica
// (ver DESIGN.md §9). Un error en un módulo no detiene a los demás.

import { pageLang, safe } from '../lib/dom';
import { hydrateSince } from '../lib/time';
import { applyTheme, initTheme } from './core/theme';
import { initNav, rememberLang } from './core/nav';
import { initMenu } from './core/menu';
import { initReveal } from './core/reveal';
import { initBackground } from './fx/background';
import { initCursor } from './fx/cursor';
import { initScramble } from './fx/scramble';
import { initHero } from './sections/hero';
import { initSystem } from './sections/system';
import { initWork } from './sections/work';
import { initProjects } from './sections/projects';
import { initContact } from './sections/contact';
import { initTerminal } from './terminal';

const lang = pageLang();

safe('theme', initTheme);
safe('time', () => hydrateSince());
safe('nav', initNav);
safe('menu', initMenu);
safe('scramble', () => initScramble());
safe('reveal', initReveal);
safe('background', initBackground);
safe('cursor', initCursor);
safe('hero', initHero);
safe('work', initWork);
safe('projects', initProjects);
safe('system', initSystem);
safe('contact', initContact);
safe('terminal', () => initTerminal({ lang, applyTheme, rememberLang }));
