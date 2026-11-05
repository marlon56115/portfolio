// Cambio de tema con barrido: el tema nuevo se abre en círculo desde el botón [data-theme-toggle]
// (View Transitions API). Sin soporte o con movimiento reducido, el cambio es instantáneo como antes.
// Se engancha en fase de captura y, si puede animar, hace el cambio él mismo en lugar de core/theme.ts;
// así no hace falta tocar ese módulo. Funciona igual con ratón, teclado o toque (no añade elementos).

import { reducedMotion } from '../../lib/dom';
import type { Theme } from '../core/theme';

interface Deps {
  applyTheme: (t: Theme, persist: boolean) => void;
  currentTheme: () => Theme;
}

const DURATION = 560;

export function initThemeWipe({ applyTheme, currentTheme }: Deps): void {
  if (typeof document.startViewTransition !== 'function') return;
  const root = document.documentElement;

  document.addEventListener(
    'click',
    (e) => {
      const btn = e.target instanceof Element ? e.target.closest('[data-theme-toggle]') : null;
      if (!btn || reducedMotion.matches || root.classList.contains('fx-wipe')) return;
      e.stopImmediatePropagation(); // el listener de core/theme.ts no corre: el cambio lo hace este

      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
      const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';

      root.classList.add('fx-wipe');
      const vt = document.startViewTransition(() => applyTheme(next, true));
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
    },
    { capture: true },
  );
}
