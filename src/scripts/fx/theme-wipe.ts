// Cambio de tema con barrido: el tema nuevo se abre en círculo desde un punto (View Transitions API).
// - El botón [data-theme-toggle]: se engancha en fase de captura y hace el cambio él mismo en lugar de
//   core/theme.ts (así no hace falta tocar ese módulo). Ratón, teclado o toque.
// - switchTheme(): la misma transición para otros orígenes (el comando `theme` de la terminal).
// Sin soporte, sin initThemeWipe o con movimiento reducido, el cambio es instantáneo.

import { reducedMotion } from '../../lib/dom';
import type { Theme } from '../core/theme';

interface Deps {
  applyTheme: (t: Theme, persist: boolean) => void;
  currentTheme: () => Theme;
}

const DURATION = 560;
const root = document.documentElement;
let deps: Deps | null = null;

const canWipe = () => typeof document.startViewTransition === 'function' && !reducedMotion.matches;

/** Centro de un elemento, o el centro de la pantalla si no hay. */
function originOf(el?: Element | null): [number, number] {
  if (!el) return [innerWidth / 2, innerHeight / 2];
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

/**
 * Cambia al tema `next` con el barrido circular desde `origin` (elemento) y lo guarda si `persist`.
 * Si no se puede animar, aplica el tema al instante. Devuelve false si initThemeWipe no corrió.
 */
export function switchTheme(next: Theme, persist = true, origin?: Element | null): boolean {
  if (!deps) return false;
  const { applyTheme, currentTheme } = deps;
  if (next === currentTheme() || !canWipe() || root.classList.contains('fx-wipe')) {
    applyTheme(next, persist);
    return true;
  }
  const [cx, cy] = originOf(origin);
  const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));

  root.classList.add('fx-wipe');
  const vt = document.startViewTransition(() => applyTheme(next, persist));
  vt.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius.toFixed(0)}px at ${cx}px ${cy}px)`] },
        { duration: DURATION, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {
      /* transición abortada: el tema ya cambió */
    });
  vt.finished.finally(() => root.classList.remove('fx-wipe'));
  return true;
}

export function initThemeWipe(d: Deps): void {
  deps = d;
  if (typeof document.startViewTransition !== 'function') return;

  document.addEventListener(
    'click',
    (e) => {
      const btn = e.target instanceof Element ? e.target.closest('[data-theme-toggle]') : null;
      if (!btn || !canWipe() || root.classList.contains('fx-wipe')) return;
      e.stopImmediatePropagation(); // el listener de core/theme.ts no corre: el cambio lo hace este
      switchTheme(d.currentTheme() === 'dark' ? 'light' : 'dark', true, btn);
    },
    { capture: true },
  );
}
