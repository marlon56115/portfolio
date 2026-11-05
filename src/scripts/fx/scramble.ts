// Efecto "scramble": al pasar el puntero (o enfocar), el texto se descifra letra a letra.
// Marcado: <span data-scramble>experiencia</span>, normalmente dentro de un <a> o <button>.
// Accesibilidad: el texto real queda en un .visually-hidden; lo que se anima es una copia aria-hidden.
// Con movimiento reducido no se anima (pero el marcado accesible se prepara igual).

import { $$, reducedMotion } from '../../lib/dom';

const GLYPHS = '01<>/\\[]{}=+*#_-~:';
const DURATION = 420; // ms

function prepare(host: HTMLElement): HTMLSpanElement | null {
  const text = host.textContent ?? '';
  if (!text.trim()) return null;
  const real = document.createElement('span');
  real.className = 'visually-hidden';
  real.textContent = text;
  const shown = document.createElement('span');
  shown.setAttribute('aria-hidden', 'true');
  shown.textContent = text;
  host.replaceChildren(real, shown);
  host.dataset.scrambleText = text;
  return shown;
}

export interface ScrambleOpts {
  glyphs?: string;
  duration?: number;
  /** Caracteres que no se cifran (por defecto, solo el espacio). */
  keep?: (ch: string) => boolean;
}

/**
 * Descifra `text` letra a letra llamando a `write` en cada cuadro. Reutilizable desde otros efectos
 * (fx/decode.ts). Devuelve una función que corta la animación y deja el texto final.
 */
export function scrambleTo(write: (s: string) => void, text: string, opts: ScrambleOpts = {}): () => void {
  const glyphs = opts.glyphs ?? GLYPHS;
  const dur = opts.duration ?? DURATION;
  const keep = opts.keep ?? ((ch: string) => ch === ' ');
  const start = performance.now();
  // Cada letra se "fija" en un momento aleatorio dentro de la duración.
  const lock = Array.from(text, (_, i) => (i / text.length) * dur * 0.7 + Math.random() * dur * 0.3);
  let raf = 0;
  const frame = (now: number) => {
    const t = now - start;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i] ?? '';
      out += t >= (lock[i] ?? 0) || keep(ch) ? ch : (glyphs[(Math.random() * glyphs.length) | 0] ?? ch);
    }
    write(out);
    if (t < dur) raf = requestAnimationFrame(frame);
    else write(text);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    write(text);
  };
}

function run(shown: HTMLSpanElement, text: string, state: { stop: () => void }) {
  state.stop();
  state.stop = scrambleTo((s) => (shown.textContent = s), text);
}

export function initScramble(root: ParentNode = document): void {
  $$('[data-scramble]', root).forEach((host) => {
    if (host.dataset.scrambleText !== undefined) return; // ya preparado
    const shown = prepare(host);
    if (!shown) return;
    const text = host.dataset.scrambleText ?? '';
    const trigger = host.closest<HTMLElement>('a, button') ?? host;
    const state = { stop: () => {} };
    const go = () => {
      if (!reducedMotion.matches) run(shown, text, state);
    };
    trigger.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') go();
    });
    trigger.addEventListener('focus', () => {
      if (trigger.matches(':focus-visible')) go();
    });
  });
}
