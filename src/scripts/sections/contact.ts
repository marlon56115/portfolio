// Contacto: copiar el correo, hora local en vivo, foco de luz en las tarjetas y el borrador mailto:.
// Dueño en la fase 2: pf-contact. Nada de innerHTML: solo textContent y atributos.

import { $, $$, finePointer, pageLang, reducedMotion } from '../../lib/dom';

export function initContact(): void {
  const root = $('[data-contact]');
  if (!root) return;
  initCopy(root);
  initClock(root);
  initSpotlight(root);
  initCompose(root);
}

// ---------- copiar el correo ----------

function initCopy(root: HTMLElement): void {
  const btn = $<HTMLButtonElement>('[data-copy]', root);
  const text = $('[data-copy-text]', root);
  const feedback = $('[data-copy-feedback]', root);
  const live = $('[data-copy-live]', root);
  const mail = $('.ct-mail', root);
  const addr = $('[data-addr]', root);
  if (!btn || !text || !feedback || !live) return;

  const strings = {
    idle: text.dataset.idle ?? '',
    done: text.dataset.done ?? '',
  };
  let timer = 0;

  btn.addEventListener('click', async (e) => {
    const value = btn.dataset.copy ?? '';
    const ok = await copyText(value);
    window.clearTimeout(timer);

    if (ok) {
      btn.classList.add('is-done');
      text.textContent = strings.done;
      feedback.classList.remove('is-warn');
      feedback.classList.add('is-ok');
      feedback.textContent = value;
      announce(live, live.dataset.msgOk ?? '');
      if (mail) {
        // reinicia la animación de barrido
        mail.classList.remove('is-copied');
        void mail.offsetWidth;
        mail.classList.add('is-copied');
      }
      // Con teclado no hay pointerdown: emite uno sintético para que el fondo lance su onda.
      if (e.detail === 0 && !reducedMotion.matches) pulseFrom(btn);
    } else {
      // Sin portapapeles: deja el correo seleccionado para copiarlo a mano.
      if (addr) selectNode(addr);
      feedback.classList.remove('is-ok');
      feedback.classList.add('is-warn');
      feedback.textContent = live.dataset.msgFail ?? '';
      announce(live, live.dataset.msgFail ?? '');
    }

    timer = window.setTimeout(() => {
      btn.classList.remove('is-done');
      text.textContent = strings.idle;
      mail?.classList.remove('is-copied');
      feedback.textContent = '';
      feedback.classList.remove('is-ok', 'is-warn');
    }, 2600);
  });
}

/** Portapapeles moderno (requiere contexto seguro). Si no está, el llamador selecciona el correo y pide Ctrl/⌘ C. */
async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* permiso denegado o API ausente */
  }
  return false;
}

function selectNode(node: Node): void {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  sel.removeAllRanges();
  sel.addRange(range);
}

/** Vacía y vuelve a escribir la región viva para que el lector de pantalla repita el aviso. */
function announce(live: HTMLElement, msg: string): void {
  live.textContent = '';
  window.setTimeout(() => (live.textContent = msg), 60);
}

/** Onda del fondo (fx/background.ts escucha pointerdown en window) desde el centro de un elemento. */
function pulseFrom(el: Element): void {
  const r = el.getBoundingClientRect();
  try {
    window.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerType: 'mouse' }),
    );
  } catch {
    /* PointerEvent no disponible: sin onda */
  }
}

// ---------- hora local ----------

