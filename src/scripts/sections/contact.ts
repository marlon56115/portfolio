// Contacto: copiar el correo al portapapeles. Dueño en la fase 2: pf-contact.

import { $$ } from '../../lib/dom';

export function initContact(): void {
  $$<HTMLButtonElement>('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy ?? '');
        const prev = b.textContent;
        b.textContent = b.dataset.copied ?? 'ok';
        window.setTimeout(() => (b.textContent = prev), 1400);
      } catch {
        /* sin permiso de portapapeles */
      }
    }),
  );
}
