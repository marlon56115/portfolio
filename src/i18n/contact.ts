// Sección de contacto. Dueño en la fase 2: pf-contact.
// El correo, LinkedIn y GitHub viven en common.ts (facts); aquí solo el texto de la sección.

/**
 * Disponibilidad mostrada en la sección. Cambia solo `state`:
 *  - 'open'    → LED verde, "abierto a propuestas"
 *  - 'limited' → LED ámbar, "agenda limitada"
 *  - 'closed'  → LED apagado, "sin disponibilidad por ahora"
 */
export const availability: 'open' | 'limited' | 'closed' = 'open';

/** Zona horaria de la hora local en vivo (El Salvador no tiene horario de verano). */
export const timeZone = 'America/El_Salvador';

const es = {
  contact: {
    label: 'contacto',
    // Título en dos partes: la segunda va resaltada.
    titleA: 'Si tiene que funcionar en producción,',
    titleB: 'hablemos.',
    lead: 'Backend, plataforma, infraestructura o producto con IA. Cuéntame qué estás construyendo y en qué punto está; te respondo con algo concreto.',

    // bloque principal
    emailLabel: 'correo directo',
    copy: 'Copiar correo',
    copied: 'Copiado',
    copiedLive: 'Correo copiado al portapapeles.',
    copyFallback: 'No pude copiarlo: el correo quedó seleccionado, cópialo con Ctrl+C o ⌘C.',
    mailto: 'Abrir en tu correo',

    // tarjetas
    linkedin: 'LinkedIn',
    linkedinHandle: 'in/marlonguerradev',
    linkedinNote: 'Trayectoria completa y recomendaciones',
    github: 'GitHub',
    githubHandle: 'marlon56115',
    githubNote: 'Código, proyectos y cómo trabajo',
    external: 'se abre en una pestaña nueva',

    // panel de estado
    statusTitle: 'estado',
    status: {
      open: 'Abierto a propuestas',
      limited: 'Agenda limitada',
      closed: 'Sin disponibilidad por ahora',
    },
    statusNote: 'Empleo a tiempo completo, contrato o consultoría.',
    localTime: 'hora local',
    location: 'Santa Ana, El Salvador',
    workHours: 'en horario laboral',
    offHours: 'fuera de horario',
    response: 'respuesta',
    responseValue: 'En menos de 24 h hábiles',
    mode: 'modalidad',
    modeValue: 'Remoto o híbrido',
    languages: 'idiomas',
    langList: [
      { name: 'Español', level: 'nativo', code: 'es' },
      { name: 'English', level: 'profesional', code: 'en' },
    ],
    refs: 'referencias',
    refsValue: 'Disponibles a solicitud',

    // borrador
    composeTitle: 'borrador.eml',
    composeLead: 'Escribe aquí y se abre tu app de correo con todo listo. Nada se envía desde esta página.',
    name: 'Tu nombre',
    namePh: 'Ana Pérez',
    topic: 'Tema',
    topics: ['Empleo', 'Proyecto', 'Consultoría', 'Otro'],
    message: 'Mensaje',
    messagePh: 'Qué necesitas, para cuándo y cualquier enlace útil.',
    send: 'Abrir en mi correo',
    errName: 'Escribe tu nombre.',
    errMessage: 'Cuéntame un poco más (al menos 10 caracteres).',
    chars: 'caracteres',
    opened: 'Abriendo tu app de correo…',

    // cierre
    eot: 'fin de la transmisión',
  },
};

type Contact = typeof es;

const en: Contact = {
  contact: {
    label: 'contact',
    titleA: 'If it has to work in production,',
    titleB: 'let’s talk.',
    lead: 'Backend, platform, infrastructure or AI-powered products. Tell me what you are building and where it stands; you’ll get a concrete answer back.',

    emailLabel: 'direct email',
    copy: 'Copy email',
    copied: 'Copied',
    copiedLive: 'Email copied to the clipboard.',
    copyFallback: 'Couldn’t copy it: the address is selected, copy it with Ctrl+C or ⌘C.',
    mailto: 'Open in your mail app',

    linkedin: 'LinkedIn',
    linkedinHandle: 'in/marlonguerradev',
    linkedinNote: 'Full track record and recommendations',
    github: 'GitHub',
    githubHandle: 'marlon56115',
    githubNote: 'Code, projects and how I work',
    external: 'opens in a new tab',

    statusTitle: 'status',
    status: {
      open: 'Open to proposals',
      limited: 'Limited availability',
      closed: 'Not available right now',
    },
    statusNote: 'Full-time roles, contracts or consulting.',
    localTime: 'local time',
    location: 'Santa Ana, El Salvador',
    workHours: 'within working hours',
    offHours: 'outside working hours',
    response: 'response',
    responseValue: 'Within 24 business hours',
    mode: 'work mode',
    modeValue: 'Remote or hybrid',
    languages: 'languages',
    langList: [
      { name: 'Español', level: 'native', code: 'es' },
      { name: 'English', level: 'professional', code: 'en' },
    ],
    refs: 'references',
    refsValue: 'Available on request',

    composeTitle: 'draft.eml',
    composeLead: 'Write it here and your mail app opens with everything filled in. Nothing is sent from this page.',
    name: 'Your name',
    namePh: 'Jane Doe',
    topic: 'Topic',
    topics: ['Job', 'Project', 'Consulting', 'Other'],
    message: 'Message',
    messagePh: 'What you need, by when, and any useful links.',
    send: 'Open in my mail app',
    errName: 'Please add your name.',
    errMessage: 'Tell me a bit more (at least 10 characters).',
    chars: 'characters',
    opened: 'Opening your mail app…',

    eot: 'end of transmission',
  },
};

export const contact = { es, en };
