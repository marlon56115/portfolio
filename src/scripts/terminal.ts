// Terminal del sitio. Toda la salida se construye con nodos y textContent:
// nada de lo que escribe el visitante se interpreta como HTML.
import { fetchStatus, fmtBytes, fmtRate, fmtUptime, pct } from './status';

type Seg = string | { t: string; c?: string; href?: string };
type Line = Seg[];
type Lang = 'es' | 'en';

interface Data {
  lang: Lang;
  name: string;
  fullName: string;
  role: string;
  lead: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  jobs: { id: string; company: string; role: string; from: string; to: string | null; summary: string }[];
  projects: { name: string; kicker: string; summary: string; stack: string[] }[];
  skills: { k: string; v: string[] }[];
  edu: string[];
  welcome: string;
  notFound: string;
}

interface Ctx {
  lang: Lang;
  applyTheme: (t: 'light' | 'dark', persist: boolean) => void;
  rememberLang: (l: Lang) => void;
}

const S = {
  es: {
    help: [
      ['whoami', 'quién soy'],
      ['about', 'resumen'],
      ['experience', 'historial laboral'],
      ['projects', 'proyectos'],
      ['skills', 'stack técnico'],
      ['education', 'formación'],
      ['contact', 'cómo contactarme'],
      ['status', 'métricas en vivo del servidor'],
      ['neofetch', 'info del sistema'],
      ['kubectl get pods', 'pods del clúster (resumen)'],
      ['theme light|dark', 'cambiar el tema'],
      ['lang es|en', 'cambiar el idioma'],
      ['goto <sección>', 'ir a una sección'],
      ['ls · cat · pwd · date · echo · history · clear · exit', ''],
    ],
    tab: 'Tab autocompleta · ↑↓ historial',
    fetching: 'consultando Prometheus…',
    down: 'Prometheus no responde ahora mismo.',
    sudo: 'visitor no está en el archivo sudoers. Este incidente será reportado.',
    rm: 'Buen intento. El sistema de archivos es de solo lectura (readOnlyRootFilesystem: true).',
    noFile: 'No existe el archivo',
    themeSet: 'tema:',
    langSwitch: 'cambiando idioma…',
    gotoNo: 'secciones:',
    hire: 'Excelente decisión. Escríbeme a',
  },
  en: {
    help: [
      ['whoami', 'who I am'],
      ['about', 'summary'],
      ['experience', 'work history'],
      ['projects', 'projects'],
      ['skills', 'tech stack'],
      ['education', 'education'],
      ['contact', 'how to reach me'],
      ['status', 'live server metrics'],
      ['neofetch', 'system info'],
      ['kubectl get pods', 'cluster pods (summary)'],
      ['theme light|dark', 'switch theme'],
      ['lang es|en', 'switch language'],
      ['goto <section>', 'jump to a section'],
      ['ls · cat · pwd · date · echo · history · clear · exit', ''],
    ],
    tab: 'Tab completes · ↑↓ history',
    fetching: 'querying Prometheus…',
    down: 'Prometheus is not answering right now.',
    sudo: 'visitor is not in the sudoers file. This incident will be reported.',
    rm: 'Nice try. The filesystem is read-only (readOnlyRootFilesystem: true).',
    noFile: 'No such file',
    themeSet: 'theme:',
    langSwitch: 'switching language…',
    gotoNo: 'sections:',
    hire: 'Great call. Write to',
  },
};

const SECTIONS = ['about', 'system', 'work', 'projects', 'skills', 'contact'];
const FILES = ['README.md', 'experience.log', 'projects.md', 'skills.yaml', 'contact.txt'];

