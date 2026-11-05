// Texto de la sección "autoalojado". Dueño en la fase 2: pf-system.
// Privacidad: hablar de "infraestructura propia / autoalojado". Sin host, hardware, versiones,
// namespaces, nombres de servicios internos, IP, reglas de red ni detalles del túnel.
// Las claves de `arch` se mantienen porque System.astro las usa; el texto es deliberadamente general.

const es = {
  system: {
    label: 'autoalojado',
    title: 'Este sitio corre en infraestructura propia',
    lead:
      'Sin plataformas gestionadas: un servidor en Go, desplegado con GitOps en un clúster que diseñé y opero yo mismo. Las cifras de abajo son agregados en vivo.',
    uptime: 'tiempo activo',
    cpu: 'CPU',
    memory: 'memoria',
    pods: 'contenedores',
    namespaces: 'servicios',
    temp: 'temperatura',
    network: 'red (entrada / salida)',
    disk: 'almacenamiento',
    cpuHistory: 'CPU, última hora',
    source: 'métricas agregadas · se actualiza cada 15 s',
    offline: 'sin datos ahora mismo: el panel queda en reposo si las métricas no responden',
    loading: 'consultando…',
    updated: 'actualizado',
    archTitle: 'Camino de una petición',
    archLead: 'Toca cada pieza para ver qué hace.',
    archHint: 'Selecciona un nodo del diagrama.',
    deployTitle: 'Cómo llega una versión nueva',
  },
  arch: {
    visitor: { t: 'Tu navegador', d: 'Pide la página por HTTPS a una red de borde, nunca directo al servidor.' },
    edge: { t: 'Borde', d: 'Termina TLS, guarda en caché los archivos estáticos y frena el tráfico abusivo.' },
    tunnel: { t: 'Enlace cifrado', d: 'Une el borde con la infraestructura propia sin exponerla a Internet.' },
    cloudflared: { t: 'Conector', d: 'Recibe el tráfico del enlace y lo entrega a la aplicación.' },
    pod: { t: 'portfolio', d: 'Un binario de Go con el sitio embebido, en un contenedor mínimo y sin privilegios.' },
    prometheus: { t: 'Métricas', d: 'Un proceso aparte resume métricas cada 15 s: tu visita nunca dispara consultas.' },
    github: { t: 'GitHub', d: 'Un tag de versión dispara CI: pruebas, build y escaneo de la imagen.' },
    ghcr: { t: 'Registro', d: 'La imagen se publica con su versión exacta. Nunca "latest".' },
    flux: { t: 'GitOps', d: 'La infraestructura lee Git y aplica la versión nueva por su cuenta.' },
  },
};

type System = typeof es;

const en: System = {
  system: {
    label: 'self-hosted',
    title: 'This site runs on infrastructure I own',
    lead:
      'No managed platform: a Go server, deployed with GitOps onto a cluster I designed and run myself. The numbers below are live aggregates.',
    uptime: 'uptime',
    cpu: 'CPU',
    memory: 'memory',
    pods: 'containers',
    namespaces: 'services',
    temp: 'temperature',
    network: 'network (in / out)',
    disk: 'storage',
    cpuHistory: 'CPU, last hour',
    source: 'aggregated metrics · refreshed every 15 s',
    offline: 'no data right now: the panel stays idle if metrics are unreachable',
    loading: 'querying…',
    updated: 'updated',
    archTitle: 'Path of a request',
    archLead: 'Tap each piece to see what it does.',
    archHint: 'Select a node in the diagram.',
    deployTitle: 'How a new version ships',
  },
  arch: {
    visitor: { t: 'Your browser', d: 'Requests the page over HTTPS from an edge network, never straight from the server.' },
    edge: { t: 'Edge', d: 'Terminates TLS, caches static files and slows down abusive traffic.' },
    tunnel: { t: 'Encrypted link', d: 'Connects the edge to the self-hosted infrastructure without exposing it to the Internet.' },
    cloudflared: { t: 'Connector', d: 'Receives traffic from the link and hands it to the application.' },
    pod: { t: 'portfolio', d: 'A Go binary with the site embedded, in a minimal, unprivileged container.' },
    prometheus: { t: 'Metrics', d: 'A separate process summarizes metrics every 15 s: your visit never triggers a query.' },
    github: { t: 'GitHub', d: 'A version tag kicks off CI: tests, build and an image scan.' },
    ghcr: { t: 'Registry', d: 'The image is published with its exact version. Never "latest".' },
    flux: { t: 'GitOps', d: 'The infrastructure reads Git and applies the new version on its own.' },
  },
};

export const system = { es, en };
