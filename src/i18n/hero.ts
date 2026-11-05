// Texto del hero.
// Posicionamiento: ingeniero DevOps (CI/CD, contenedores, Kubernetes, infraestructura, observabilidad,
// IA aplicada a operación) que también desarrolla.
// Los años de experiencia NO van aquí: se calculan con src/lib/time.ts desde `careerStart`.

export interface Capability {
  k: 'dev' | 'deploy' | 'infra' | 'data' | 'ai'; // estable: canal, onda, comando `focus <k>`
  t: string; // título
  d: string; // qué hace, en una frase corta
  tools: string[]; // herramientas (cortas; se ven en el canal y en la terminal)
}

const es = {
  hero: {
    kicker: 'Lead DevOps Engineer · El Salvador',
    role: 'Ingeniero de Sistemas Informáticos',
    title: 'Lead DevOps Engineer',
    headline: 'Automatizo el camino del commit a producción.',
    lead:
      'CI/CD, Kubernetes, infraestructura como código y observabilidad, y también el código que despliego. En TELUS Digital lidero desarrollo en plataformas de telecomunicaciones y automatizo soporte con agentes de IA.',
    capabilitiesLabel: 'Cobertura',
    // Cinco frentes, en orden de peso. `k` es estable (canal/onda/comando); `t`, `d` y `tools`, texto.
    capabilities: [
      {
        k: 'deploy',
        t: 'Despliegue',
        d: 'Pipelines de CI/CD, contenedores y GitOps reproducibles.',
        tools: ['CI/CD', 'Docker', 'GitOps', 'Helm'],
      },
      {
        k: 'infra',
        t: 'Infraestructura',
        d: 'Kubernetes y Linux, en la nube o propios, con observabilidad.',
        tools: ['Kubernetes', 'Linux', 'OpenTofu', 'Prometheus', 'GCP', 'AWS'],
      },
      {
        k: 'ai',
        t: 'IA aplicada',
        d: 'Agentes de IA y LLMs que automatizan soporte y operación.',
        tools: ['agentes', 'LLMs', 'automatización'],
      },
      {
        k: 'data',
        t: 'Bases de datos',
        d: 'Modelado, SQL legible, respaldos y rendimiento.',
        tools: ['PostgreSQL', 'Oracle', 'MySQL', 'MongoDB'],
      },
      {
        k: 'dev',
        t: 'Desarrollo',
        d: 'APIs, servicios backend e interfaces.',
        tools: ['Java', 'Node.js', 'TypeScript', 'Vue', 'React'],
      },
    ] as Capability[],
    now: 'Ahora',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Desde',
    exp: 'Experiencia',
    years: 'años',
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
    kicker: 'Lead DevOps Engineer · El Salvador',
    role: 'Computer Systems Engineer',
    title: 'Lead DevOps Engineer',
    headline: 'I automate the path from commit to production.',
    lead:
      'CI/CD, Kubernetes, infrastructure as code and observability, plus the code I ship. At TELUS Digital I lead development on telecom platforms and automate support with AI agents.',
    capabilitiesLabel: 'Coverage',
    capabilities: [
      {
        k: 'deploy',
        t: 'Deployment',
        d: 'Reproducible CI/CD pipelines, containers and GitOps.',
        tools: ['CI/CD', 'Docker', 'GitOps', 'Helm'],
      },
      {
        k: 'infra',
        t: 'Infrastructure',
        d: 'Kubernetes and Linux, cloud or self-hosted, with observability.',
        tools: ['Kubernetes', 'Linux', 'OpenTofu', 'Prometheus', 'GCP', 'AWS'],
      },
      {
        k: 'ai',
        t: 'Applied AI',
        d: 'AI agents and LLMs that automate support and operations.',
        tools: ['agents', 'LLMs', 'automation'],
      },
      {
        k: 'data',
        t: 'Databases',
        d: 'Data modeling, readable SQL, backups and performance.',
        tools: ['PostgreSQL', 'Oracle', 'MySQL', 'MongoDB'],
      },
      {
        k: 'dev',
        t: 'Development',
        d: 'APIs, backend services and interfaces.',
        tools: ['Java', 'Node.js', 'TypeScript', 'Vue', 'React'],
      },
    ],
    now: 'Now',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Based in',
    exp: 'Experience',
    years: 'years',
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
