// Canales del hero (los cinco frentes). Hover/foco resalta el canal y sus líneas en la terminal;
// clic o toque lo fija y pide `focus <canal>` a la terminal (evento `term:run`).
import { $, $$ } from '../../lib/dom';

export function initChannels(): void {
  const list = $('[data-channels]');
  if (!list) return;
  const items = $$<HTMLElement>('[data-ch]', list);
  const out = $('[data-terminal-out]');
  let pinned = items.find((i) => i.classList.contains('is-active'))?.dataset.ch ?? '';

  const show = (k: string) => {
    items.forEach((li) => {
      const on = li.dataset.ch === k;
      li.classList.toggle('is-active', on);
      li.querySelector('[data-ch-btn]')?.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (out) {
      if (k) out.dataset.hl = k;
      else delete out.dataset.hl;
    }
  };

  items.forEach((li) => {
    const k = li.dataset.ch ?? '';
    const btn = li.querySelector<HTMLButtonElement>('[data-ch-btn]');
    if (!btn) return;
    btn.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') show(k);
    });
    btn.addEventListener('focus', () => show(k));
    btn.addEventListener('click', () => {
      pinned = k;
      show(k);
      document.dispatchEvent(new CustomEvent('term:run', { detail: `focus ${k}` }));
    });
  });
  list.addEventListener('pointerleave', () => show(pinned));
  list.addEventListener('focusout', (e) => {
    if (!list.contains(e.relatedTarget as Node | null)) show(pinned);
  });
  show(pinned);
}
