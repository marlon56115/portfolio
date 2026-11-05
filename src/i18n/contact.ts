// Sección de contacto. Dueño en la fase 2: pf-contact.

const es = {
  contact: {
    label: 'contacto',
    title: '¿Hablamos?',
    lead: 'Me interesan los problemas difíciles: backend, plataforma, infraestructura o producto con IA. Respondo en español o inglés.',
    email: 'Correo',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    copy: 'copiar',
    location: 'Santa Ana, El Salvador · UTC−6 · remoto o híbrido',
    refs: 'Referencias profesionales disponibles a solicitud.',
  },
};

type Contact = typeof es;

const en: Contact = {
  contact: {
    label: 'contact',
    title: 'Let’s talk',
    lead: 'I like hard problems: backend, platform, infrastructure or AI-powered products. Happy to talk in English or Spanish.',
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    copy: 'copy',
    location: 'Santa Ana, El Salvador · UTC−6 · remote or hybrid',
    refs: 'Professional references available on request.',
  },
};

export const contact = { es, en };
