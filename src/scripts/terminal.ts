// Terminal del hero: una shell de mentira que corre solo en el navegador.
// Toda la salida se construye con nodos y textContent: nada de lo que escribe el visitante se interpreta
// como HTML (Trusted Types). Los comandos se buscan con Object.hasOwn (sin sorpresas con "__proto__").
// Al entrar en pantalla reproduce una intro tecleada (whoami → skills --top) y deja el prompt listo.
// Con movimiento reducido, la intro ya viene impresa desde el HTML y no se anima.
// En móvil (< 768 px) arranca plegada: la intro no corre hasta que el visitante la despliega.
import { fetchStatus, fmtUptime, pct } from './status';
import { terminal } from '../i18n/terminal';
import { reducedMotion } from '../lib/dom';
import { yearsSince } from '../lib/time';

type Seg = string | { t: string; c?: string; href?: string };
type Line = Seg[];
type Lang = 'es' | 'en';

interface Cap {
  k: string;
  t: string;
  d: string;
  tools: string[];
}
interface Data {
  lang: Lang;
  name: string;
  fullName: string;
  role: string;
  lead: string;
  now: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  careerStart: string;
  caps: Cap[];
  jobs: { id: string; company: string; role: string; from: string; to: string | null; summary: string }[];
  projects: { name: string; kicker: string; summary: string; stack: string[] }[];
  skills: { k: string; v: string[] }[];
  edu: string[];
}
interface Ctx {
  lang: Lang;
  applyTheme: (t: 'light' | 'dark', persist: boolean) => void;
  rememberLang: (l: Lang) => void;
}
// Contrato nuevo de /api/status (todo opcional). Solo se leen estos campos.
interface PublicStatus {
  uptimeSeconds?: number;
  requestsServed?: number;
  cpu?: number;
  memory?: number;
  cpuHistory?: number[];
}

