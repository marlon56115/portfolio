// Utilidades de DOM y de entorno compartidas por todos los scripts del cliente.
// Nada de innerHTML: la CSP exige Trusted Types y solo permite construir nodos.

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

/** Crea un elemento con clase y texto opcionales. */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export type Lang = 'es' | 'en';
export const pageLang = (): Lang => (document.documentElement.dataset.lang === 'es' ? 'es' : 'en');

const mq = (q: string) => window.matchMedia(q);
export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
/** Ratón o trackpad (no táctil). Los efectos de cursor solo existen aquí. */
export const finePointer = mq('(hover: hover) and (pointer: fine)');

/** Ejecuta un init sin que su error tumbe a los demás módulos. */
export function safe(name: string, fn: () => void): void {
  try {
    fn();
  } catch (err) {
    console.error(`[init:${name}]`, err);
  }
}
