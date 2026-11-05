// Menú móvil (< 1024 px). Botón accesible (aria-expanded), foco atrapado, Esc cierra,
// scroll del body bloqueado y el resto de la página `inert` mientras está abierto.
// Marcado en Header.astro: [data-menu-toggle] controla #site-nav ([data-menu-panel]).

import { $, $$ } from '../../lib/dom';

const DESKTOP = window.matchMedia('(min-width: 1024px)');
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initMenu(): void {
  const header = $('[data-header]');
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const panel = $('[data-menu-panel]');
  if (!header || !toggle || !panel) return;

  const root = document.documentElement;
  let open = false;
  let inerted: HTMLElement[] = [];

  const setOpen = (next: boolean, restoreFocus = true) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? (toggle.dataset.labelClose ?? '') : (toggle.dataset.labelOpen ?? ''));
    header.classList.toggle('is-menu-open', next);
    root.classList.toggle('is-locked', next);

    if (next) {
      // Todo lo que no es la cabecera queda inerte: ni foco ni lector de pantalla.
      inerted = Array.from(document.body.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && c !== header && !c.contains(header) && !c.inert,
      );
      inerted.forEach((c) => (c.inert = true));
      $(FOCUSABLE, panel)?.focus();
    } else {
      inerted.forEach((c) => (c.inert = false));
      inerted = [];
      if (restoreFocus) toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  // Al elegir un enlace se cierra; el salto al ancla ocurre igual.
  $$<HTMLAnchorElement>('a[href]', panel).forEach((a) => a.addEventListener('click', () => setOpen(false, false)));

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    // Ciclo de foco dentro de la cabecera (botón + enlaces + controles).
    const items = $$<HTMLElement>(FOCUSABLE, header).filter((x) => x.offsetParent !== null || x === toggle);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  DESKTOP.addEventListener('change', (e) => {
    if (e.matches) setOpen(false, false);
  });
}
