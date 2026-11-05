// Cabecera: estado al hacer scroll, enlace activo según la sección visible, idioma y barra de progreso.

import { $, $$ } from '../../lib/dom';

/** La elección manual de idioma gana a la detección por país del servidor. */
export function rememberLang(l: 'es' | 'en'): void {
  document.cookie = `lang=${l}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
}

export function initNav(): void {
  // ---- idioma ----
  $$<HTMLAnchorElement>('[data-set-lang]').forEach((a) =>
    a.addEventListener('click', () => {
      const l = a.dataset.setLang === 'es' ? 'es' : 'en';
      rememberLang(l);
      if (location.hash) a.href = `/${l}/${location.hash}`;
    }),
  );

  // ---- cabecera + progreso: un solo listener de scroll, trabajo en rAF ----
  const header = $('[data-header]');
  const progress = $('[data-progress]');
  const bar = $('[data-progress-bar]', progress ?? document);
  const head = $('[data-progress-head]', progress ?? document);
  let ticking = false;
  let width = progress?.clientWidth ?? 0; // se relee solo al redimensionar
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 8);
    if (bar && progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
      if (head) head.style.translate = `${(p * width - 2.5).toFixed(1)}px 0`;
      progress.classList.toggle('is-active', p > 0.002 && p < 0.998);
    }
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener(
    'resize',
    () => {
      width = progress?.clientWidth ?? 0;
      update();
    },
    { passive: true },
  );

  // ---- enlace activo ----
  const links = $$<HTMLAnchorElement>('[data-nav]');
  const sections = [...new Set(links.map((a) => a.dataset.nav))]
    .map((id) => (id ? document.getElementById(id) : null))
    .filter((s): s is HTMLElement => !!s);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          const on = a.dataset.nav === e.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}
