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

function run(shown: HTMLSpanElement, text: string, state: { raf: number }) {
  cancelAnimationFrame(state.raf);
  const start = performance.now();
  // Cada letra se "fija" en un momento aleatorio dentro de la duración.
  const lock = Array.from(text, (_, i) => (i / text.length) * DURATION * 0.7 + Math.random() * DURATION * 0.3);
  const frame = (now: number) => {
    const t = now - start;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i] ?? '';
      out += t >= (lock[i] ?? 0) || ch === ' ' ? ch : (GLYPHS[(Math.random() * GLYPHS.length) | 0] ?? ch);
    }
    shown.textContent = out;
    if (t < DURATION) state.raf = requestAnimationFrame(frame);
    else shown.textContent = text;
  };
  state.raf = requestAnimationFrame(frame);
}

export function initScramble(root: ParentNode = document): void {
  $$('[data-scramble]', root).forEach((host) => {
    if (host.dataset.scrambleText !== undefined) return; // ya preparado
    const shown = prepare(host);
    if (!shown) return;
    const text = host.dataset.scrambleText ?? '';
    const trigger = host.closest<HTMLElement>('a, button') ?? host;
    const state = { raf: 0 };
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
