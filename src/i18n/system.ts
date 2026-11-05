// Texto de la sección "autoalojado". Dueño: pf-system.
// Privacidad (DESIGN.md §7): decir "infraestructura propia / autoalojado". Nada de host, hardware,
// versiones, namespaces, nombres de servicios internos, IP, puertos, reglas de red ni del túnel.
// Cada etapa explica *para qué* sirve, no *cómo* está protegida.

type Stage = { id: string; t: string; meta: string; d: string };

const es = {
  system: {
    label: 'autoalojado',
    title: 'Este sitio corre en infraestructura que opero yo',
    lead:
      'Sin plataformas gestionadas: un servidor en Go que construyo, empaqueto y despliego con GitOps sobre infraestructura propia. El panel de abajo es en vivo.',
    live: {
      title: 'señal en vivo',
      connecting: 'conectando…',
      online: 'en línea',
      offline: 'sin señal · reintentando',
      updated: 'actualizado',
      uptime: 'tiempo activo',
      uptimeNote: 'del proceso actual',
      requests: 'páginas servidas',
      requestsNote: 'desde el último arranque',
      latency: 'tu latencia',
      latencyNote: 'ida y vuelta desde tu navegador',
      cpu: 'CPU',
      cpuNote: 'carga · última hora',
      memory: 'memoria',
      memoryNote: 'en uso',
      idle: 'en reposo',
      idleNote: 'métricas de carga en pausa',
      foot: 'solo agregados · se actualiza cada 15 s mientras lo ves',
      noscript: 'Activa JavaScript para ver las cifras en vivo.',
    },
    path: {
      title: 'Camino de una petición',
      lead: 'Pasa el cursor o toca cada etapa.',
      ping: 'tu última petición',
      stages: [
        { id: 'browser', t: 'Tu navegador', meta: 'HTTPS', d: 'Pide la página cifrada a la red de borde; nunca habla directo con el servidor.' },
        { id: 'edge', t: 'Borde', meta: 'TLS · caché', d: 'Termina TLS, sirve desde caché lo que no cambia y frena el tráfico abusivo antes de que entre.' },
        { id: 'cluster', t: 'Clúster', meta: 'orquestación', d: 'Mantiene el servicio vivo: lo reinicia si falla y cambia de versión sin cortar el tráfico.' },
        { id: 'service', t: 'Servicio', meta: 'Go', d: 'Un binario de Go con todo el sitio embebido: responde las páginas y este panel desde memoria.' },
      ] as Stage[],
    },
    ship: {
      title: 'Cómo sale una versión',
      lead: 'De un commit a producción sin pasos manuales.',
      stages: [
        { id: 'commit', t: 'Commit', meta: 'git', d: 'Todo empieza en Git: código, configuración e infraestructura viven versionados.' },
        { id: 'ci', t: 'CI', meta: 'tests · escaneo', d: 'Cada cambio pasa pruebas, chequeo de tipos y un escaneo de vulnerabilidades antes de poder publicarse.' },
        { id: 'image', t: 'Imagen', meta: 'versión fija', d: 'Una imagen mínima con versión exacta, SBOM y procedencia; las bases van fijadas por digest. Nunca "latest".' },
        { id: 'gitops', t: 'GitOps', meta: 'pull', d: 'La infraestructura lee el estado deseado desde Git y lo aplica por su cuenta; nadie despliega a mano.' },
        { id: 'live', t: 'En vivo', meta: 'sin cortes', d: 'La versión nueva recibe tráfico solo cuando pasa sus chequeos de salud; la anterior sale después.' },
      ] as Stage[],
    },
    toolbox: {
      title: 'Caja de herramientas',
      items: ['Kubernetes', 'Docker', 'GitOps', 'IaC · OpenTofu · Ansible', 'Observabilidad · Prometheus · Grafana', 'Go', 'CI/CD'],
    },
  },
};

type System = typeof es;

const en: System = {
  system: {
    label: 'self-hosted',
    title: 'This site runs on infrastructure I operate',
    lead:
      'No managed platform: a Go server I build, package and ship with GitOps onto self-hosted infrastructure. The panel below is live.',
    live: {
      title: 'live signal',
      connecting: 'connecting…',
      online: 'online',
      offline: 'no signal · retrying',
      updated: 'updated',
      uptime: 'uptime',
      uptimeNote: 'of the current process',
      requests: 'pages served',
      requestsNote: 'since the last restart',
      latency: 'your latency',
      latencyNote: 'round trip from your browser',
      cpu: 'CPU',
      cpuNote: 'load · last hour',
      memory: 'memory',
      memoryNote: 'in use',
      idle: 'idle',
      idleNote: 'load metrics paused',
      foot: 'aggregates only · refreshed every 15 s while you watch',
      noscript: 'Enable JavaScript to see the live numbers.',
    },
    path: {
      title: 'Path of a request',
      lead: 'Hover or tap each stage.',
      ping: 'your last request',
      stages: [
        { id: 'browser', t: 'Your browser', meta: 'HTTPS', d: 'Requests the page, encrypted, from the edge network; it never talks to the server directly.' },
        { id: 'edge', t: 'Edge', meta: 'TLS · cache', d: 'Terminates TLS, serves what does not change from cache and stops abusive traffic before it gets in.' },
        { id: 'cluster', t: 'Cluster', meta: 'orchestration', d: 'Keeps the service alive: restarts it if it fails and swaps versions without dropping traffic.' },
        { id: 'service', t: 'Service', meta: 'Go', d: 'A Go binary with the whole site embedded: it answers pages and this panel straight from memory.' },
      ],
    },
    ship: {
      title: 'How a release ships',
      lead: 'From a commit to production with no manual steps.',
      stages: [
        { id: 'commit', t: 'Commit', meta: 'git', d: 'Everything starts in Git: code, configuration and infrastructure are all versioned.' },
        { id: 'ci', t: 'CI', meta: 'tests · scan', d: 'Every change goes through tests, type checks and a vulnerability scan before it can be published.' },
        { id: 'image', t: 'Image', meta: 'pinned', d: 'A minimal image with an exact version, SBOM and provenance; base images are pinned by digest. Never "latest".' },
        { id: 'gitops', t: 'GitOps', meta: 'pull', d: 'The infrastructure reads the desired state from Git and applies it on its own; nobody deploys by hand.' },
        { id: 'live', t: 'Live', meta: 'zero downtime', d: 'The new version only gets traffic once it passes its health checks; the old one leaves afterwards.' },
      ],
    },
    toolbox: {
      title: 'Toolbox',
      items: ['Kubernetes', 'Docker', 'GitOps', 'IaC · OpenTofu · Ansible', 'Observability · Prometheus · Grafana', 'Go', 'CI/CD'],
    },
  },
};

export const system = { es, en };
