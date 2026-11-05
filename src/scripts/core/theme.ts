// Tema claro/oscuro. public/theme-init.js aplica el guardado antes de pintar; esto maneja el resto.
// Emite el evento `themechange` en <html> para que el fondo animado vuelva a leer sus colores.

import { $$ } from '../../lib/dom';

export type Theme = 'light' | 'dark';
const root = document.documentElement;
const lightMedia = window.matchMedia('(prefers-color-scheme: light)');

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/** Oscuro primero: si el sistema no pide claro, va oscuro. */
const systemTheme = (): Theme => (lightMedia.matches ? 'light' : 'dark');

export function currentTheme(): Theme {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme, persist: boolean): void {
  const changed = root.dataset.theme !== theme;
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* modo privado: no pasa nada */
    }
  }
  if (changed) root.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export function initTheme(): void {
  applyTheme(storedTheme() ?? systemTheme(), false);
  lightMedia.addEventListener('change', () => {
    if (!storedTheme()) applyTheme(systemTheme(), false);
  });
  $$('[data-theme-toggle]').forEach((b) =>
    b.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true)),
  );
}
