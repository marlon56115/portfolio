// Hero. Dueño en la fase 2: pf-hero (aquí irán la terminal integrada y los efectos del retrato).
// Por ahora: el LED y la línea de estado del hero reflejan si el servidor responde.

import { $, pageLang } from '../../lib/dom';
import { fmtUptime, onStatus } from '../status';

export function initHero(): void {
  const led = $('[data-hero-led]');
  const line = $('[data-hero-status]');
  if (!led && !line) return;
  const lang = pageLang();
  const label = lang === 'es' ? 'autoalojado · activo' : 'self-hosted · up';
  onStatus((s) => {
    if (!s) {
      led?.classList.add('is-off');
      return;
    }
    led?.classList.remove('is-off');
    if (line && s.uptimeSeconds !== undefined) line.textContent = `${label} ${fmtUptime(s.uptimeSeconds, lang)}`;
  });
}
