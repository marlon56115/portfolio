// Hero. Dueño en la fase 2: pf-hero.
// - LED y línea de estado (barra de la terminal): si el servidor responde, "autoalojado · en línea 3d".
// - Retrato (scripts/hero/portrait.ts) y canales (scripts/hero/channels.ts).
// La terminal la inicia main.ts (scripts/terminal.ts).

import { $, pageLang, safe } from '../../lib/dom';
import { fmtUptime, onStatus } from '../status';
import { initPortrait } from '../hero/portrait';
import { initChannels } from '../hero/channels';

export function initHero(): void {
  safe('hero:portrait', initPortrait);
  safe('hero:channels', initChannels);

  const led = $('[data-hero-led]');
  const line = $('[data-hero-status]');
  if (!led && !line) return;
  const lang = pageLang();
  const label = lang === 'es' ? 'autoalojado · en línea' : 'self-hosted · up';
  onStatus((s) => {
    if (!s) {
      led?.classList.add('is-off');
      return;
    }
    led?.classList.remove('is-off');
    if (line && typeof s.uptimeSeconds === 'number') line.textContent = `${label} ${fmtUptime(s.uptimeSeconds, lang)}`;
  });
}