export function initTerminal(ctx: Ctx) {
  const dlg = document.querySelector<HTMLDialogElement>('[data-terminal]');
  const out = document.querySelector<HTMLElement>('[data-terminal-out]');
  const form = document.querySelector<HTMLFormElement>('[data-terminal-form]');
  const input = document.querySelector<HTMLInputElement>('[data-terminal-in]');
  const raw = document.getElementById('term-data')?.textContent;
  if (!dlg || !out || !form || !input || !raw) return;

  let data: Data;
  try {
    data = JSON.parse(raw) as Data;
  } catch {
    return;
  }
  const s = S[ctx.lang];
  const history: string[] = [];
  let hIdx = 0;
  let greeted = false;

  // ---------- salida ----------
  const print = (...lines: Line[]) => {
    for (const line of lines) {
      const row = document.createElement('div');
      for (const seg of line) {
        if (typeof seg === 'string') {
          row.append(seg);
          continue;
        }
        const el = seg.href ? document.createElement('a') : document.createElement('span');
        el.textContent = seg.t;
        if (seg.c) el.className = seg.c;
        if (seg.href && el instanceof HTMLAnchorElement) {
          el.href = seg.href;
          if (seg.href.startsWith('http')) {
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
          }
        }
        row.append(el);
      }
      if (line.length === 0) row.append(' ');
      out.append(row);
    }
    out.scrollTop = out.scrollHeight;
  };
  const dim = (t: string): Seg => ({ t, c: 'c-dim' });
  const acc = (t: string): Seg => ({ t, c: 'c-acc' });
  const ok = (t: string): Seg => ({ t, c: 'c-ok' });
  const pad = (t: string, n: number) => t.padEnd(n, ' ');

  // ---------- comandos ----------
  const cmds: Record<string, (args: string[]) => void | Promise<void>> = {
    help: () => {
      print([dim(s.tab)], []);
      s.help.forEach(([c, d]) => print([acc(pad(c ?? '', 22)), d ? dim(d ?? '') : '']));
    },
    whoami: () => print([ok(data.fullName)], [data.role, dim(' · '), data.location]),
    about: () => print([data.lead]),
    experience: () => {
      data.jobs.forEach((j, i) =>
        print(
          [{ t: '* ', c: i === 0 ? 'c-acc' : 'c-dim' }, { t: j.id, c: 'c-warn' }, ' ', { t: j.company, c: 'c-cmd' }, dim(` — ${j.role}`)],
          [dim('|  '), dim(`${j.from} → ${j.to ?? (ctx.lang === 'es' ? 'hoy' : 'now')}  `), j.summary],
        ),
      );
    },
    projects: () =>
      data.projects.forEach((p) => print([acc(p.name), dim(` — ${p.kicker}`)], [dim('  '), p.summary], [dim(`  [${p.stack.join(', ')}]`)], [])),
    skills: () => {
      print([dim('# skills.yaml')]);
      data.skills.forEach((g) => print([{ t: `${g.k}:`, c: 'c-blue' }, ` [${g.v.join(', ')}]`]));
    },
    education: () => data.edu.forEach((e) => print([dim('- '), e])),
    contact: () =>
      print(
        [pad('email', 10), { t: data.email, href: `mailto:${data.email}` }],
        [pad('linkedin', 10), { t: data.linkedin.replace('https://www.', ''), href: data.linkedin }],
        [pad('github', 10), { t: data.github.replace('https://', ''), href: data.github }],
      ),
    status: async () => {
      print([dim(s.fetching)]);
      const st = await fetchStatus();
      if (!st) return print([{ t: s.down, c: 'c-err' }]);
      print(
        [pad('uptime', 12), ok(st.uptimeSeconds !== undefined ? fmtUptime(st.uptimeSeconds, ctx.lang) : '—')],
        [pad('cpu', 12), st.cpu !== undefined ? pct(st.cpu) : '—'],
        [pad('memory', 12), st.memory !== undefined ? pct(st.memory) : '—', st.memoryTotalBytes ? dim(` of ${fmtBytes(st.memoryTotalBytes)}`) : ''],
        [pad('pods', 12), String(st.pods ?? '—'), dim(st.namespaces ? ` in ${st.namespaces} namespaces` : '')],
        [pad('temp', 12), st.cpuTempC !== undefined ? `${st.cpuTempC.toFixed(1)} °C` : '—'],
        [pad('net', 12), st.netRxBps !== undefined ? `↓ ${fmtRate(st.netRxBps)}  ↑ ${fmtRate(st.netTxBps ?? 0)}` : '—'],
      );
    },
    neofetch: async () => {
      const st = await fetchStatus();
      const logo = ['   ▄▄▄▄▄▄▄   ', '  █ ▄▄▄▄▄ █  ', '  █ █   █ █  ', '  █ █▄▄▄█ █  ', '  █▄▄▄▄▄▄▄█  ', '   ▀▀▀▀▀▀▀   '];
      const info: Line[] = [
        [ok('visitor'), '@', acc('homelab')],
        [dim('-----------------')],
        [acc('OS: '), st?.os ?? 'Ubuntu Server LTS'],
        [acc('Host: '), 'Ryzen 5 3600 · 32 GB'],
        [acc('Kernel: '), 'linux'],
        [acc('Uptime: '), st?.uptimeSeconds !== undefined ? fmtUptime(st.uptimeSeconds, ctx.lang) : '—'],
        [acc('Orchestrator: '), `k3s ${st?.k8s ?? ''}`],
        [acc('Pods: '), String(st?.pods ?? '—')],
        [acc('Shell: '), 'portfolio-sh 1.0'],
      ];
      for (let i = 0; i < Math.max(logo.length, info.length); i++) print([dim(logo[i] ?? ' '.repeat(13)), '  ', ...(info[i] ?? [])]);
    },
    kubectl: async (a) => {
      if (a.join(' ') !== 'get pods' && a.join(' ') !== 'get pods -A') {
        return print([dim('usage: kubectl get pods')]);
      }
      const st = await fetchStatus();
      print(
        [dim(pad('NAMESPACE', 14) + pad('NAME', 26) + pad('READY', 8) + 'STATUS')],
        [pad('portfolio', 14), pad('portfolio-7c9f…', 26), pad('1/1', 8), ok('Running')],
        [dim(`… ${st?.pods ? st.pods - 1 : '?'} more (names are not public)`)],
      );
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
      dlg.close();
      document.getElementById(id)?.scrollIntoView();
    },
    ls: () => print([...FILES.flatMap((f) => [{ t: f, c: f.endsWith('.md') ? 'c-blue' : 'c-cmd' }, '  '])]),
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
      else print([{ t: `cat: ${f}: ${s.noFile}`, c: 'c-err' }]);
    },
    pwd: () => print(['/home/visitor']),
    date: () => print([new Date().toString()]),
    echo: (a) => print([a.join(' ')]),
    history: () => history.forEach((h, i) => print([dim(String(i + 1).padStart(4, ' ') + '  '), h])),
    clear: () => out.replaceChildren(),
    exit: () => dlg.close(),
    sudo: (a) => (a.join(' ').includes('hire') ? print([s.hire, ' ', { t: data.email, href: `mailto:${data.email}` }]) : print([{ t: s.sudo, c: 'c-err' }])),
    rm: () => print([{ t: s.rm, c: 'c-warn' }]),
    uname: () => print(['Linux homelab k3s x86_64 GNU/Linux']),
    hire: () => print([s.hire, ' ', { t: data.email, href: `mailto:${data.email}` }]),
  };
  const alias: Record<string, string> = { work: 'experience', exp: 'experience', stack: 'skills', cls: 'clear', quit: 'exit', '?': 'help', uptime: 'status', top: 'status' };
  const names = [...Object.keys(cmds), ...Object.keys(alias)].sort();

  async function run(line: string) {
    const trimmed = line.trim();
    print([{ t: 'visitor@homelab', c: 'c-ok' }, dim(':~$ '), { t: trimmed, c: 'c-cmd' }]);
    if (!trimmed) return;
    history.push(trimmed);
    if (history.length > 50) history.shift();
    hIdx = history.length;
    const [head = '', ...args] = trimmed.split(/\s+/);
    const lower = head.toLowerCase();
    const key = Object.hasOwn(alias, lower) ? (alias[lower] as string) : lower;
    const fn = Object.hasOwn(cmds, key) ? cmds[key] : undefined;
    if (fn) await fn(args);
    else print([{ t: `${head}: ${data.notFound}`, c: 'c-err' }, dim(' · help')]);
  }

  // ---------- eventos ----------
  const open = () => {
    if (dlg.open) return;
    dlg.showModal();
    if (!greeted) {
      greeted = true;
      print([dim(data.welcome)], []);
      void run('neofetch');
    }
    window.setTimeout(() => input.focus(), 30);
  };
  document.querySelectorAll('[data-terminal-open]').forEach((b) => b.addEventListener('click', open));
  document.querySelector('[data-terminal-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  out.addEventListener('click', () => input.focus());

  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement | null;
    const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (!typing && (e.key === '`' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
      e.preventDefault();
      open();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.slice(0, 120);
    input.value = '';
    void run(v);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value;
      const parts = v.split(' ');
      if (parts.length === 1) {
        const m = names.filter((n) => n.startsWith(v));
        if (m.length === 1) input.value = `${m[0]} `;
        else if (m.length > 1) print([dim(m.join('  '))]);
      } else if (parts[0] === 'cat') {
        const m = FILES.filter((f) => f.startsWith(parts[1] ?? ''));
        if (m.length === 1) input.value = `cat ${m[0]}`;
        else if (m.length > 1) print([dim(m.join('  '))]);
      } else if (parts[0] === 'goto') {
        const m = SECTIONS.filter((f) => f.startsWith(parts[1] ?? ''));
        if (m.length === 1) input.value = `goto ${m[0]}`;
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.replaceChildren();
    }
  });
}
