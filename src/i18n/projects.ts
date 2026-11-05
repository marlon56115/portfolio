// Proyectos propios. Dueño en la fase 2: pf-work.
// Privacidad: la plataforma propia se describe en general (IaC, GitOps, backups, observabilidad),
// sin hardware, nombres internos, reglas de red ni detalles de cómo se expone.

export interface Project {
  // Identificador interno estable (lo usa Projects.astro); no se muestra.
  slug: 'home-server' | 'money' | 'tickets';
  name: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  status: string;
  live?: string;
}

const es = {
  projects: {
    label: 'proyectos',
    title: 'Proyectos propios',
    lead: 'Software que uso, que otros usan y que yo mismo opero.',
    youAreHere: 'estás aquí',
    private: 'código privado',
    items: [
      {
        slug: 'home-server',
        name: 'Plataforma propia',
        kicker: 'Infraestructura como código',
        summary:
          'Infraestructura autoalojada definida por completo en Git. Si algo falla, se reconstruye desde cero ejecutando el repositorio: sistema, clúster, aplicaciones y respaldos.',
        points: [
          'Aprovisionamiento idempotente y despliegue continuo desde GitHub Actions.',
          'Kubernetes con GitOps: el estado deseado vive en Git y se aplica solo.',
          'Secretos cifrados en el repositorio y versiones fijadas en todo.',
          'PostgreSQL gestionado por operador, almacenamiento S3 y respaldos con restauración probada.',
          'Métricas, logs y alertas; cada decisión documentada en ADRs.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'PostgreSQL', 'Prometheus'],
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
          'Ingesta automática de correos bancarios con notificaciones push y webhooks firmados.',
          'Lectura de facturas y tickets con Google Gemini.',
          'Migrada de servicios gestionados a infraestructura propia, sin perder datos.',
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
    ] as Project[],
  },
};

type Projects = typeof es;

const en: Projects = {
  projects: {
    label: 'projects',
    title: 'Side projects',
    lead: 'Software I use, that others use, and that I run myself.',
    youAreHere: 'you are here',
    private: 'private source',
    items: [
      {
        slug: 'home-server',
        name: 'Own platform',
        kicker: 'Infrastructure as code',
        summary:
          'Self-hosted infrastructure defined entirely in Git. If something breaks, it is rebuilt from scratch by running the repository: system, cluster, apps and backups.',
        points: [
          'Idempotent provisioning and continuous delivery from GitHub Actions.',
          'Kubernetes with GitOps: the desired state lives in Git and applies itself.',
          'Secrets encrypted in the repository and every version pinned.',
          'Operator-managed PostgreSQL, S3 storage and backups with tested restores.',
          'Metrics, logs and alerting; every decision recorded as an ADR.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'PostgreSQL', 'Prometheus'],
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
          'Automatic bank-email ingestion through push notifications and signed webhooks.',
          'Invoice and receipt reading with Google Gemini.',
          'Moved off managed services onto self-hosted infrastructure without losing data.',
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
};

export const projects = { es, en };