const S = { es: terminal.es.terminal, en: terminal.en.terminal };
const SECTIONS = ['about', 'work', 'projects', 'skills', 'system', 'contact'];
const FILES = ['README.md', 'experience.log', 'projects.md', 'skills.yaml', 'contact.txt'];
const MAX_ROWS = 400;
const MOBILE = '(max-width: 767.98px)';

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function initTerminal(ctx: Ctx): void {
  const root = document.querySelector<HTMLElement>('[data-terminal]');
  const out = root?.querySelector<HTMLElement>('[data-terminal-out]');
  const form = root?.querySelector<HTMLFormElement>('[data-terminal-form]');
  const input = root?.querySelector<HTMLInputElement>('[data-terminal-in]');
  const typed = root?.querySelector<HTMLElement>('[data-terminal-typed]');
  const toggle = root?.querySelector<HTMLButtonElement>('[data-terminal-toggle]');
  const body = root?.querySelector<HTMLElement>('[data-terminal-body]');
  const raw = document.getElementById('term-data')?.textContent;
  if (!root || !out || !form || !input || !typed || !raw) return;

  let data: Data;
  try {
    data = JSON.parse(raw) as Data;
  } catch {
    return;
  }
  const s = S[ctx.lang];
  const history: string[] = [];
  let hIdx = 0;
  let skip = false; // el visitante tomó el control: lo que quede de la intro sale sin animación
  let queue: Promise<void> = Promise.resolve();
  let introDone = false;
  let inView = false;
  let open = false;
  const mobile = window.matchMedia(MOBILE);
  /** Plegada: solo en móvil y mientras el visitante no la abra. */
  const folded = () => mobile.matches && !open;

  // ---------- salida ----------
  const row = (line: Line, ch?: string) => {
    const r = document.createElement('div');
    r.className = 'r';
    if (ch) r.dataset.ch = ch;
    for (const seg of line) {
      if (typeof seg === 'string') {
        r.append(seg);
        continue;
      }
      const node = seg.href ? document.createElement('a') : document.createElement('span');
      node.textContent = seg.t;
      if (seg.c) node.className = seg.c;
      if (seg.href && node instanceof HTMLAnchorElement) {
        node.href = seg.href;
        if (seg.href.startsWith('http')) {
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      }
      r.append(node);
    }
    out.append(r);
    while (out.childElementCount > MAX_ROWS) out.firstElementChild?.remove();
    out.scrollTop = out.scrollHeight;
  };
  const print = (...lines: Line[]) => lines.forEach((l) => row(l));
  const dim = (t: string): Seg => ({ t, c: 'c-dim' });
  const acc = (t: string): Seg => ({ t, c: 'c-acc' });
  const ok = (t: string): Seg => ({ t, c: 'c-ok' });
  const err = (t: string): Seg => ({ t, c: 'c-err' });
  const pad = (t: string, n: number) => t.padEnd(n, ' ');
  const promptSegs = (): Seg[] => [ok(`${s.prompt.user}@${s.prompt.host}`), dim(`:${s.prompt.path}$ `)];

  const still = () => reducedMotion.matches;
  const sleep = (ms: number, intro = false) =>
    still() || (intro && skip) ? Promise.resolve() : new Promise<void>((r) => window.setTimeout(r, ms));

  const capRow = (c: Cap, i: number) => row([dim(`CH${i + 1} `), acc(pad(c.k, 7)), c.tools.join(' · ')], c.k);
  const mail = (): Seg => ({ t: data.email, href: `mailto:${data.email}` });

  // ---------- comandos ----------
  const cmds: Record<string, (args: string[]) => void | Promise<void>> = {
    help: () => {
      print([{ t: s.help, c: 'c-blue' }], [dim(s.tab)], []);
      s.commands.forEach(([c, d]) => print([acc(pad(c ?? '', 20)), d ? dim(d) : '']));
    },
    whoami: () => print([ok(data.name), dim(' — '), data.role], [dim(data.location)]),
    about: () => print([data.lead]),
    skills: (a) => {
      if (a[0] === '--top' || a[0] === '-t') {
        data.caps.forEach(capRow);
        return;
      }
      print([dim('# skills.yaml')]);
      data.skills.forEach((g) => print([{ t: `${g.k}:`, c: 'c-blue' }, ` [${g.v.join(', ')}]`]));
    },
    focus: (a) => {
      const k = (a[0] ?? '').toLowerCase();
      const i = data.caps.findIndex((c) => c.k === k);
      const c = data.caps[i];
      if (!c) return print([dim(s.focusNo), ' ', data.caps.map((x) => x.k).join(' ')]);
      row([dim(`CH${i + 1} · `), acc(c.k), dim(' — '), { t: c.t, c: 'c-cmd' }], c.k);
      row([c.d], c.k);
      row([{ t: `[${c.tools.join(', ')}]`, c: 'c-blue' }], c.k);
    },
    experience: () =>
      data.jobs.forEach((j, i) =>
        print(
          [{ t: '* ', c: i === 0 ? 'c-acc' : 'c-dim' }, { t: j.id, c: 'c-warn' }, ' ', { t: j.company, c: 'c-cmd' }, dim(` — ${j.role}`)],
          [dim('|  '), dim(`${j.from} → ${j.to ?? s.present}  `), j.summary],
        ),
      ),
    projects: () =>
      data.projects.forEach((p) => print([acc(p.name), dim(` — ${p.kicker}`)], [dim('  '), p.summary], [dim(`  [${p.stack.join(', ')}]`)], [])),
    education: () => data.edu.forEach((e) => print([dim('- '), e])),
    contact: () =>
      print(
        [pad('email', 10), mail()],
        [pad('linkedin', 10), { t: data.linkedin.replace('https://www.', ''), href: data.linkedin }],
        [pad('github', 10), { t: data.github.replace('https://', ''), href: data.github }],
      ),
    status: async () => {
      print([dim(s.fetching)]);
      let st: PublicStatus | null = null;
      try {
        st = (await fetchStatus()) as PublicStatus | null;
      } catch {
        st = null;
      }
      if (!st) return print([err(s.down)]);
      const lines: Line[] = [];
      if (isNum(st.uptimeSeconds)) lines.push([pad(s.uptime, 12), ok(fmtUptime(st.uptimeSeconds, ctx.lang))]);
      if (isNum(st.requestsServed)) lines.push([pad(s.requests, 12), st.requestsServed.toLocaleString(ctx.lang)]);
      if (isNum(st.cpu)) lines.push([pad(s.cpu, 12), pct(clamp01(st.cpu))]);
      if (isNum(st.memory)) lines.push([pad(s.memory, 12), pct(clamp01(st.memory))]);
      const hist = Array.isArray(st.cpuHistory) ? st.cpuHistory.filter(isNum).slice(-32) : [];
      if (hist.length > 1) {
        const bars = '▁▂▃▄▅▆▇█';
        lines.push([pad(s.load, 12), { t: hist.map((v) => bars[Math.round(clamp01(v) * 7)]).join(''), c: 'c-acc' }]);
      }
      if (!lines.length) return print([err(s.down)]);
      print(...lines);
    },
    neofetch: () => {
      const n = s.nf;
      const logo = ['  ┌───────┐  ', '  │ ▚▚ ▞▞ │  ', '  │ ▚▚ ▞▞ │  ', '  │ ▞▞ ▚▚ │  ', '  └──┬─┬──┘  ', '   ──┴─┴──   '];
      const years = (() => {
        try {
          return String(yearsSince(data.careerStart));
        } catch {
          return '—';
        }
      })();
      const info: Line[] = [
        [ok(s.prompt.user), '@', acc(s.prompt.host)],
        [dim('------------')],
        [acc(`${n.role}: `), data.role],
        [acc(`${n.now}: `), data.now],
        [acc(`${n.focus}: `), data.caps.map((c) => c.k).join(' · ')],
        [acc(`${n.exp}: `), `${years}+ ${n.years}`],
        [acc(`${n.langs}: `), n.langsValue],
        [acc(`${n.host}: `), n.hostValue],
        [acc(`${n.shell}: `), n.shellValue],
      ];
      for (let i = 0; i < Math.max(logo.length, info.length); i++) print([dim(logo[i] ?? ' '.repeat(13)), ' ', ...(info[i] ?? [])]);
    },
    theme: (a) => {
      const v = a[0] === 'light' || a[0] === 'dark' ? a[0] : document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      ctx.applyTheme(v, true);
      print([dim(s.themeSet), ' ', acc(v)]);
    },
    lang: (a) => {
      const v: Lang = a[0] === 'es' || a[0] === 'en' ? a[0] : ctx.lang === 'es' ? 'en' : 'es';
      ctx.rememberLang(v);
      print([dim(s.langSwitch)]);
      window.setTimeout(() => location.assign(`/${v}/`), 300);
    },
    goto: (a) => {
      const id = a[0] === 'experience' ? 'work' : a[0];
      if (!id || !SECTIONS.includes(id)) return print([dim(s.gotoNo), ' ', SECTIONS.join(' ')]);
      input.blur();
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    },
    ls: () => print([...FILES.flatMap((f): Seg[] => [{ t: f, c: f.endsWith('.md') ? 'c-blue' : 'c-cmd' }, '  '])]),
    cat: (a) => {
      const f = a[0];
      const map: Record<string, () => void> = {
        'README.md': () => cmds.about?.([]),
        'experience.log': () => cmds.experience?.([]),
        'projects.md': () => cmds.projects?.([]),
        'skills.yaml': () => cmds.skills?.([]),
        'contact.txt': () => cmds.contact?.([]),
      };
      if (!f) return print([dim('usage: cat <file>')]);
      const fn = Object.hasOwn(map, f) ? map[f] : undefined;
      if (fn) fn();
      else print([err(`cat: ${f}: ${s.noFile}`)]);
    },
    pwd: () => print([`/home/${s.prompt.user}`]),
    date: () => print([new Date().toString()]),
    echo: (a) => print([a.join(' ')]),
    history: () => history.forEach((h, i) => print([dim(String(i + 1).padStart(4, ' ') + '  '), h])),
    clear: () => out.replaceChildren(),
    exit: () => {
      print([dim(s.exit)]);
      input.blur();
      if (mobile.matches) setOpen(false);
    },
    sudo: (a) => (a.join(' ').includes('hire') ? print([s.hire, ' ', mail()]) : print([err(s.sudo)])),
    hire: () => print([s.hire, ' ', mail()]),
    rm: () => print([{ t: s.rm, c: 'c-warn' }]),
    ssh: () => print([{ t: s.ssh, c: 'c-warn' }]),
    vim: () => print([dim(s.vim)]),
    ':q': () => print([ok(s.quit)]),
    uname: () => print(['portfolio-sh']),
  };
  const alias: Record<string, string> = {
    work: 'experience',
    exp: 'experience',
    stack: 'skills',
    cls: 'clear',
    quit: 'exit',
    logout: 'exit',
    '?': 'help',
    uptime: 'status',
    top: 'status',
    whois: 'whoami',
    kubectl: 'ssh',
    docker: 'ssh',
    telnet: 'ssh',
    vi: 'vim',
    nano: 'vim',
    emacs: 'vim',
    ':q!': ':q',
    ':wq': ':q',
  };
  const names = [...Object.keys(cmds), ...Object.keys(alias)].filter((n) => !n.startsWith(':')).sort();

  async function run(line: string) {
    const trimmed = line.trim().slice(0, 120);
    row([...promptSegs(), { t: trimmed, c: 'c-cmd' }]);
    if (!trimmed) return;
    history.push(trimmed);
    if (history.length > 50) history.shift();
    hIdx = history.length;
    const [head = '', ...args] = trimmed.split(/\s+/);
    const lower = head.toLowerCase();
    const key = Object.hasOwn(alias, lower) ? (alias[lower] as string) : lower;
    const fn = Object.hasOwn(cmds, key) ? cmds[key] : undefined;
    try {
      if (fn) await fn(args);
      else print([err(`${head}: ${s.notFound}`), dim(' · help')]);
    } catch {
      print([err(`${head}: error`)]);
    }
  }

  /** Teclea el comando en el prompt (si hay movimiento) y lo ejecuta. Serializado en una cola. */
  const exec = (cmd: string, animate = true, intro = false) => {
    queue = queue.then(async () => {
      if (animate && !still() && !(intro && skip)) {
        const per = intro ? 62 : 22; // los chips se teclean rápido
        for (const ch of cmd) {
          if (intro && skip) break;
          typed.textContent += ch;
          await sleep(per * 0.6 + Math.random() * per, intro);
        }
        await sleep(intro ? 180 : 60, intro);
      }
      typed.textContent = '';
      await run(cmd);
    });
    return queue;
  };

  // ---------- estado del prompt ----------
  const line = form;
  const syncIdle = () => line.classList.toggle('is-idle', document.activeElement !== input && !input.value);
  input.addEventListener('focus', () => {
    hurry();
    syncIdle();
  });
  input.addEventListener('blur', syncIdle);
  input.addEventListener('input', syncIdle);
  syncIdle();

  /** El visitante tomó el control: lo que quede de la intro se imprime sin animación. */
  function hurry() {
    skip = true;
  }

  const reveal = () => {
    const r = root.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      root.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  };
  const focusTerm = () => {
    hurry();
    if (folded()) {
      setOpen(true);
      // se mide al terminar de desplegarse (--dur-3)
      window.setTimeout(reveal, reducedMotion.matches ? 0 : 440);
    } else reveal();
    input.focus({ preventScroll: true });
  };

  // ---------- plegado (móvil) ----------
  function setOpen(v: boolean) {
    open = v;
    root?.classList.toggle('is-open', v);
    toggle?.setAttribute('aria-expanded', String(v));
    if (v) startIntro();
    else if (body?.contains(document.activeElement)) toggle?.focus();
  }
  toggle?.addEventListener('click', () => setOpen(!open));

  // ---------- intro ----------
  function startIntro() {
    if (introDone || !out) return;
    introDone = true;
    out.classList.remove('is-pending');
    if (reducedMotion.matches) return; // la transcripción del HTML ya es la intro
    out.setAttribute('aria-live', 'off');
    out.replaceChildren();
    print([dim(s.welcome)]);
    // Se encola de forma síncrona: un comando pedido al mismo tiempo (chip, canal) sale después de la intro.
    queue = queue.then(() => sleep(500, true));
    void exec('whoami', true, true);
    queue = queue.then(() => sleep(650, true));
    void exec('skills --top', true, true).then(() => out.setAttribute('aria-live', 'polite'));
  }
  // Arranca al verse (escritorio) o al desplegarse (móvil).
  const maybeStart = () => {
    if (inView && !folded()) startIntro();
  };
  mobile.addEventListener('change', maybeStart);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        maybeStart();
        if (introDone) io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(root);
  } else {
    inView = true;
    maybeStart();
  }
  // Si el visitante usa la terminal antes de verla entera, la intro sale de golpe.
  const startNow = () => {
    hurry();
    startIntro();
  };

  // ---------- eventos ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    startNow();
    const v = input.value;
    input.value = '';
    syncIdle();
    void exec(v, false);
  });
  form.addEventListener('click', (e) => {
    if (e.target !== input) focusTerm();
  });
  // Ratón: clic en la salida enfoca (si no se está seleccionando texto). Táctil: no, para no abrir el teclado.
  out.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.getSelection()?.toString()) return;
    focusTerm();
  });
  root.querySelectorAll<HTMLButtonElement>('button[data-cmd]').forEach((b) =>
    b.addEventListener('click', () => {
      startNow();
      void exec(b.dataset.cmd ?? 'help');
    }),
  );
  document.querySelectorAll('[data-terminal-focus]').forEach((b) => b.addEventListener('click', focusTerm));
  // Otros módulos (canales del hero) piden comandos con un evento.
  document.addEventListener('term:run', (e) => {
    const cmd = (e as CustomEvent<string>).detail;
    if (typeof cmd !== 'string' || folded()) return; // plegada: los canales no la abren de golpe
    startNow();
    void exec(cmd.slice(0, 120));
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement | null;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (typing) return;
    if (e.key === '/' || e.key === '`' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      focusTerm();
      startNow();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? '';
    } else if (e.key === 'Tab') {
      const v = input.value;
      if (!v) return; // Tab vacío: deja salir el foco (accesibilidad)
      e.preventDefault();
      const parts = v.split(' ');
      const complete = (pool: string[], prefix: string, base: string) => {
        const m = pool.filter((n) => n.startsWith(prefix));
        if (m.length === 1) input.value = `${base}${m[0]}${base ? '' : ' '}`;
        else if (m.length > 1) print([dim(m.join('  '))]);
      };
      if (parts.length === 1) complete(names, v, '');
      else if (parts[0] === 'cat') complete(FILES, parts[1] ?? '', 'cat ');
      else if (parts[0] === 'goto') complete(SECTIONS, parts[1] ?? '', 'goto ');
      else if (parts[0] === 'focus') complete(data.caps.map((c) => c.k), parts[1] ?? '', 'focus ');
      else if (parts[0] === 'theme') complete(['light', 'dark'], parts[1] ?? '', 'theme ');
      else if (parts[0] === 'lang') complete(['es', 'en'], parts[1] ?? '', 'lang ');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.replaceChildren();
    }
  });
}
