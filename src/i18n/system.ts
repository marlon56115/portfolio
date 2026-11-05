// Texto de la sección "autoalojado".
// Privacidad (DESIGN.md §7): decir "infraestructura propia / autoalojado". Nada de host, hardware,
// versiones, namespaces, nombres de servicios internos, IP, puertos, reglas de red ni del túnel.
// Cada etapa explica *para qué* sirve, no *cómo* está protegida.

type Stage = { id: string; t: string; meta: string; d: string };

const es = {
  system: {
    label: 'autoalojado',
    title: 'Este sitio corre en mi infraestructura',
    lead: 'Un servidor en Go desplegado con GitOps sobre infraestructura propia, con métricas en vivo.',
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
      foot: 'se actualiza cada 15 s',
      noscript: 'Activa JavaScript para ver las cifras en vivo.',
    },
    path: {
      title: 'Camino de una petición',
      ping: 'tu última petición',
      stages: [
        { id: 'browser', t: 'Tu navegador', meta: 'HTTPS', d: 'Pide la página cifrada al borde, nunca directo al servidor.' },
        { id: 'edge', t: 'Borde', meta: 'TLS · caché', d: 'Termina TLS, cachea lo estático y frena el tráfico abusivo.' },
        { id: 'cluster', t: 'Clúster', meta: 'orquestación', d: 'Reinicia el servicio si falla y cambia de versión sin cortes.' },
        { id: 'service', t: 'Servicio', meta: 'Go', d: 'Un binario de Go con el sitio embebido, servido desde memoria.' },
      ] as Stage[],
    },
    ship: {
      title: 'Cómo sale una versión',
      stages: [
        { id: 'commit', t: 'Commit', meta: 'git', d: 'Código, configuración e infraestructura, versionados en Git.' },
        { id: 'ci', t: 'CI', meta: 'tests · escaneo', d: 'Pruebas, chequeo de tipos y escaneo de vulnerabilidades.' },
        { id: 'image', t: 'Imagen', meta: 'versión fija', d: 'Imagen mínima con SBOM y procedencia; bases fijadas por digest.' },
        { id: 'gitops', t: 'GitOps', meta: 'pull', d: 'El clúster lee el estado deseado de Git y lo aplica solo.' },
        { id: 'live', t: 'En vivo', meta: 'sin cortes', d: 'La versión nueva recibe tráfico al pasar sus chequeos de salud.' },
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
    title: 'This site runs on my own infrastructure',
    lead: 'A Go server shipped with GitOps onto self-hosted infrastructure, with live metrics.',
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
      foot: 'refreshes every 15 s',
      noscript: 'Enable JavaScript to see the live numbers.',
    },
    path: {
      title: 'Path of a request',
      ping: 'your last request',
      stages: [
        { id: 'browser', t: 'Your browser', meta: 'HTTPS', d: 'Requests the page, encrypted, from the edge, never the server.' },
        { id: 'edge', t: 'Edge', meta: 'TLS · cache', d: 'Terminates TLS, caches static assets and stops abusive traffic.' },
        { id: 'cluster', t: 'Cluster', meta: 'orchestration', d: 'Restarts the service if it fails and swaps versions with zero downtime.' },
        { id: 'service', t: 'Service', meta: 'Go', d: 'A Go binary with the site embedded, served from memory.' },
      ],
    },
    ship: {
      title: 'How a release ships',
      stages: [
        { id: 'commit', t: 'Commit', meta: 'git', d: 'Code, configuration and infrastructure, versioned in Git.' },
        { id: 'ci', t: 'CI', meta: 'tests · scan', d: 'Tests, type checks and a vulnerability scan.' },
        { id: 'image', t: 'Image', meta: 'pinned', d: 'Minimal image with SBOM and provenance; bases pinned by digest.' },
        { id: 'gitops', t: 'GitOps', meta: 'pull', d: 'The cluster reads the desired state from Git and applies it.' },
        { id: 'live', t: 'Live', meta: 'zero downtime', d: 'The new version gets traffic once its health checks pass.' },
      ],
    },
    toolbox: {
      title: 'Toolbox',
      items: ['Kubernetes', 'Docker', 'GitOps', 'IaC · OpenTofu · Ansible', 'Observability · Prometheus · Grafana', 'Go', 'CI/CD'],
    },
  },
};

export const system = { es, en };
