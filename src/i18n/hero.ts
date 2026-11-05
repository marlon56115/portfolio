// Texto del hero. Dueño en la fase 2: pf-hero.
// Posicionamiento: full-stack de punta a punta (desarrollo, despliegue, infraestructura, datos) y fuerte en IA.
// Los años de experiencia NO van aquí: se calculan con src/lib/time.ts desde `careerStart`.

const es = {
  hero: {
    kicker: 'Lead Full-Stack Engineer · El Salvador',
    role: 'Ingeniero de Sistemas Informáticos',
    title: 'Lead Full-Stack Engineer',
    headline: 'Del código a producción, y todo lo que hay en medio.',
    lead:
      'Diseño, construyo y opero sistemas completos: backend, frontend, bases de datos, despliegues e infraestructura. En TELUS Digital lidero desarrollo sobre plataformas de telecomunicaciones a gran escala y llevo agentes de IA a flujos reales de soporte y operación.',
    // Cinco frentes que cubre. `k` es estable (clase/ícono); `t` y `d`, texto.
    capabilities: [
      { k: 'dev', t: 'Desarrollo', d: 'APIs y servicios en Java y Node.js, interfaces en Vue y React.' },
      { k: 'deploy', t: 'Despliegue', d: 'CI/CD, contenedores y GitOps; versiones que llegan sin sustos.' },
      { k: 'infra', t: 'Infraestructura', d: 'Kubernetes, Linux y nube (GCP, AWS), también autoalojado.' },
      { k: 'data', t: 'Bases de datos', d: 'PostgreSQL, Oracle, MySQL y MongoDB: modelado, SQL y rendimiento.' },
      { k: 'ai', t: 'IA aplicada', d: 'Agentes, integraciones con LLMs y automatización de flujos de trabajo.' },
    ],
    now: 'Ahora',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Desde',
    exp: 'Experiencia',
    years: 'años en producción',
    yearsShort: 'años',
    figure: 'fig. 01 — Santa Ana, SV',
    photoAlt: 'Retrato de Marlon Guerra',
    ctaPrimary: 'Escríbeme',
    ctaSecondary: 'Ver experiencia',
    terminalCta: 'Abrir terminal',
  },
};

type Hero = typeof es;

const en: Hero = {
  hero: {
    kicker: 'Lead Full-Stack Engineer · El Salvador',
    role: 'Computer Systems Engineer',
    title: 'Lead Full-Stack Engineer',
    headline: 'From code to production, and everything in between.',
    lead:
      'I design, build and run complete systems: backend, frontend, databases, deployments and infrastructure. At TELUS Digital I lead development on large-scale telecom platforms and bring AI agents into real support and operations workflows.',
    capabilities: [
      { k: 'dev', t: 'Development', d: 'APIs and services in Java and Node.js, interfaces in Vue and React.' },
      { k: 'deploy', t: 'Deployment', d: 'CI/CD, containers and GitOps; releases that land without surprises.' },
      { k: 'infra', t: 'Infrastructure', d: 'Kubernetes, Linux and cloud (GCP, AWS), self-hosted too.' },
      { k: 'data', t: 'Databases', d: 'PostgreSQL, Oracle, MySQL and MongoDB: modeling, SQL and performance.' },
      { k: 'ai', t: 'Applied AI', d: 'Agents, LLM integrations and workflow automation.' },
    ],
    now: 'Now',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Based in',
    exp: 'Experience',
    years: 'years in production',
    yearsShort: 'years',
    figure: 'fig. 01 — Santa Ana, SV',
    photoAlt: 'Portrait of Marlon Guerra',
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'See experience',
    terminalCta: 'Open terminal',
  },
};

export const hero = { es, en };
