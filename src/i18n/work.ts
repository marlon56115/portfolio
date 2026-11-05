// Experiencia laboral. Dueño en la fase 2: pf-work.
// Las duraciones no se escriben a mano: se calculan desde `from`/`to` con src/lib/time.ts.

export interface Job {
  id: string; // hash corto estilo git, estable
  company: string;
  role: string;
  mode: string;
  from: string; // YYYY-MM
  to: string | null; // null = actual
  tag?: string;
  summary: string;
  points: string[];
  stack: string[];
}

const es = {
  work: {
    label: 'experiencia',
    title: 'Historial',
    lead: 'Cuatro empresas, una constante: sistemas que tienen que seguir funcionando.',
    present: 'hoy',
    show: 'ver detalle',
    hide: 'ocultar',
    duration: 'duración',
  },
  jobs: [
    {
      id: 'a3f9c12',
      company: 'TELUS Digital',
      role: 'Lead Applications Developer Analyst IIC',
      mode: 'Híbrido',
      from: '2025-10',
      to: null,
      tag: 'HEAD',
      summary: 'Liderazgo técnico y desarrollo full-stack sobre sistemas de telecomunicaciones a gran escala.',
      points: [
        'Mantengo, depuro y optimizo aplicaciones empresariales en Node.js, Java y servicios REST.',
        'Construyo agentes de IA y flujos automatizados que acortan la resolución de incidencias.',
        'Opero sobre GCP, Kubernetes y Linux con pipelines de CI/CD para despliegues estables.',
        'Integro plataformas legadas como NetCracker con servicios modernos en la nube.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'CI/CD', 'Agentes de IA'],
    },
    {
      id: '7be04d8',
      company: 'Gaspre',
      role: 'Backend Developer · Mid-Senior',
      mode: 'Remoto',
      from: '2025-04',
      to: '2025-10',
      summary: 'Plataforma que calcula precios óptimos de combustible en todo México.',
      points: [
        'Responsable de la disponibilidad del sistema y del rendimiento del backend.',
        'Nuevas funcionalidades con Node.js, Java, MongoDB, MariaDB y AWS.',
        'Convertí casos de soporte de clientes en desarrollos a medida, con QA y definición de procesos.',
      ],
      stack: ['Node.js', 'Java', 'MongoDB', 'MariaDB', 'AWS'],
    },
    {
      id: 'e51c2a0',
      company: 'Datum Redsoft',
      role: 'Systems Engineer · Development Specialist',
      mode: 'Presencial',
      from: '2024-11',
      to: '2025-05',
      summary: 'Aplicaciones para el Ministerio de Hacienda, bajo normativa fiscal.',
      points: [
        'Microservicios en Java Spring Boot sobre Oracle, con frentes en Vue.js, JSF y Struts.',
        'Optimicé servicios REST y automaticé procesos con PL/SQL: mejores tiempos de respuesta e integridad de datos.',
        'Entornos con Docker, Podman y Kubernetes; despliegues en JBoss, Tomcat y WildFly.',
        'Mejoras al pipeline de CI/CD de Java: builds más limpios y entregas más rápidas.',
      ],
      stack: ['Spring Boot', 'Oracle', 'PL/SQL', 'Vue.js', 'Kubernetes', 'WildFly'],
    },
    {
      id: '0c8d7f3',
      company: 'Make It Simple LLC',
      role: 'Software Engineer',
      mode: 'Remoto',
      from: '2022-04',
      to: '2024-11',
      tag: 'v1.0',
      summary: 'Sistemas financieros y SaaS para clientes en EE. UU.',
      points: [
        'Migré servicios legados de PHP a Spring Boot en contenedores: más escalables y mantenibles.',
        'App de suscripciones para gimnasios con cobro mensual automático: el trabajo manual pasó a cero.',
        'Docker Compose para los entornos de desarrollo: la puesta en marcha bajó más de 80 %.',
        'Despliegues full-stack en AWS Lightsail: Nginx/Apache, SSL, Node.js, MySQL y MongoDB.',
      ],
      stack: ['PHP', 'Spring Boot', 'MySQL', 'MongoDB', 'Docker', 'AWS'],
    },
  ] as Job[],
};

type Work = typeof es;

const en: Work = {
  work: {
    label: 'experience',
    title: 'History',
    lead: 'Four companies, one constant: systems that have to keep running.',
    present: 'now',
    show: 'show details',
    hide: 'hide',
    duration: 'duration',
  },
  jobs: [
    {
      id: 'a3f9c12',
      company: 'TELUS Digital',
      role: 'Lead Applications Developer Analyst IIC',
      mode: 'Hybrid',
      from: '2025-10',
      to: null,
      tag: 'HEAD',
      summary: 'Technical leadership and full-stack development on large-scale telecom systems.',
      points: [
        'Maintain, troubleshoot and optimize enterprise applications across Node.js, Java and REST services.',
        'Build AI agents and automated workflows that shorten incident resolution.',
        'Operate on GCP, Kubernetes and Linux with CI/CD pipelines for reliable deployments.',
        'Integrate legacy platforms such as NetCracker with modern cloud services.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'CI/CD', 'AI agents'],
    },
    {
      id: '7be04d8',
      company: 'Gaspre',
      role: 'Backend Developer · Mid-Senior',
      mode: 'Remote',
      from: '2025-04',
      to: '2025-10',
      summary: 'A platform that computes optimal fuel prices across Mexico.',
      points: [
        'Owned system uptime and backend performance.',
        'Shipped features with Node.js, Java, MongoDB, MariaDB and AWS.',
        'Turned client support cases into tailored developments, with QA and process definition.',
      ],
      stack: ['Node.js', 'Java', 'MongoDB', 'MariaDB', 'AWS'],
    },
    {
      id: 'e51c2a0',
      company: 'Datum Redsoft',
      role: 'Systems Engineer · Development Specialist',
      mode: 'On-site',
      from: '2024-11',
      to: '2025-05',
      summary: 'Applications for El Salvador’s Ministry of Finance, under fiscal regulation.',
      points: [
        'Java Spring Boot microservices on Oracle, with Vue.js, JSF and Struts frontends.',
        'Optimized REST services and automated processes with PL/SQL: faster responses, stronger data integrity.',
        'Environments on Docker, Podman and Kubernetes; deployments on JBoss, Tomcat and WildFly.',
        'Improved the Java CI/CD pipeline: cleaner builds, faster delivery.',
      ],
      stack: ['Spring Boot', 'Oracle', 'PL/SQL', 'Vue.js', 'Kubernetes', 'WildFly'],
    },
    {
      id: '0c8d7f3',
      company: 'Make It Simple LLC',
      role: 'Software Engineer',
      mode: 'Remote',
      from: '2022-04',
      to: '2024-11',
      tag: 'v1.0',
      summary: 'Financial systems and SaaS for US clients.',
      points: [
        'Moved legacy PHP services to containerized Spring Boot: more scalable and maintainable.',
        'Gym subscription app with automatic monthly billing: manual work went to zero.',
        'Docker Compose dev environments: onboarding time down by more than 80%.',
        'Full-stack deployments on AWS Lightsail: Nginx/Apache, SSL, Node.js, MySQL and MongoDB.',
      ],
      stack: ['PHP', 'Spring Boot', 'MySQL', 'MongoDB', 'Docker', 'AWS'],
    },
  ],
};

export const work = { es, en };