function initClock(root: HTMLElement): void {
  const clock = $<HTMLTimeElement>('[data-clock]', root);
  const hours = $('[data-hours]', root);
  const utcEls = $$('[data-utc], .ct-utc', root);
  const tz = root.dataset.tz || 'America/El_Salvador';
  if (!clock) return;

  const lang = pageLang();
  let fmt: Intl.DateTimeFormat;
  let parts: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat(lang === 'es' ? 'es-SV' : 'en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
    parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', weekday: 'short', timeZone: tz });
  } catch {
    return; // zona horaria no soportada: queda el texto estático
  }

  // Desfase real según Intl (por si algún día cambia); "GMT-6" → "UTC−6".
  try {
    const off = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value;
    if (off) {
      const utc = off.replace('GMT', 'UTC').replace('-', '−') || 'UTC';
      utcEls.forEach((u) => (u.textContent = utc));
    }
  } catch {
    /* shortOffset no soportado: queda UTC−6 del HTML */
  }

  const render = () => {
    const now = new Date();
    clock.textContent = fmt.format(now);
    clock.dateTime = now.toISOString();
    if (hours) {
      const p = parts.formatToParts(now);
      const h = Number(p.find((x) => x.type === 'hour')?.value ?? 0);
      const wd = p.find((x) => x.type === 'weekday')?.value ?? '';
      const working = !['Sat', 'Sun'].includes(wd) && h >= 8 && h < 18;
      hours.textContent = `· ${(working ? hours.dataset.on : hours.dataset.off) ?? ''}`;
      hours.classList.toggle('is-on', working);
    }
  };

  // Cada minuto, alineado al cambio de minuto; se resincroniza al volver a la pestaña.
  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    const ms = 60000 - (Date.now() % 60000) + 50;
    timer = window.setTimeout(() => {
      render();
      schedule();
    }, ms);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(timer);
    else {
      render();
      schedule();
    }
  });
  render();
  schedule();
}

// ---------- foco de luz en las tarjetas ----------

function initSpotlight(root: HTMLElement): void {
  if (!finePointer.matches) return;
  $$('[data-spot]', root).forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || reducedMotion.matches) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--px', `${(e.clientX - r.left).toFixed(0)}px`);
      card.style.setProperty('--py', `${(e.clientY - r.top).toFixed(0)}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--px', '50%');
      card.style.setProperty('--py', '50%');
    });
  });
}

// ---------- borrador → mailto: ----------

function initCompose(root: HTMLElement): void {
  const form = $<HTMLFormElement>('[data-compose]', root);
  if (!form) return;
  const name = form.elements.namedItem('name');
  const msg = form.elements.namedItem('message');
  const count = $('[data-count]', form);
  const status = $('[data-compose-status]', form);
  if (!(name instanceof HTMLInputElement) || !(msg instanceof HTMLTextAreaElement)) return;

  const MIN = 10;
  let tried = false;

  const fields = [
    { input: name, ok: () => name.value.trim().length > 0 },
    { input: msg, ok: () => msg.value.trim().length >= MIN },
  ];
  const errOf = (input: HTMLElement) => document.getElementById(input.getAttribute('aria-describedby') ?? '');

  const check = (f: (typeof fields)[number], show: boolean): boolean => {
    const valid = f.ok();
    const err = errOf(f.input);
    if (show) {
      f.input.setAttribute('aria-invalid', String(!valid));
      if (err) err.textContent = valid ? '' : (err.dataset.errText ?? '');
    }
    return valid;
  };

  const updateCount = () => {
    if (!count) return;
    count.textContent = String(msg.value.length);
    count.parentElement?.classList.toggle('is-near', msg.value.length > msg.maxLength * 0.9);
  };

  fields.forEach((f) =>
    f.input.addEventListener('input', () => {
      if (tried) check(f, true);
      if (status) status.textContent = '';
    }),
  );
  msg.addEventListener('input', updateCount);
  updateCount();

  form.addEventListener('submit', (e) => {
    // Nunca se envía: la CSP tiene form-action 'none'. Solo se abre la app de correo.
    e.preventDefault();
    tried = true;
    const results = fields.map((f) => check(f, true));
    const firstBad = fields.find((_, i) => !results[i]);
    if (firstBad) {
      firstBad.input.focus();
      return;
    }

    const topic = (form.elements.namedItem('topic') as RadioNodeList | null)?.value ?? '';
    const who = name.value.trim().slice(0, name.maxLength);
    const text = msg.value.trim().slice(0, msg.maxLength).replace(/\r?\n/g, '\r\n');
    const body = `${text}\r\n\r\n— ${who}`;
    const subject = topic ? `${topic} · ${who}` : who;
    const to = form.dataset.to ?? '';
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) status.textContent = status.dataset.opened ?? '';
    window.location.href = url;
  });
}
