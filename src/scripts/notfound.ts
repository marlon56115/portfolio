// Página 404: tema, fondo animado, cursor y la ruta pedida (como texto, nunca como HTML).

import { safe } from '../lib/dom';
import { initTheme } from './core/theme';
import { initBackground } from './fx/background';
import { initCursor } from './fx/cursor';

safe('theme', initTheme);
safe('background', initBackground);
safe('cursor', initCursor);
safe('path', () => {
  const el = document.querySelector('[data-path]');
  if (el) el.textContent = location.pathname.slice(0, 120);
});
