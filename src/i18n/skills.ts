// Stack, formación y certificaciones.
// Cada herramienta lleva los "frentes" del hero en los que la uso (dev, deploy, infra, data, ai).
// Skills.astro cruza estos nombres con el stack de cada puesto y proyecto para mostrar dónde se usó.
// `v` (lista de nombres por grupo) se mantiene porque la terminal lo lee.

export type Front = 'dev' | 'deploy' | 'infra' | 'data' | 'ai';
export interface Tool {
  n: string;
  f: Front[];
  alias?: string[]; // otros nombres con que aparece en el stack de un puesto o proyecto
}
interface Group {
  k: string;
  t: string;
  items: Tool[];
}

const D: Front[] = ['dev'];
const DB: Front[] = ['data'];
const AI: Front[] = ['ai'];
const OPS: Front[] = ['infra', 'deploy'];

// Herramientas independientes del idioma (las de IA se traducen abajo).
const languages: Tool[] = [
  { n: 'Java', f: D },
  { n: 'TypeScript', f: D },
  { n: 'JavaScript', f: D },
  { n: 'PHP', f: D },
  { n: 'Python', f: D },
  { n: 'C#', f: D },
  { n: 'SQL', f: ['dev', 'data'] },
  { n: 'Bash', f: OPS },
];
const backend: Tool[] = [
  { n: 'Spring Boot', f: D },
  { n: 'Node.js', f: D },
  { n: 'NestJS', f: D },
  { n: 'Express', f: D },
  { n: 'Laravel', f: D },
  { n: 'ASP.NET Core', f: D },
  { n: 'Jakarta EE', f: D },
];
const frontend: Tool[] = [
  { n: 'Vue.js', f: D },
  { n: 'React', f: D },
  { n: 'Next.js', f: D },
  { n: 'Angular', f: D },
  { n: 'Quasar', f: D },
  { n: 'Astro', f: D },
];
const data: Tool[] = [
  { n: 'PostgreSQL', f: DB },
  { n: 'Oracle · PL/SQL', f: ['data', 'dev'], alias: ['Oracle', 'PL/SQL'] },
  { n: 'MySQL', f: DB },
  { n: 'MariaDB', f: DB },
  { n: 'SQL Server', f: DB },
  { n: 'MongoDB', f: DB },
  { n: 'Firebase', f: DB },
  { n: 'Drizzle ORM', f: ['data', 'dev'], alias: ['Drizzle'] },
];
const infra: Tool[] = [
  { n: 'Kubernetes', f: OPS },
  { n: 'Docker', f: OPS },
  { n: 'Podman', f: OPS },
  { n: 'Linux · RHEL', f: ['infra'] },
  { n: 'Nginx', f: OPS },
  { n: 'WildFly · JBoss', f: OPS, alias: ['WildFly', 'JBoss'] },
  { n: 'Tomcat', f: OPS },
  { n: 'Prometheus', f: ['infra'] },
];
const delivery: Tool[] = [
  { n: 'GCP', f: OPS },
  { n: 'AWS', f: OPS },
  { n: 'CI/CD', f: ['deploy'] },
  { n: 'GitHub Actions', f: ['deploy'] },
  { n: 'GitLab CI', f: ['deploy'], alias: ['GitLab'] },
  { n: 'Azure DevOps', f: ['deploy'] },
  { n: 'GitOps', f: OPS },
  { n: 'OpenTofu', f: OPS },
  { n: 'Ansible', f: OPS },
];
const quality: Tool[] = [
  { n: 'Vitest', f: ['dev', 'deploy'] },
  { n: 'Playwright', f: ['dev', 'deploy'] },
  { n: 'axe · WCAG', f: D },
];

const withV = (groups: Group[]) => groups.map((g) => ({ ...g, v: g.items.map((i) => i.n) }));

