// Proyectos propios. Dueño en la fase 2: pf-work.
// Privacidad: la plataforma propia se describe en general (todo como código, GitOps, respaldos,
// observabilidad, seguridad en capas), sin hardware, nombres internos, reglas de red ni cómo se expone.

export interface Project {
  // Identificador interno estable (anclas #project-<slug> y galerías); no se muestra.
  slug: 'platform' | 'money' | 'tickets';
  name: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  status: string;
  shots?: string[]; // pies de foto de la galería, en orden
}

const es = {
  projects: {
    label: 'proyectos',
    title: 'Proyectos propios',
    lead: 'Software que uso, que otros usan y que yo mismo opero de punta a punta.',
    youAreHere: 'estás aquí',
    private: 'código privado',
    demo: 'datos de demostración',
    gallery: 'Capturas de',
    prev: 'Captura anterior',
    next: 'Captura siguiente',
    open: 'Ampliar captura',
    of: 'de',
    close: 'Cerrar',
    mobile: 'versión móvil',
    swipe: 'desliza',
    stack: {
      title: 'reproducible desde git',
      run: 'Reconstruir',
      done: 'convergido · todo de vuelta desde el repositorio',
      layers: [
        ['repositorio', 'una sola fuente de verdad, revisada en pull requests'],
        ['aprovisionamiento', 'de máquina limpia a base lista, idempotente'],
        ['plataforma', 'GitOps: Git declara, el sistema converge solo'],
        ['aplicaciones', 'cada app declarada, con versiones fijadas'],
        ['datos', 'bases gestionadas y respaldos con restauración probada'],
        ['observabilidad', 'métricas, logs y alertas antes que los usuarios'],
        ['seguridad', 'en capas y con el mínimo privilegio'],
      ],
      facts: [
        ['100 %', 'como código'],
        ['1', 'comando para reconstruir'],
        ['30+', 'decisiones en ADRs'],
      ],
    },
    items: [
      {
        slug: 'platform',
        name: 'Plataforma propia',
        kicker: 'Infraestructura como código',
        summary:
          'Infraestructura autoalojada definida por completo en Git. Si algo falla, se reconstruye desde cero ejecutando el repositorio: base, plataforma, aplicaciones y datos.',
        points: [
          'Aprovisionamiento idempotente y entrega continua desde GitHub Actions.',
          'GitOps sobre Kubernetes: el estado deseado vive en Git y se aplica solo.',
          'Respaldos automáticos con restauraciones probadas, no supuestas.',
          'Observabilidad y alertas; seguridad en capas; cada decisión documentada en un ADR.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'GitHub Actions', 'PostgreSQL', 'Prometheus'],
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
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Google Gemini', 'Playwright'],
        status: 'en producción',
        shots: [
          'Panel ejecutivo: liquidez, gasto del mes y patrimonio',
          'Flujo de caja de 12 meses y gasto por categoría',
          'Historial de gastos y facturas DTE',
          'Versión móvil del panel',
        ],
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
        shots: [
          'Panel en vivo: cobrado, por cobrar y vales por estado',
          'Vales por líder con su avance',
          'Entrega en un toque, con deshacer',
          'Versión móvil',
        ],
      },
    ] as Project[],
  },
};

type Projects = typeof es;

const en: Projects = {
  projects: {
    label: 'projects',
    title: 'Side projects',
    lead: 'Software I use, that others use, and that I run end to end myself.',
    youAreHere: 'you are here',
    private: 'private source',
    demo: 'demo data',
    gallery: 'Screenshots of',
    prev: 'Previous screenshot',
    next: 'Next screenshot',
    open: 'Enlarge screenshot',
    of: 'of',
    close: 'Close',
    mobile: 'mobile view',
    swipe: 'swipe',
    stack: {
      title: 'reproducible from git',
      run: 'Rebuild',
      done: 'converged · everything back from the repository',
      layers: [
        ['repository', 'a single source of truth, reviewed in pull requests'],
        ['provisioning', 'clean machine to ready base, idempotent'],
        ['platform', 'GitOps: Git declares, the system converges'],
        ['apps', 'every app declared, every version pinned'],
        ['data', 'managed databases and backups with tested restores'],
        ['observability', 'metrics, logs and alerts before users notice'],
        ['security', 'layered, least privilege'],
      ],
      facts: [
        ['100%', 'as code'],
        ['1', 'command to rebuild'],
        ['30+', 'decisions in ADRs'],
      ],
    },
    items: [
      {
        slug: 'platform',
        name: 'Own platform',
        kicker: 'Infrastructure as code',
        summary:
          'Self-hosted infrastructure defined entirely in Git. If something breaks, it is rebuilt from scratch by running the repository: base, platform, apps and data.',
        points: [
          'Idempotent provisioning and continuous delivery from GitHub Actions.',
          'GitOps on Kubernetes: the desired state lives in Git and applies itself.',
          'Automatic backups with restores that are tested, not assumed.',
          'Observability and alerting; layered security; every decision recorded as an ADR.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'GitHub Actions', 'PostgreSQL', 'Prometheus'],
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
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Google Gemini', 'Playwright'],
        status: 'in production',
        shots: [
          'Executive dashboard: liquidity, monthly spend and net worth',
          '12-month cash flow and spend by category',
          'Expense history and DTE invoices',
          'Mobile dashboard',
        ],
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
        shots: [
          'Live dashboard: collected, outstanding and vouchers by state',
          'Vouchers per leader with progress',
          'One-tap hand-out, with undo',
          'Mobile view',
        ],
      },
    ],
  },
};

export const projects = { es, en };
