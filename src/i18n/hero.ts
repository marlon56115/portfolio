// Texto del hero. Dueño en la fase 2: pf-hero.
// Posicionamiento: full-stack de punta a punta (desarrollo, despliegue, infraestructura, datos) y fuerte en IA.
// Los años de experiencia NO van aquí: se calculan con src/lib/time.ts desde `careerStart`.

export interface Capability {
  k: 'dev' | 'deploy' | 'infra' | 'data' | 'ai'; // estable: canal, onda, comando `focus <k>`
  t: string; // título
  d: string; // qué hace, en una frase
  tools: string[]; // herramientas (cortas; se ven en el canal y en la terminal)
}

const es = {
  hero: {
    kicker: 'Lead Full-Stack Engineer · El Salvador',
    role: 'Ingeniero de Sistemas Informáticos',
    title: 'Lead Full-Stack Engineer',
    headline: 'Del código a producción, sin pasarle el problema a nadie.',
    lead:
      'Escribo el código, lo despliego, opero la infraestructura y cuido los datos: el sistema entero, no una capa. En TELUS Digital lidero desarrollo sobre plataformas de telecomunicaciones a gran escala y pongo agentes de IA a trabajar en flujos reales de soporte y operación.',
    capabilitiesLabel: 'Cobertura',
    capabilitiesHint: 'cinco canales, una persona',
    // Cinco frentes que cubre. `k` es estable (canal/onda/comando); `t`, `d` y `tools`, texto.
    capabilities: [
      {
        k: 'dev',
        t: 'Desarrollo',
        d: 'APIs y servicios que aguantan carga real, e interfaces que se entienden sin manual.',
        tools: ['Java', 'Node.js', 'TypeScript', 'Vue', 'React'],
      },
      {
        k: 'deploy',
        t: 'Despliegue',
        d: 'CI/CD, contenedores y GitOps: cada versión sale igual que la anterior, sin sustos.',
        tools: ['CI/CD', 'Docker', 'GitOps', 'Helm'],
      },
      {
        k: 'infra',
        t: 'Infraestructura',
        d: 'Kubernetes y Linux en la nube o en infraestructura propia, con monitoreo desde el día uno.',
        tools: ['Kubernetes', 'Linux', 'GCP', 'AWS'],
      },
      {
        k: 'data',
        t: 'Bases de datos',
        d: 'Modelos claros, SQL legible y consultas que no tumban producción.',
        tools: ['PostgreSQL', 'Oracle', 'MySQL', 'MongoDB'],
      },
      {
        k: 'ai',
        t: 'IA aplicada',
        d: 'Agentes, integraciones con LLMs y flujos automatizados que corren en producción, no en una demo.',
        tools: ['agentes', 'LLMs', 'automatización'],
      },
    ] as Capability[],
    now: 'Ahora',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Desde',
    exp: 'Experiencia',
    years: 'años en producción',
    yearsShort: 'años',
    figure: 'fig. 01 — Santa Ana, SV',
    photoAlt: 'Retrato de Marlon Guerra sonriendo, con saco oscuro y camisa a cuadros',
    photoView: 'Vista del retrato',
    photoNatural: 'natural',
    photoSignal: 'señal',
    ctaPrimary: 'Escríbeme',
    ctaSecondary: 'Ver experiencia',
    terminalCta: 'o prueba la terminal',
  },
};

type Hero = typeof es;

const en: Hero = {
  hero: {
    kicker: 'Lead Full-Stack Engineer · El Salvador',
    role: 'Computer Systems Engineer',
    title: 'Lead Full-Stack Engineer',
    headline: 'From code to production, without passing the problem on.',
    lead:
      'I write the code, ship it, run the infrastructure and look after the data: the whole system, not one layer of it. At TELUS Digital I lead development on large-scale telecom platforms and put AI agents to work in real support and operations workflows.',
    capabilitiesLabel: 'Coverage',
    capabilitiesHint: 'five channels, one engineer',
    capabilities: [
      {
        k: 'dev',
        t: 'Development',
        d: 'APIs and services that hold up under real load, and interfaces people get without a manual.',
        tools: ['Java', 'Node.js', 'TypeScript', 'Vue', 'React'],
      },
      {
        k: 'deploy',
        t: 'Deployment',
        d: 'CI/CD, containers and GitOps: every release ships the same way as the last, no surprises.',
        tools: ['CI/CD', 'Docker', 'GitOps', 'Helm'],
      },
      {
        k: 'infra',
        t: 'Infrastructure',
        d: 'Kubernetes and Linux in the cloud or on my own infrastructure, with monitoring from day one.',
        tools: ['Kubernetes', 'Linux', 'GCP', 'AWS'],
      },
      {
        k: 'data',
        t: 'Databases',
        d: 'Clear models, readable SQL and queries that don’t take production down.',
        tools: ['PostgreSQL', 'Oracle', 'MySQL', 'MongoDB'],
      },
      {
        k: 'ai',
        t: 'Applied AI',
        d: 'Agents, LLM integrations and automated workflows that run in production, not in a demo.',
        tools: ['agents', 'LLMs', 'automation'],
      },
    ],
    now: 'Now',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Based in',
    exp: 'Experience',
    years: 'years in production',
    yearsShort: 'years',
    figure: 'fig. 01 — Santa Ana, SV',
    photoAlt: 'Portrait of Marlon Guerra smiling, wearing a dark blazer and a checked shirt',
    photoView: 'Portrait view',
    photoNatural: 'natural',
    photoSignal: 'signal',
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'See experience',
    terminalCta: 'or try the terminal',
  },
};

export const hero = { es, en };
