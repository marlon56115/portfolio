// Lecturas que "se asientan" al entrar en pantalla, una sola vez por elemento:
//  - cabeceras de sección: el índice ("01 / experiencia") y el título se descifran con fx/scramble,
//  - cifras (años, conteos): los dígitos pasan por valores al azar antes de fijarse, como un instrumento.
// Es un efecto de entrada, así que también corre en táctil. No mueve el layout: los títulos e índices van
// en fuente mono y las cifras en dígitos tabulares, y cada carácter se cambia por otro del mismo ancho.
// Solo se tocan nodos de texto (los elementos y atributos quedan igual). Con movimiento reducido, nada.

import { $$, reducedMotion } from '../../lib/dom';
import { scrambleTo, type ScrambleOpts } from './scramble';

const HEADS = '.section-head';
// Glifos que no abren oportunidades de salto de línea: un título de varias líneas corta exactamente
// igual mientras se descifra y su alto no cambia. Fuera quedan - / \ [ ] { } : + y < (Chrome corta
// antes de <); medido con miles de mezclas al azar en 375 px y escritorio.
const SAFE_GLYPHS = '01>=*#_~';
const HEAD_PARTS: [string, ScrambleOpts][] = [
  ['.section-index', { glyphs: SAFE_GLYPHS, duration: 420 }],
  ['.section-title', { glyphs: SAFE_GLYPHS, duration: 640 }],
];
const DIGITS = '.hero__facts [data-since], .la-stat [data-since], .f-n';
const DIGIT_OPTS: ScrambleOpts = { glyphs: '0123456789', duration: 560, keep: (ch) => !/\d/.test(ch) };
const SPACE = (ch: string) => /\s/.test(ch);

/** Nodos de texto visibles con contenido (fuera de .visually-hidden). */
function textNodes(root: Element): Text[] {
  const out: Text[] = [];
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue?.trim() && !n.parentElement?.closest('.visually-hidden') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  while (walk.nextNode()) out.push(walk.currentNode as Text);
  return out;
}

function decode(el: Element, opts: ScrambleOpts): void {
  const nodes = textNodes(el);
  if (!nodes.length) return;
  // Un título sigue teniendo su nombre real para el lector de pantalla mientras se anima.
  const named = /^H[1-6]$/.test(el.tagName) && !el.hasAttribute('aria-label');
  if (named) {
    el.setAttribute('aria-label', el.textContent?.trim() ?? '');
    window.setTimeout(() => el.removeAttribute('aria-label'), (opts.duration ?? 420) + 120);
  }
  nodes.forEach((n) => scrambleTo((s) => (n.data = s), n.data, { keep: SPACE, ...opts }));
}

export function initDecode(): void {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const jobs = new Map<Element, () => void>();
  $$(HEADS).forEach((head) =>
    jobs.set(head, () =>
      HEAD_PARTS.forEach(([sel, opts]) => head.querySelectorAll(sel).forEach((part) => decode(part, opts))),
    ),
  );
  $$(DIGITS).forEach((n) => jobs.set(n, () => decode(n, DIGIT_OPTS)));
  if (!jobs.size) return;

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const job = jobs.get(e.target);
        jobs.delete(e.target);
        // Un respiro para que arranque a la par que la aparición (core/reveal.ts).
        if (job) window.setTimeout(job, 60);
        if (!jobs.size) io.disconnect();
      }),
    { rootMargin: '0px 0px -10% 0px' },
  );
  jobs.forEach((_, el) => io.observe(el));
}
