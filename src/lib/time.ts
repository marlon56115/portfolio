// Fechas y duraciones del sitio. Funciones puras: se usan al construir (Astro) y en el navegador.
// `hydrateSince()` vuelve a calcular en el cliente los elementos con data-since, para que
// "años de experiencia" y la duración del trabajo actual sigan correctos aunque no se reconstruya el sitio.

export type TimeLang = 'es' | 'en';

const MONTHS: Record<TimeLang, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2022-04" → { y: 2022, m: 4 }. Lanza si el formato no es YYYY-MM. */
export function parseYM(ym: string): { y: number; m: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!match) throw new Error(`fecha inválida (se espera YYYY-MM): ${ym}`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  if (m < 1 || m > 12) throw new Error(`mes inválido: ${ym}`);
  return { y, m };
}

/** Fecha actual como YYYY-MM (hora local). */
export function currentYM(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Meses entre dos fechas YYYY-MM. `to` null = hoy.
 * `inclusive` cuenta el mes de inicio y el de fin (como LinkedIn: abr–abr = 1 mes).
 */
export function monthsBetween(from: string, to: string | null = null, opts: { inclusive?: boolean; now?: Date } = {}): number {
  const a = parseYM(from);
  const b = parseYM(to ?? currentYM(opts.now));
  const diff = (b.y - a.y) * 12 + (b.m - a.m) + (opts.inclusive ? 1 : 0);
  return Math.max(0, diff);
}

/** Años completos desde una fecha YYYY-MM (p. ej. años de experiencia). */
export function yearsSince(from: string, now: Date = new Date()): number {
  return Math.floor(monthsBetween(from, null, { now }) / 12);
}

/** "2022-04" → "abr 2022" / "Apr 2022". */
export function formatYM(ym: string, lang: TimeLang): string {
  const { y, m } = parseYM(ym);
  return `${MONTHS[lang][m - 1]} ${y}`;
}

/** Rango "abr 2022 — nov 2024" o "oct 2025 — hoy". */
export function formatRange(from: string, to: string | null, lang: TimeLang, present: string): string {
  return `${formatYM(from, lang)} — ${to ? formatYM(to, lang) : present}`;
}

/** 32 → "2 años 8 meses" / "2 yrs 8 mos". Siempre al menos "1 mes". */
export function formatDuration(months: number, lang: TimeLang): string {
  const total = Math.max(1, Math.round(months));
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts: string[] = [];
  if (lang === 'es') {
    if (y) parts.push(`${y} ${y === 1 ? 'año' : 'años'}`);
    if (m) parts.push(`${m} ${m === 1 ? 'mes' : 'meses'}`);
  } else {
    if (y) parts.push(`${y} ${y === 1 ? 'yr' : 'yrs'}`);
    if (m) parts.push(`${m} ${m === 1 ? 'mo' : 'mos'}`);
  }
  return parts.join(' ');
}

/** Duración de un puesto (inclusiva, como en un CV). */
export function jobDuration(from: string, to: string | null, lang: TimeLang, now?: Date): string {
  return formatDuration(monthsBetween(from, to, { inclusive: true, now }), lang);
}

// ---------- cliente ----------

/**
 * Formatos de data-since-format:
 * - "years" (por defecto): años completos desde data-since → "4"
 * - "duration": duración inclusiva hasta data-to (o hoy) → "1 año 2 meses"
 * Uso: <span data-since="2022-04">4</span> · <span data-since="2025-10" data-since-format="duration">2 meses</span>
 * El idioma sale de data-lang en <html>.
 */
export function hydrateSince(root: ParentNode = document): void {
  const lang: TimeLang = document.documentElement.dataset.lang === 'es' ? 'es' : 'en';
  root.querySelectorAll<HTMLElement>('[data-since]').forEach((el) => {
    const from = el.dataset.since ?? '';
    try {
      const text =
        el.dataset.sinceFormat === 'duration' ? jobDuration(from, el.dataset.to || null, lang) : String(yearsSince(from));
      if (el.textContent !== text) el.textContent = text;
    } catch {
      /* fecha mal escrita: se deja el valor del build */
    }
  });
  // Año del pie (© 2026): también se corrige sin reconstruir.
  const year = String(new Date().getFullYear());
  root.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    if (el.textContent !== year) el.textContent = year;
  });
}
