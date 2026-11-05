// Punto de entrada del cliente: solo importa e inicia. Cada módulo es dueño de su lógica
// (ver DESIGN.md §9). Un error en un módulo no detiene a los demás.

import { pageLang, safe } from '../lib/dom';
import { hydrateSince } from '../lib/time';
import { applyTheme, currentTheme, initTheme } from './core/theme';
import { initNav, rememberLang } from './core/nav';
import { initMenu } from './core/menu';
import { initReveal } from './core/reveal';
import { initFold } from './core/fold';
import { initBackground } from './fx/background';
import { initCursor } from './fx/cursor';
import { initScramble } from './fx/scramble';
import { initDecode } from './fx/decode';
import { initSpotlight } from './fx/spotlight';
import { initThemeWipe, switchTheme } from './fx/theme-wipe';
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
safe('fold', initFold);
safe('background', initBackground);
safe('cursor', initCursor);
safe('decode', initDecode);
safe('spotlight', initSpotlight);
safe('theme-wipe', () => initThemeWipe({ applyTheme, currentTheme }));
safe('hero', initHero);
safe('work', initWork);
safe('projects', initProjects);
safe('system', initSystem);
safe('contact', initContact);
safe('terminal', () => initTerminal({ lang, setTheme: (t, p, o) => void (switchTheme(t, p, o) || applyTheme(t, p)), rememberLang }));
