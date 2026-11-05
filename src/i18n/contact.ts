// Sección de contacto.
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
    title: 'Hablemos.',
    lead: 'Plataforma, infraestructura, CI/CD o automatización con IA. Cuéntame qué necesitas.',

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
    linkedinNote: 'Trayectoria y recomendaciones',
    github: 'GitHub',
    githubHandle: 'marlon56115',
    githubNote: 'Código y proyectos',
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
    composeLead: 'Se abre tu app de correo con el mensaje listo.',
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
    title: 'Let’s talk.',
    lead: 'Platform, infrastructure, CI/CD or AI automation. Tell me what you need.',

    emailLabel: 'direct email',
    copy: 'Copy email',
    copied: 'Copied',
    copiedLive: 'Email copied to the clipboard.',
    copyFallback: 'Couldn’t copy it: the address is selected, copy it with Ctrl+C or ⌘C.',
    mailto: 'Open in your mail app',

    linkedin: 'LinkedIn',
    linkedinHandle: 'in/marlonguerradev',
    linkedinNote: 'Track record and recommendations',
    github: 'GitHub',
    githubHandle: 'marlon56115',
    githubNote: 'Code and projects',
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
    composeLead: 'Opens your mail app with the message ready.',
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