const es = {
  skills: {
    label: 'stack',
    title: 'Cinco frentes, un mismo oficio',
    lead: 'Elige un frente: se encienden las herramientas que uso en él y dónde las he puesto en producción.',
    all: 'todo',
    filter: 'Filtrar herramientas por frente',
    tools: 'herramientas',
    usedIn: 'dónde lo usé',
    pick: 'Elige un frente para ver en qué puestos y proyectos lo he usado.',
    jobTag: 'trabajo',
    projectTag: 'proyecto',
    fronts: [
      { k: 'dev', t: 'Desarrollo', d: 'APIs, servicios e interfaces.' },
      { k: 'deploy', t: 'Despliegue', d: 'CI/CD, contenedores y GitOps.' },
      { k: 'infra', t: 'Infraestructura', d: 'Kubernetes, Linux y nube.' },
      { k: 'data', t: 'Bases de datos', d: 'Modelado, SQL y rendimiento.' },
      { k: 'ai', t: 'IA aplicada', d: 'Agentes, LLMs y automatización.' },
    ] as { k: Front; t: string; d: string }[],
    groups: withV([
      { k: 'languages', t: 'Lenguajes', items: languages },
      { k: 'backend', t: 'Backend', items: backend },
      { k: 'frontend', t: 'Frontend', items: frontend },
      { k: 'data', t: 'Datos', items: data },
      {
        k: 'ai',
        t: 'IA aplicada',
        items: [
          { n: 'Agentes de IA', f: ['ai', 'dev'] },
          { n: 'Integración de LLMs', f: ['ai', 'dev'] },
          { n: 'Automatización de flujos', f: ['ai', 'deploy'] },
          { n: 'IA multimodal', f: AI },
          { n: 'Google Gemini', f: AI, alias: ['Gemini'] },
          { n: 'Diseño de prompts', f: AI },
        ],
      },
      { k: 'infra', t: 'Infraestructura', items: infra },
      { k: 'cloud', t: 'Nube y entrega', items: delivery },
      { k: 'quality', t: 'Pruebas', items: quality },
    ]),
    eduTitle: 'Formación',
    edu: [
      { t: 'Ingeniería de Sistemas Informáticos', s: 'Universidad de El Salvador · 2023', n: 'Graduado con honores, primer lugar de la promoción.', honor: true },
      { t: 'Bachillerato Técnico en Infraestructura Tecnológica', s: 'CE INSA · 2017', n: 'Graduado con honores, primer lugar de la promoción.', honor: true },
      { t: 'Programa Jóvenes Talento en TI', s: 'Universidad Francisco Gavidia · 2017', n: '', honor: false },
      { t: 'Inglés, 20 niveles', s: 'Universidad de El Salvador · 2024', n: 'Nivel profesional.', honor: false },
    ],
    honor: '1.º de la promoción',
    certTitle: 'Certificaciones',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
};

type Skills = typeof es;

const en: Skills = {
  skills: {
    label: 'stack',
    title: 'Five fronts, one craft',
    lead: 'Pick a front: the tools I use for it light up, along with where I have run them in production.',
    all: 'all',
    filter: 'Filter tools by front',
    tools: 'tools',
    usedIn: 'where I used it',
    pick: 'Pick a front to see the roles and projects where I have used it.',
    jobTag: 'job',
    projectTag: 'project',
    fronts: [
      { k: 'dev', t: 'Development', d: 'APIs, services and interfaces.' },
      { k: 'deploy', t: 'Deployment', d: 'CI/CD, containers and GitOps.' },
      { k: 'infra', t: 'Infrastructure', d: 'Kubernetes, Linux and cloud.' },
      { k: 'data', t: 'Databases', d: 'Modeling, SQL and performance.' },
      { k: 'ai', t: 'Applied AI', d: 'Agents, LLMs and automation.' },
    ],
    groups: withV([
      { k: 'languages', t: 'Languages', items: languages },
      { k: 'backend', t: 'Backend', items: backend },
      { k: 'frontend', t: 'Frontend', items: frontend },
      { k: 'data', t: 'Data', items: data },
      {
        k: 'ai',
        t: 'Applied AI',
        items: [
          { n: 'AI agents', f: ['ai', 'dev'] },
          { n: 'LLM integrations', f: ['ai', 'dev'] },
          { n: 'Workflow automation', f: ['ai', 'deploy'] },
          { n: 'Multimodal AI', f: AI },
          { n: 'Google Gemini', f: AI, alias: ['Gemini'] },
          { n: 'Prompt design', f: AI },
        ],
      },
      { k: 'infra', t: 'Infrastructure', items: infra },
      { k: 'cloud', t: 'Cloud & delivery', items: delivery },
      { k: 'quality', t: 'Testing', items: quality },
    ]),
    eduTitle: 'Education',
    edu: [
      { t: 'B.Sc. Computer Systems Engineering', s: 'Universidad de El Salvador · 2023', n: 'Graduated with honors, top of the class.', honor: true },
      { t: 'Technical High School, IT Infrastructure', s: 'CE INSA · 2017', n: 'Graduated with honors, valedictorian.', honor: true },
      { t: 'Young Talent IT Program', s: 'Universidad Francisco Gavidia · 2017', n: '', honor: false },
      { t: 'English, 20 levels', s: 'Universidad de El Salvador · 2024', n: 'Professional proficiency.', honor: false },
    ],
    honor: 'top of class',
    certTitle: 'Certifications',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
};

export const skills = { es, en };
