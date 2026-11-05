// Texto compartido por todo el sitio: datos de contacto, meta, navegación, controles y pie.
// Archivo de la fase 1 (congelado para la fase 2 salvo cambios aditivos; ver DESIGN.md).
// Regla de privacidad: nada de "homelab", nombres de host, "mi casa", hardware ni versiones.

export type Lang = 'es' | 'en';
export const langs: Lang[] = ['es', 'en'];

/** Mes en que empezó la carrera profesional (YYYY-MM). Base de los años de experiencia dinámicos. */
export const careerStart = '2022-04';

const facts = {
  name: 'Marlon Guerra',
  fullName: 'Marlon Wilfredo Guerra Ramírez',
  initials: 'mg',
  email: 'marlon56115@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marlonguerradev',
  github: 'https://github.com/marlon56115',
  location: 'Santa Ana, El Salvador',
};

const es = {
  ...facts,
  htmlLang: 'es',
  meta: {
    title: 'Marlon Guerra · Lead Full-Stack Engineer',
    description:
      'Ingeniero full-stack en El Salvador. Desarrollo, despliegue, infraestructura y bases de datos de punta a punta, con experiencia fuerte en agentes de IA e integraciones con LLMs.',
  },
  // Orden = orden de las secciones en la página.
  nav: { about: 'inicio', work: 'experiencia', projects: 'proyectos', skills: 'stack', system: 'autoalojado', contact: 'contacto' },
  ui: {
    theme: 'Cambiar tema',
    themeLight: 'claro',
    themeDark: 'oscuro',
    language: 'Idioma',
    menu: 'Menú',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    primaryNav: 'Navegación principal',
    openTerminal: 'Abrir terminal',
    terminalHint: 'pulsa',
    skip: 'Saltar al contenido',
    close: 'Cerrar',
    copied: 'copiado',
    copyEmail: 'Copiar correo',
    backToTop: 'Volver arriba',
  },
  footer: {
    line: 'Diseñado y construido a mano. Autoalojado, sin trackers ni cookies de terceros.',
    version: 'versión',
  },
  notFound: {
    title: 'Señal perdida',
    body: 'Esta ruta no existe. Puede que el enlace esté roto o que la página se haya movido.',
    home: 'Volver al inicio',
  },
};

type Common = typeof es;

const en: Common = {
  ...facts,
  htmlLang: 'en',
  meta: {
    title: 'Marlon Guerra · Lead Full-Stack Engineer',
    description:
      'Full-stack engineer based in El Salvador. Development, deployment, infrastructure and databases end to end, with strong hands-on experience in AI agents and LLM integrations.',
  },
  nav: { about: 'home', work: 'experience', projects: 'projects', skills: 'stack', system: 'self-hosted', contact: 'contact' },
  ui: {
    theme: 'Toggle theme',
    themeLight: 'light',
    themeDark: 'dark',
    language: 'Language',
    menu: 'Menu',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    primaryNav: 'Main navigation',
    openTerminal: 'Open terminal',
    terminalHint: 'press',
    skip: 'Skip to content',
    close: 'Close',
    copied: 'copied',
    copyEmail: 'Copy email',
    backToTop: 'Back to top',
  },
  footer: {
    line: 'Designed and built by hand. Self-hosted, no trackers, no third-party cookies.',
    version: 'version',
  },
  notFound: {
    title: 'Signal lost',
    body: 'This route does not exist. The link may be broken or the page may have moved.',
    home: 'Back to home',
  },
};

export const common = { es, en };
