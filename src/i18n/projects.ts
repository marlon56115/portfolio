// Proyectos propios.
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
      done: 'convergido · reconstruido desde git',
      layers: [
        ['repositorio', 'fuente única, revisada en pull requests'],
        ['aprovisionamiento', 'de máquina limpia a base lista'],
        ['plataforma', 'GitOps: Git declara, el clúster converge'],
        ['aplicaciones', 'cada app declarada, versiones fijadas'],
        ['datos', 'respaldos con restauración probada'],
        ['observabilidad', 'métricas, logs y alertas'],
        ['seguridad', 'en capas, mínimo privilegio'],
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
        summary: 'Infraestructura autoalojada definida en Git: se reconstruye desde cero con un comando.',
        points: [
          'GitOps sobre Kubernetes, con entrega continua desde GitHub Actions.',
          'Aprovisionamiento idempotente con OpenTofu y Ansible.',
          'Respaldos con restauración probada, métricas y alertas.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'GitHub Actions', 'PostgreSQL', 'Prometheus'],
        status: 'en producción · 24/7',
      },
      {
        slug: 'money',
        name: 'Gastos',
        kicker: 'Finanzas personales con IA',
        summary: 'Gastos personales: lee facturas DTE por QR y correos del banco, y clasifica compras con IA.',
        points: [
          'Doble partida sobre un libro mayor inmutable.',
          'Ingesta de correos bancarios con push y webhooks firmados; facturas leídas con Gemini.',
          'Migrada de servicios gestionados a infraestructura propia sin perder datos.',
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
        kicker: 'Ventas y entrega',
        summary: 'Control de 600 vales: asignación por rangos, ventas, pagos por lote y entrega.',
        points: [
          'Entrega en un toque: busca, cobra y entrega, con deshacer.',
          'Roles validados en servidor, sesiones revocables y bitácora de auditoría.',
          '~60 archivos de pruebas con Vitest y E2E con Playwright, incluido WCAG 2.1 AA.',
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
      done: 'converged · rebuilt from git',
      layers: [
        ['repository', 'single source of truth, reviewed in PRs'],
        ['provisioning', 'clean machine to ready base'],
        ['platform', 'GitOps: Git declares, the cluster converges'],
        ['apps', 'every app declared, versions pinned'],
        ['data', 'backups with tested restores'],
        ['observability', 'metrics, logs and alerts'],
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
        summary: 'Self-hosted infrastructure defined in Git: rebuilt from scratch with one command.',
        points: [
          'GitOps on Kubernetes, with continuous delivery from GitHub Actions.',
          'Idempotent provisioning with OpenTofu and Ansible.',
          'Backups with tested restores, metrics and alerting.',
        ],
        stack: ['Kubernetes', 'GitOps', 'OpenTofu', 'Ansible', 'GitHub Actions', 'PostgreSQL', 'Prometheus'],
        status: 'in production · 24/7',
      },
      {
        slug: 'money',
        name: 'Gastos',
        kicker: 'AI-assisted personal finance',
        summary: 'Personal expenses: reads DTE invoices by QR and bank emails, and categorizes purchases with AI.',
        points: [
          'Double-entry accounting on an immutable ledger.',
          'Bank-email ingestion via push and signed webhooks; invoices read with Gemini.',
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
        kicker: 'Sales and hand-out',
        summary: 'Control of 600 vouchers: range assignment, sales, batch payments and hand-out.',
        points: [
          'One-tap hand-out: search, charge and deliver, with undo.',
          'Server-enforced roles, revocable sessions and an audit trail.',
          '~60 Vitest test files plus Playwright E2E, including WCAG 2.1 AA.',
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
