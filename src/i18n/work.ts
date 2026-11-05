// Experiencia laboral.
// Las duraciones no se escriben a mano: se calculan desde `from`/`to` con src/lib/time.ts
// (al construir y de nuevo en el cliente, para que el puesto actual siga al día).

export interface Job {
  id: string; // identificador corto y estable (ancla #job-<id> y enlaces desde el stack)
  company: string;
  short: string; // nombre corto para la etiqueta del canal en la traza
  role: string;
  mode: string;
  from: string; // YYYY-MM
  to: string | null; // null = actual
  summary: string;
  points: string[];
  stack: string[];
}

const es = {
  work: {
    label: 'experiencia',
    title: 'Trayectoria',
    present: 'hoy',
    duration: 'duración',
    traceTitle: 'traza · carrera',
    channels: 'canales',
    yearsLabel: 'años de experiencia',
    live: 'en vivo',
    now: 'hoy',
    tabs: 'Puestos, del más reciente al primero',
    hint: 'elige un canal',
    modeLabel: 'modalidad',
    rangeLabel: 'periodo',
    stackLabel: 'stack',
    pointsLabel: 'qué hice',
    current: 'puesto actual',
  },
  jobs: [
    {
      id: 'telus',
      company: 'TELUS Digital',
      short: 'TELUS',
      role: 'Lead Applications Developer Analyst IIC',
      mode: 'Híbrido',
      from: '2025-10',
      to: null,
      summary: 'Liderazgo técnico, desarrollo y operación en plataformas de telecomunicaciones a gran escala.',
      points: [
        'Opero sobre GCP, Kubernetes y Linux con pipelines de CI/CD.',
        'Construyo agentes de IA y flujos automatizados que acortan la resolución de incidencias.',
        'Optimizo aplicaciones en Node.js y Java e integro NetCracker con servicios en la nube.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'CI/CD', 'Agentes de IA'],
    },
    {
      id: 'gaspre',
      company: 'Gaspre',
      short: 'Gaspre',
      role: 'Backend Developer · Mid-Senior',
      mode: 'Remoto',
      from: '2025-04',
      to: '2025-10',
      summary: 'Backend de una plataforma de precios de combustible para todo México.',
      points: [
        'Responsable de la disponibilidad y el rendimiento del backend.',
        'Funcionalidades nuevas con Node.js, Java, MongoDB y MariaDB sobre AWS.',
      ],
      stack: ['Node.js', 'Java', 'MongoDB', 'MariaDB', 'AWS'],
    },
    {
      id: 'datum',
      company: 'Datum Redsoft',
      short: 'Datum',
      role: 'Systems Engineer · Development Specialist',
      mode: 'Presencial',
      from: '2024-11',
      to: '2025-05',
      summary: 'Aplicaciones para el Ministerio de Hacienda de El Salvador.',
      points: [
        'Entornos con Docker, Podman y Kubernetes; despliegues en JBoss, Tomcat y WildFly.',
        'Mejoré el pipeline de CI/CD de Java y optimicé microservicios Spring Boot sobre Oracle.',
      ],
      stack: ['Spring Boot', 'Oracle', 'PL/SQL', 'Vue.js', 'Kubernetes', 'WildFly'],
    },
    {
      id: 'mis',
      company: 'Make It Simple LLC',
      short: 'Make It Simple',
      role: 'Software Engineer',
      mode: 'Remoto',
      from: '2022-04',
      to: '2024-11',
      summary: 'Sistemas financieros y SaaS para clientes en EE. UU.',
      points: [
        'Entornos con Docker Compose: la puesta en marcha bajó más de 80 %.',
        'Migré servicios PHP legados a Spring Boot en contenedores.',
      ],
      stack: ['PHP', 'Spring Boot', 'MySQL', 'MongoDB', 'Docker', 'AWS'],
    },
  ] as Job[],
};

type Work = typeof es;

const en: Work = {
  work: {
    label: 'experience',
    title: 'Track record',
    present: 'now',
    duration: 'duration',
    traceTitle: 'trace · career',
    channels: 'channels',
    yearsLabel: 'years of experience',
    live: 'live',
    now: 'now',
    tabs: 'Roles, most recent first',
    hint: 'pick a channel',
    modeLabel: 'setup',
    rangeLabel: 'period',
    stackLabel: 'stack',
    pointsLabel: 'what I did',
    current: 'current role',
  },
  jobs: [
    {
      id: 'telus',
      company: 'TELUS Digital',
      short: 'TELUS',
      role: 'Lead Applications Developer Analyst IIC',
      mode: 'Hybrid',
      from: '2025-10',
      to: null,
      summary: 'Technical leadership, development and operations on large-scale telecom platforms.',
      points: [
        'Operate on GCP, Kubernetes and Linux with CI/CD pipelines.',
        'Build AI agents and automated workflows that shorten incident resolution.',
        'Optimize Node.js and Java applications and integrate NetCracker with cloud services.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'CI/CD', 'AI agents'],
    },
    {
      id: 'gaspre',
      company: 'Gaspre',
      short: 'Gaspre',
      role: 'Backend Developer · Mid-Senior',
      mode: 'Remote',
      from: '2025-04',
      to: '2025-10',
      summary: 'Backend for a fuel-pricing platform covering all of Mexico.',
      points: [
        'Owned backend uptime and performance.',
        'Shipped features with Node.js, Java, MongoDB and MariaDB on AWS.',
      ],
      stack: ['Node.js', 'Java', 'MongoDB', 'MariaDB', 'AWS'],
    },
    {
      id: 'datum',
      company: 'Datum Redsoft',
      short: 'Datum',
      role: 'Systems Engineer · Development Specialist',
      mode: 'On-site',
      from: '2024-11',
      to: '2025-05',
      summary: 'Applications for El Salvador’s Ministry of Finance.',
      points: [
        'Environments on Docker, Podman and Kubernetes; deployments on JBoss, Tomcat and WildFly.',
        'Improved the Java CI/CD pipeline and optimized Spring Boot microservices on Oracle.',
      ],
      stack: ['Spring Boot', 'Oracle', 'PL/SQL', 'Vue.js', 'Kubernetes', 'WildFly'],
    },
    {
      id: 'mis',
      company: 'Make It Simple LLC',
      short: 'Make It Simple',
      role: 'Software Engineer',
      mode: 'Remote',
      from: '2022-04',
      to: '2024-11',
      summary: 'Financial systems and SaaS for US clients.',
      points: [
        'Docker Compose dev environments: onboarding time down by more than 80%.',
        'Moved legacy PHP services to containerized Spring Boot.',
      ],
      stack: ['PHP', 'Spring Boot', 'MySQL', 'MongoDB', 'Docker', 'AWS'],
    },
  ],
};

export const work = { es, en };
