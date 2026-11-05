// Texto compartido por todo el sitio: datos de contacto, meta, navegación, controles y pie.
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
    title: 'Marlon Guerra · Lead DevOps Engineer',
    description:
      'Ingeniero DevOps en El Salvador: CI/CD, contenedores, Kubernetes, infraestructura como código y observabilidad. También desarrollo backend y automatizo operación con agentes de IA.',
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
    more: 'Ver más',
    less: 'Ver menos',
  },
  footer: {
    line: 'Autoalojado. Sin trackers ni cookies de terceros.',
    version: 'versión',
  },
  notFound: {
    title: 'Señal perdida',
    body: 'Esta página no existe o se movió.',
    home: 'Volver al inicio',
  },
};

type Common = typeof es;

const en: Common = {
  ...facts,
  htmlLang: 'en',
  meta: {
    title: 'Marlon Guerra · Lead DevOps Engineer',
    description:
      'DevOps engineer based in El Salvador: CI/CD, containers, Kubernetes, infrastructure as code and observability. I also build backends and automate operations with AI agents.',
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
    more: 'Show more',
    less: 'Show less',
  },
  footer: {
    line: 'Self-hosted. No trackers, no third-party cookies.',
    version: 'version',
  },
  notFound: {
    title: 'Signal lost',
    body: 'This page doesn’t exist or has moved.',
    home: 'Back to home',
  },
};

export const common = { es, en };
