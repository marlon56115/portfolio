// Textos de la terminal interactiva. Dueño en la fase 2: pf-hero.
// Lo usan Terminal.astro (vía dict) y src/scripts/terminal.ts (importa `terminal` directamente).
// Privacidad: el prompt usa un host genérico; nada de hardware, SO, versiones ni nombres internos.

const prompt = { user: 'visitor', host: 'portfolio', path: '~' };

const es = {
  terminal: {
    title: 'terminal',
    prompt,
    welcome: 'Bienvenido. Escribe `help` para ver los comandos. `exit` o Esc para salir.',
    notFound: 'comando no encontrado',
    help: 'comandos disponibles',
    commands: [
      ['whoami', 'quién soy'],
      ['about', 'resumen'],
      ['experience', 'historial laboral'],
      ['projects', 'proyectos'],
      ['skills', 'stack técnico'],
      ['education', 'formación'],
      ['contact', 'cómo contactarme'],
      ['status', 'métricas en vivo del servidor'],
      ['neofetch', 'info del sistema'],
      ['theme light|dark', 'cambiar el tema'],
      ['lang es|en', 'cambiar el idioma'],
      ['goto <sección>', 'ir a una sección'],
      ['ls · cat · pwd · date · echo · history · clear · exit', ''],
    ] as [string, string][],
    tab: 'Tab autocompleta · ↑↓ historial',
    fetching: 'consultando métricas…',
    down: 'Las métricas no responden ahora mismo.',
    sudo: 'visitor no está en el archivo sudoers. Este incidente será reportado.',
    rm: 'Buen intento. El sistema de archivos es de solo lectura.',
    noFile: 'No existe el archivo',
    themeSet: 'tema:',
    langSwitch: 'cambiando idioma…',
    gotoNo: 'secciones:',
    hire: 'Excelente decisión. Escríbeme a',
    present: 'hoy',
    selfHosted: 'autoalojado',
  },
};

type Terminal = typeof es;

const en: Terminal = {
  terminal: {
    title: 'terminal',
    prompt,
    welcome: 'Welcome. Type `help` to list commands. `exit` or Esc to leave.',
    notFound: 'command not found',
    help: 'available commands',
    commands: [
      ['whoami', 'who I am'],
      ['about', 'summary'],
      ['experience', 'work history'],
      ['projects', 'projects'],
      ['skills', 'tech stack'],
      ['education', 'education'],
      ['contact', 'how to reach me'],
      ['status', 'live server metrics'],
      ['neofetch', 'system info'],
      ['theme light|dark', 'switch theme'],
      ['lang es|en', 'switch language'],
      ['goto <section>', 'jump to a section'],
      ['ls · cat · pwd · date · echo · history · clear · exit', ''],
    ],
    tab: 'Tab completes · ↑↓ history',
    fetching: 'querying metrics…',
    down: 'Metrics are not answering right now.',
    sudo: 'visitor is not in the sudoers file. This incident will be reported.',
    rm: 'Nice try. The filesystem is read-only.',
    noFile: 'No such file',
    themeSet: 'theme:',
    langSwitch: 'switching language…',
    gotoNo: 'sections:',
    hire: 'Great call. Write to',
    present: 'now',
    selfHosted: 'self-hosted',
  },
};

export const terminal = { es, en };
