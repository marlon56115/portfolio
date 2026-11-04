// Todo el texto del sitio en los dos idiomas. Las claves son técnicas (inglés); el texto, de cada idioma.

export type Lang = 'es' | 'en';
export const langs: Lang[] = ['es', 'en'];

export interface Job {
  id: string; // hash corto estilo git, estable
  company: string;
  role: string;
  mode: string;
  from: string; // YYYY-MM
  to: string | null;
  tag?: string;
  summary: string;
  points: string[];
  stack: string[];
}

export interface Project {
  slug: 'home-server' | 'money' | 'tickets';
  name: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  status: string;
  live?: string;
}

const common = {
  name: 'Marlon Guerra',
  fullName: 'Marlon Wilfredo Guerra Ramírez',
  email: 'marlon56115@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marlonguerradev',
  github: 'https://github.com/marlon56115',
  location: 'Santa Ana, El Salvador',
};

const es = {
  ...common,
  htmlLang: 'es',
  meta: {
    title: 'Marlon Guerra · Ingeniero de Sistemas Informáticos',
    description:
      'Lead Full-Stack Engineer en El Salvador. Java, Node.js, Kubernetes y nube. Este sitio corre en un clúster k3s en mi casa.',
  },
  nav: { about: 'perfil', system: 'sistema', work: 'experiencia', projects: 'proyectos', skills: 'stack', contact: 'contacto' },
  ui: {
    theme: 'Cambiar tema',
    themeLight: 'claro',
    themeDark: 'oscuro',
    language: 'Idioma',
    openTerminal: 'Abrir terminal',
    terminalHint: 'pulsa',
    skip: 'Saltar al contenido',
    close: 'Cerrar',
    copied: 'copiado',
    copyEmail: 'Copiar correo',
  },
  hero: {
    role: 'Ingeniero de Sistemas Informáticos',
    title: 'Lead Full-Stack Engineer',
    lead:
      'Construyo y opero plataformas web en producción: backend en Java y Node.js, frontends en Vue y React, y la infraestructura que las sostiene. Me gusta entender el sistema completo, desde la consulta SQL hasta el pod que la ejecuta.',
    now: 'Ahora',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Desde',
    years: 'años en producción',
    figure: 'fig. 01 — Santa Ana, SV',
    ctaPrimary: 'Escríbeme',
    ctaSecondary: 'Ver cómo corre este sitio',
  },
  system: {
    label: 'sistema',
    title: 'Esta página se sirve desde mi casa',
    lead:
      'No es Vercel ni un bucket. Es un binario de Go dentro de un pod de k3s, en un Ryzen 5 bajo mi escritorio. Los datos de abajo vienen de su Prometheus, en vivo.',
    uptime: 'uptime del nodo',
    cpu: 'CPU',
    memory: 'memoria',
    pods: 'pods corriendo',
    namespaces: 'namespaces',
    temp: 'temp. CPU',
    network: 'red (entrada / salida)',
    disk: 'NVMe de datos',
    cpuHistory: 'CPU, última hora',
    source: 'fuente: Prometheus · agregados · se actualiza cada 15 s',
    offline: 'sin datos ahora mismo: el panel se oculta solo si Prometheus no responde',
    loading: 'consultando…',
    updated: 'actualizado',
    archTitle: 'Camino de una petición',
    archLead: 'Toca cada pieza para ver qué hace y por qué está ahí.',
    archHint: 'Selecciona un nodo del diagrama.',
    deployTitle: 'Cómo llega una versión nueva',
  },
  arch: {
    visitor: { t: 'Tu navegador', d: 'Pide marlon.mihomeserver.com. El DNS apunta a Cloudflare, no a mi casa: mi IP nunca se publica.' },
    edge: { t: 'Cloudflare', d: 'Termina TLS, cachea los assets con hash y filtra tráfico abusivo antes de que salga hacia el túnel.' },
    tunnel: { t: 'Cloudflare Tunnel', d: 'Conexión saliente desde el servidor. El router no tiene ningún puerto abierto hacia Internet.' },
    cloudflared: { t: 'cloudflared', d: 'Pod en k3s que mantiene el túnel. Entrega la petición directo al Service, sin pasar por el Ingress.' },
    pod: { t: 'portfolio', d: 'Un binario estático de Go con el sitio embebido. Usuario sin privilegios, sistema de archivos de solo lectura, imagen distroless.' },
    prometheus: { t: 'Prometheus', d: 'El pod solo puede hablar con Prometheus (NetworkPolicy). Pide agregados cada 15 s; tu visita nunca dispara una consulta.' },
    github: { t: 'GitHub', d: 'Un tag vX.Y.Z dispara CI: chequeos, build y escaneo de la imagen.' },
    ghcr: { t: 'ghcr.io', d: 'La imagen se publica con su versión. Nada de latest.' },
    flux: { t: 'Flux', d: 'GitOps: el clúster tira de Git. GitHub nunca tiene credenciales del clúster.' },
  },
  work: {
    label: 'experiencia',
    title: 'Historial',
    lead: 'Cuatro empresas, una constante: sistemas que tienen que seguir funcionando.',
    present: 'hoy',
    show: 'ver detalle',
    hide: 'ocultar',
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
      summary: 'Liderazgo técnico y soporte full-stack de sistemas de telecomunicaciones a gran escala.',
      points: [
        'Mantengo, depuro y optimizo aplicaciones empresariales en Node.js, Java y servicios REST.',
        'Opero sobre GCP, Kubernetes y Linux con pipelines de CI/CD para despliegues estables.',
        'Integro plataformas legadas como NetCracker con servicios modernos en la nube.',
        'Impulso automatización con agentes de IA y flujos inteligentes para resolver incidencias más rápido.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'Bash', 'CI/CD', 'AI agents'],
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
  ] satisfies Job[],
  projects: {
    label: 'proyectos',
    title: 'Proyectos propios',
    lead: 'Software que uso, que otros usan y que yo mismo opero.',
    youAreHere: 'estás aquí',
    private: 'código privado',
    items: [
      {
        slug: 'home-server',
        name: 'home-server',
        kicker: 'Infraestructura como código',
        summary:
          'Un servidor casero definido por completo en Git. Si el disco muere, se reconstruye ejecutando el repo: instalación del SO, clúster, apps y backups.',
        points: [
          'Ubuntu con autoinstall y Ansible idempotente; CD por GitHub Actions a través de Tailscale.',
          'k3s + Flux (GitOps), secretos cifrados con SOPS y age, versiones fijadas en todo.',
          'PostgreSQL con CloudNativePG, S3 con Garage y backups restic con restauración probada.',
          'Cero puertos abiertos: Cloudflare Tunnel hacia fuera, Tailscale para administrar.',
          'Prometheus, Loki, Grafana y alertas por Telegram. 34 ADR documentan cada decisión.',
        ],
        stack: ['k3s', 'Flux', 'OpenTofu', 'Ansible', 'SOPS', 'CNPG', 'Prometheus'],
        status: 'en producción · 24/7',
      },
      {
        slug: 'money',
        name: 'Gastos',
        kicker: 'Finanzas personales con IA',
        summary:
          'Gestor de gastos pensado para El Salvador: lee facturas electrónicas (DTE) por QR, procesa correos del banco y clasifica compras con IA multimodal.',
        points: [
          'Contabilidad de doble partida sobre un libro mayor inmutable.',
          'Ingesta automática de correos bancarios vía Gmail push y webhooks firmados.',
          'Lectura de facturas y tickets con Google Gemini.',
          'Migrada de Vercel y Neon a mi clúster: CloudNativePG, Garage S3 y NetworkPolicy.',
        ],
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Gemini', 'Playwright'],
        status: 'en producción',
      },
      {
        slug: 'tickets',
        name: 'Control de vales',
        kicker: 'Logística para un evento real',
        summary:
          'Controla 600 vales de almuerzo para la recaudación de un campamento juvenil: reparto por rangos, ventas, pagos por lote y entrega el día del evento.',
        points: [
          'Entrega en un toque: busca por número o nombre, cobra y entrega, con deshacer.',
          'Ciclo de vida de cada vale, pagos por lote y totales en vivo por líder.',
          'Roles validados en servidor, sesiones revocables y bitácora de auditoría completa.',
          '~60 archivos de pruebas con Vitest y E2E con Playwright, incluido WCAG 2.1 AA con axe.',
        ],
        stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Vitest', 'Playwright'],
        status: 'usada en un evento real',
      },
    ] satisfies Project[],
  },
  skills: {
    label: 'stack',
    title: 'Herramientas',
    lead: 'Lo que uso a diario, y lo que sé poner en producción.',
    groups: [
      { k: 'languages', t: 'Lenguajes', v: ['Java', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'C#', 'SQL', 'Bash'] },
      { k: 'backend', t: 'Backend', v: ['Spring Boot', 'Node.js', 'NestJS', 'Express', 'Laravel', 'ASP.NET Core', 'Jakarta EE'] },
      { k: 'frontend', t: 'Frontend', v: ['Vue.js', 'React', 'Next.js', 'Angular', 'Quasar', 'Astro'] },
      { k: 'data', t: 'Datos', v: ['PostgreSQL', 'Oracle · PL/SQL', 'MySQL', 'MariaDB', 'SQL Server', 'MongoDB', 'Firebase'] },
      { k: 'infra', t: 'Infraestructura', v: ['Kubernetes', 'k3s', 'Docker', 'Podman', 'Linux · RHEL', 'Nginx', 'WildFly', 'Tomcat'] },
      { k: 'cloud', t: 'Nube y entrega', v: ['GCP', 'AWS', 'Azure DevOps', 'Cloudflare', 'GitHub Actions', 'GitLab', 'Flux', 'OpenTofu', 'Ansible'] },
    ],
    eduTitle: 'Formación',
    edu: [
      { t: 'Ingeniería de Sistemas Informáticos', s: 'Universidad de El Salvador · 2023', n: 'Graduado con honores, primer lugar de la promoción.' },
      { t: 'Bachillerato Técnico en Infraestructura Tecnológica', s: 'CE INSA · 2017', n: 'Graduado con honores, primer lugar de la promoción.' },
      { t: 'Programa Jóvenes Talento en TI', s: 'Universidad Francisco Gavidia · 2017', n: '' },
      { t: 'Inglés, 20 niveles', s: 'Universidad de El Salvador · 2024', n: 'Nivel profesional.' },
    ],
    certTitle: 'Certificaciones',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
  contact: {
    label: 'contacto',
    title: '¿Hablamos?',
    lead: 'Busco problemas difíciles en backend, plataforma o arquitectura. Respondo en español o inglés.',
    email: 'Correo',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    refs: 'Referencias profesionales disponibles a solicitud.',
  },
  footer: {
    built: 'Hecho a mano con Astro y Go. Sin trackers, sin cookies de terceros.',
    served: 'servido desde',
    source: 'código fuente',
  },
  terminal: {
    title: 'terminal',
    welcome: 'Bienvenido. Escribe `help` para ver los comandos. `exit` o Esc para salir.',
    notFound: 'comando no encontrado',
    help: 'comandos disponibles',
  },
};

type Dict = typeof es;

const en: Dict = {
  ...common,
  htmlLang: 'en',
  meta: {
    title: 'Marlon Guerra · Computer Systems Engineer',
    description:
      'Lead Full-Stack Engineer based in El Salvador. Java, Node.js, Kubernetes and cloud. This site runs on a k3s cluster in my house.',
  },
  nav: { about: 'about', system: 'system', work: 'experience', projects: 'projects', skills: 'stack', contact: 'contact' },
  ui: {
    theme: 'Toggle theme',
    themeLight: 'light',
    themeDark: 'dark',
    language: 'Language',
    openTerminal: 'Open terminal',
    terminalHint: 'press',
    skip: 'Skip to content',
    close: 'Close',
    copied: 'copied',
    copyEmail: 'Copy email',
  },
  hero: {
    role: 'Computer Systems Engineer',
    title: 'Lead Full-Stack Engineer',
    lead:
      'I build and run production web platforms: Java and Node.js backends, Vue and React frontends, and the infrastructure underneath. I like understanding the whole system, from the SQL query to the pod that runs it.',
    now: 'Now',
    nowValue: 'Lead Applications Developer · TELUS Digital',
    based: 'Based in',
    years: 'years in production',
    figure: 'fig. 01 — Santa Ana, SV',
    ctaPrimary: 'Get in touch',
    ctaSecondary: 'See how this site runs',
  },
  system: {
    label: 'system',
    title: 'This page is served from my house',
    lead:
      'Not Vercel, not a bucket. A Go binary inside a k3s pod, on a Ryzen 5 under my desk. The numbers below come from its Prometheus, live.',
    uptime: 'node uptime',
    cpu: 'CPU',
    memory: 'memory',
    pods: 'running pods',
    namespaces: 'namespaces',
    temp: 'CPU temp',
    network: 'network (in / out)',
    disk: 'data NVMe',
    cpuHistory: 'CPU, last hour',
    source: 'source: Prometheus · aggregates only · refreshed every 15 s',
    offline: 'no data right now: the panel stays quiet if Prometheus is unreachable',
    loading: 'querying…',
    updated: 'updated',
    archTitle: 'Path of a request',
    archLead: 'Tap each piece to see what it does and why it is there.',
    archHint: 'Select a node in the diagram.',
    deployTitle: 'How a new version ships',
  },
  arch: {
    visitor: { t: 'Your browser', d: 'Asks for marlon.mihomeserver.com. DNS points at Cloudflare, not my house: my IP is never published.' },
    edge: { t: 'Cloudflare', d: 'Terminates TLS, caches hashed assets and filters abusive traffic before anything goes down the tunnel.' },
    tunnel: { t: 'Cloudflare Tunnel', d: 'An outbound connection from the server. The router has zero ports open to the Internet.' },
    cloudflared: { t: 'cloudflared', d: 'A k3s pod holding the tunnel. Hands the request straight to the Service, skipping the Ingress.' },
    pod: { t: 'portfolio', d: 'A static Go binary with the site embedded. Unprivileged user, read-only filesystem, distroless image.' },
    prometheus: { t: 'Prometheus', d: 'The pod can only talk to Prometheus (NetworkPolicy). It pulls aggregates every 15 s; your visit never triggers a query.' },
    github: { t: 'GitHub', d: 'A vX.Y.Z tag kicks off CI: checks, build and an image scan.' },
    ghcr: { t: 'ghcr.io', d: 'The image is published with its version. Never latest.' },
    flux: { t: 'Flux', d: 'GitOps: the cluster pulls from Git. GitHub never holds cluster credentials.' },
  },
  work: {
    label: 'experience',
    title: 'History',
    lead: 'Four companies, one constant: systems that have to keep running.',
    present: 'now',
    show: 'show details',
    hide: 'hide',
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
      summary: 'Technical leadership and full-stack support for large-scale telecom systems.',
      points: [
        'Maintain, troubleshoot and optimize enterprise applications across Node.js, Java and REST services.',
        'Operate on GCP, Kubernetes and Linux with CI/CD pipelines for reliable deployments.',
        'Integrate legacy platforms such as NetCracker with modern cloud services.',
        'Drive automation with AI agents and intelligent workflows to resolve incidents faster.',
      ],
      stack: ['Node.js', 'Java', 'GCP', 'Kubernetes', 'Bash', 'CI/CD', 'AI agents'],
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
  projects: {
    label: 'projects',
    title: 'Side projects',
    lead: 'Software I use, that others use, and that I run myself.',
    youAreHere: 'you are here',
    private: 'private source',
    items: [
      {
        slug: 'home-server',
        name: 'home-server',
        kicker: 'Infrastructure as code',
        summary:
          'A home server defined entirely in Git. If the disk dies, it is rebuilt by running the repo: OS install, cluster, apps and backups.',
        points: [
          'Ubuntu autoinstall plus idempotent Ansible; CD through GitHub Actions over Tailscale.',
          'k3s + Flux (GitOps), secrets encrypted with SOPS and age, every version pinned.',
          'PostgreSQL on CloudNativePG, S3 on Garage, restic backups with tested restores.',
          'Zero open ports: Cloudflare Tunnel outbound, Tailscale for admin.',
          'Prometheus, Loki, Grafana and Telegram alerts. 34 ADRs record every decision.',
        ],
        stack: ['k3s', 'Flux', 'OpenTofu', 'Ansible', 'SOPS', 'CNPG', 'Prometheus'],
        status: 'in production · 24/7',
      },
      {
        slug: 'money',
        name: 'Gastos',
        kicker: 'AI-assisted personal finance',
        summary:
          'An expense manager built for El Salvador: reads electronic invoices (DTE) from their QR code, parses bank emails and categorizes purchases with multimodal AI.',
        points: [
          'Double-entry accounting on an immutable ledger.',
          'Automatic bank-email ingestion through Gmail push and signed webhooks.',
          'Invoice and receipt reading with Google Gemini.',
          'Moved off Vercel and Neon onto my cluster: CloudNativePG, Garage S3 and NetworkPolicies.',
        ],
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Gemini', 'Playwright'],
        status: 'in production',
      },
      {
        slug: 'tickets',
        name: 'Voucher control',
        kicker: 'Logistics for a real event',
        summary:
          'Tracks 600 lunch vouchers for a youth-camp fundraiser: range assignment, sales, batch payments and hand-out on event day.',
        points: [
          'One-tap hand-out: search by number or name, charge and deliver, with undo.',
          'A lifecycle for every voucher, batch payments and live totals per leader.',
          'Server-enforced roles, revocable sessions and a full audit trail.',
          '~60 Vitest test files plus Playwright E2E, including WCAG 2.1 AA checks with axe.',
        ],
        stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Vitest', 'Playwright'],
        status: 'used at a real event',
      },
    ],
  },
  skills: {
    label: 'stack',
    title: 'Toolbox',
    lead: 'What I use every day, and what I know how to run in production.',
    groups: [
      { k: 'languages', t: 'Languages', v: ['Java', 'TypeScript', 'JavaScript', 'PHP', 'Python', 'C#', 'SQL', 'Bash'] },
      { k: 'backend', t: 'Backend', v: ['Spring Boot', 'Node.js', 'NestJS', 'Express', 'Laravel', 'ASP.NET Core', 'Jakarta EE'] },
      { k: 'frontend', t: 'Frontend', v: ['Vue.js', 'React', 'Next.js', 'Angular', 'Quasar', 'Astro'] },
      { k: 'data', t: 'Data', v: ['PostgreSQL', 'Oracle · PL/SQL', 'MySQL', 'MariaDB', 'SQL Server', 'MongoDB', 'Firebase'] },
      { k: 'infra', t: 'Infrastructure', v: ['Kubernetes', 'k3s', 'Docker', 'Podman', 'Linux · RHEL', 'Nginx', 'WildFly', 'Tomcat'] },
      { k: 'cloud', t: 'Cloud & delivery', v: ['GCP', 'AWS', 'Azure DevOps', 'Cloudflare', 'GitHub Actions', 'GitLab', 'Flux', 'OpenTofu', 'Ansible'] },
    ],
    eduTitle: 'Education',
    edu: [
      { t: 'B.Sc. Computer Systems Engineering', s: 'Universidad de El Salvador · 2023', n: 'Graduated with honors, top of the class.' },
      { t: 'Technical High School, IT Infrastructure', s: 'CE INSA · 2017', n: 'Graduated with honors, valedictorian.' },
      { t: 'Young Talent IT Program', s: 'Universidad Francisco Gavidia · 2017', n: '' },
      { t: 'English, 20 levels', s: 'Universidad de El Salvador · 2024', n: 'Professional proficiency.' },
    ],
    certTitle: 'Certifications',
    certs: ['MongoDB M121 · Aggregation Framework', 'MongoDB M001 · Basics'],
  },
  contact: {
    label: 'contact',
    title: 'Let’s talk',
    lead: 'I’m after hard problems in backend, platform or architecture. Happy to talk in English or Spanish.',
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    refs: 'Professional references available on request.',
  },
  footer: {
    built: 'Handmade with Astro and Go. No trackers, no third-party cookies.',
    served: 'served from',
    source: 'source code',
  },
  terminal: {
    title: 'terminal',
    welcome: 'Welcome. Type `help` to list commands. `exit` or Esc to leave.',
    notFound: 'command not found',
    help: 'available commands',
  },
};

export const dict: Record<Lang, Dict> = { es, en };
export type { Dict };
