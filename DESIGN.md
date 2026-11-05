# DESIGN.md — sistema "Signal"

Fuente de verdad del diseño del portafolio: tokens, tipografía, kit de componentes, movimiento,
accesibilidad, privacidad, CSP y estructura del código. Si algo aquí choca con el código, gana este
documento y se corrige el código.

---

## 1. Concepto

**Signal: osciloscopio + placa de circuito.** Un sitio de ingeniero: preciso, técnico, con humor sutil.

- **Fondo:** una matriz de puntos (la rejilla de un osciloscopio) que reacciona al puntero y emite
  una onda al hacer clic. Cada 8 celdas, una cruz de registro.
- **Formas:** esquinas achaflanadas como conectores de PCB (`clip-path`), filetes de 1 px, pistas que
  terminan en un pad, LEDs de estado cuadrados, marcas de registro en las esquinas.
- **Color:** casi negro azulado con un acento eléctrico (*volt*, lima) y uno de datos (*ion*, cian).
  Un tercero (*flare*) solo para errores o "en caliente".
- **Tipo:** monoespaciada con eje de ancho para display (Martian Mono), sans limpia para leer (Geist),
  mono de código para datos y terminal (JetBrains Mono).

**Texto:** posicionamiento *Lead DevOps Engineer* (CI/CD, contenedores, Kubernetes, infraestructura,
observabilidad, IA aplicada a operación; también desarrolla). Frases cortas con cifras y hechos; sin
taglines de relleno, sin explicar cómo está hecha la página ni instrucciones de uso obvias, y sin
"en producción" como muletilla. Si un visitante no gana información con la frase, se quita.
Español e inglés siempre en paralelo (`src/i18n/*.ts`).

**Prohibido** (pedido del usuario: "se parece a la página de Claude Code"): fondos beige/crema, acentos
naranja/terracota, IBM Plex, degradados violeta-azul "de IA", blobs con glassmorphism, emoji, el look
genérico de landing SaaS.

---

## 2. Tokens

Todo en `src/styles/tokens.css`. Oscuro es el valor por defecto; claro se aplica si el sistema pide
claro (`prefers-color-scheme: light`) o si el visitante lo elige (`html[data-theme="light"]`).
La elección manual se guarda en `localStorage.theme`.

### 2.1 Color

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#070b11` | `#eef2f5` | fondo de página (va en `<html>`) |
| `--bg-2` | `#0a0f16` | `#e8edf1` | franja alterna / hundido |
| `--surface` | `#0c121a` | `#ffffff` | paneles |
| `--surface-2` | `#111a24` | `#f4f7f9` | panel elevado, hover |
| `--surface-3` | `#172230` | `#e3e9ee` | controles |
| `--line` | `#1c2834` | `#d3dbe2` | filetes |
| `--line-strong` | `#2b3a4a` | `#b3c0cb` | bordes de controles |
| `--ink` | `#e3eaf0` | `#0a1018` | texto principal |
| `--ink-2` | `#a8b6c3` | `#33414f` | texto secundario |
| `--muted` | `#7e8e9e` | `#56636f` | etiquetas, metadatos |
| `--volt` | `#c8ff3d` | `#c8ff3d` | acento **como relleno** |
| `--volt-ink` | `#c8ff3d` | `#3e6a00` | acento **como texto** |
| `--on-volt` | `#070b11` | `#0a1018` | texto sobre relleno volt |
| `--ion` | `#38e1ff` | `#0091b0` | datos y gráficos |
| `--ion-ink` | `#38e1ff` | `#00687f` | ion como texto / enlaces |
| `--flare` | `#ff5c7a` | `#c2183f` | tercer acento, raro |
| `--ok` / `--warn` / `--err` | `#5be38a` / `#ffc93d` / `#ff5c7a` | `#17773c` / `#8a5a00` / `#c2183f` | estados |
| `--focus` | `#38e1ff` | `#00687f` | anillo de foco |
| `--primary-bg` / `--primary-fg` | `#c8ff3d` / `#070b11` | `#0a1018` / `#c8ff3d` | botón primario |
| `--fx-dot` / `--fx-mark` / `--fx-hot` / `--fx-cool` | | | colores del canvas (los lee `fx/background.ts`) |
| `--term-bg` / `--term-ink` / `--term-dim` | `#05080c` / `#d6e0e8` / `#6b7b8b` | igual | la terminal es siempre oscura |

**Regla del lima:** en claro, el lima (`#c8ff3d`) **nunca** es texto ni superficie sobre fondo claro
(1.05:1). Se usa como texto sobre tinta (botón primario claro: tinta + texto lima) o como relleno con
texto oscuro encima. Para texto de acento usa siempre `--volt-ink`.

No hay alias heredados: `--accent*`, `--grid` y `--shadow` se retiraron. Usa `--volt*`, `--ion*` y
`--shadow-1/2`.

### 2.2 Contraste (WCAG 2.1, calculado con la fórmula de luminancia relativa)

Texto normal exige 4.5:1 (AA); gráficos y bordes que transmiten información, 3:1.

| Par | Oscuro: sobre `--bg` / `--surface` / `--surface-2` | Claro: sobre `--bg` / `--surface` / `--surface-3` |
|---|---|---|
| `--ink` | 16.24 / 15.48 / 14.45 | 16.96 / 19.09 / 15.59 |
| `--ink-2` | 9.53 / 9.08 / 8.47 | 9.28 / 10.45 / 8.54 |
| `--muted` | 5.87 / 5.60 / 5.22 (4.78 sobre `--surface-3`) | 5.47 / 6.16 / 5.03 (4.66 sobre `--surface-3`) |
| `--volt-ink` | 16.74 / 15.96 / 14.89 | 5.71 / 6.43 / 5.25 |
| `--ion-ink` | 12.57 / 11.98 / 11.18 | 5.68 / 6.39 / 5.22 |
| `--flare` / `--err` | 6.63 / 6.32 / 5.90 | 5.34 / 6.01 / 4.91 |
| `--ok` | 12.02 / 11.46 / 10.69 | 4.99 / 5.61 / 4.59 |
| `--warn` | 12.84 / 12.24 / 11.42 | 5.27 / 5.93 / 4.84 |

| Otros pares | Ratio |
|---|---|
| `--on-volt` sobre `--volt` (botón primario oscuro) | 16.74 |
| `--volt` sobre `--ink` (botón primario claro) | 16.20 |
| `--term-ink` / `--term-dim` sobre `--term-bg` | 14.99 / 4.62 |
| `--ion` (gráfico) sobre `--bg` claro | 3.29 (solo gráficos, no texto) |
| `--fx-hot` claro (`#4f8a00`) sobre `--bg` claro | 3.76 (solo gráficos) |
| `--line` / `--line-strong` | 1.3 / 1.7 — decorativos; ningún control depende solo del filete |

Todo texto cumple AA en ambos temas. Peor caso de texto: `--ok` sobre `--surface-3` claro, 4.59.

### 2.3 Tipografía

| Familia | Token | Rol | Archivo (latin, woff2) |
|---|---|---|---|
| Martian Mono (wght 100–800, wdth 75–112.5) | `--font-display` | títulos, navegación, etiquetas, botones | 38.5 KB |
| Geist (wght 100–900) | `--font-sans` | texto largo | 29.4 KB |
| JetBrains Mono (wght 100–800) | `--font-mono` | código, terminal, datos, chips | 40.4 KB |

Total **≈ 108 KB**. Paquetes `@fontsource-variable/*@5.3.0` (versión exacta, publicada el 2026-07-19).
Las `@font-face` están escritas a mano en `src/styles/fonts.css` (solo latin, `font-display: swap`) y
`Base.astro` precarga Martian Mono. **No importes los CSS de fontsource**: emiten todos los subconjuntos.

**Por qué Martian Mono:** su eje de ancho permite un display condensado (`font-stretch: 75%`) muy
distinto de las mono habituales, y la misma familia sirve para etiquetas a 87.5 %. Geist mantiene la
lectura cómoda en párrafos; JetBrains Mono es más estrecha y legible a 12–13 px para datos.

Escala fluida (360 → 1440 px):

| Token | Rango | Uso típico |
|---|---|---|
| `--step--2` | 11 → 12 px | etiquetas en mayúsculas, chips |
| `--step--1` | 12.5 → 14 px | nav, botones, metadatos |
| `--step-0` | 16 → 17 px | cuerpo |
| `--step-1` | 18 → 21 px | entradillas |
| `--step-2` | 21 → 27 px | subtítulos |
| `--step-3` | 26 → 38 px | títulos de tarjeta, menú móvil |
| `--step-4` | 32 → 56 px | títulos de sección |
| `--step-5` | 40 → 84 px | nombre en el hero |
| `--step-6` | 48 → 120 px | 404, cifras gigantes |

Convenciones:
- Títulos: `--font-display`, peso 500–600, `font-stretch: 87.5%` (el h1 del hero a 75 %),
  `letter-spacing: -0.03em` a `-0.05em`, `text-wrap: balance`.
- Etiquetas (`.label`): Martian Mono 87.5 %, mayúsculas, `--track-label` (0.08em), color `--muted`.
- Números: `font-variant-numeric: tabular-nums` (`.num`, `.tabular`, y todo `--font-mono`).
- Interlineado: `--lh-tight` 1.02, `--lh-heading` 1.15, `--lh-body` 1.6. Párrafos ≤ `--w-text` (64ch).

### 2.4 Espacio, forma, capas

- Espacio (base 4 px): `--space-3xs` 4 · `2xs` 8 · `xs` 12 · `s` 16 · `m` 24 · `l` 32 · `xl` 48 ·
  `2xl` 64 · `3xl` 96. Entre secciones: `--space-section` (64 → 128 px).
- Forma: `--radius` 2 px (casi recto), `--cut` 10 px / `--cut-s` 6 px (chaflán). Los polígonos
  `--chamfer*` se resuelven en `:root`; si una variante necesita otro tamaño, escribe el polígono con
  `var(--cut)` en su regla y cambia `--cut` localmente.
- Capas: `--z-bg` −1 (canvas), `--z-header` 40, `--z-menu` 45, `--z-cursor` 90, `--z-skip` 100.
- Celda de la rejilla: `--cell` 24 px (la usan el canvas y `.dot-grid`).

---

## 3. Maquetación

- **Mobile first.** Breakpoints de referencia: **360, 390** (teléfonos), **768** (tablet),
  **1024** (escritorio: aparece la nav en línea), **1440** (ancho máximo cómodo). En media queries usa
  `min-width: 768px`, `min-width: 1024px`; para "por debajo de" usa `max-width: 1023.98px`.
- Contenedor: `.wrap` → `max-width: var(--w)` (1200 px) + `--gutter` (16 → 40 px) a cada lado.
- Sección: `.section` (padding vertical `--space-section`). Entre secciones consecutivas se dibuja
  un filete con una marca más oscura al inicio.
- Cada sección define su propio grid (no hay rejilla global de columnas).
- **Nunca scroll horizontal.** En grids usa `minmax(0, 1fr)`, no `1fr`, si hay contenido con
  `white-space: pre/nowrap`. Verificado a 360, 375, 390, 414, 667×375, 844×390, 768, 1024, 1280, 1440
  y 1920 en es y en.
- **Espacios en Astro:** un salto de línea entre `</span>` y `{expresión}` se pierde al compilar
  ("© 2026Marlon"). Escribe `{' '}` al final de la línea cuando el espacio importa.
- Cabecera fija de `--header-h` (60 px); `scroll-padding-top` ya la compensa.

---

## 4. Kit de componentes

CSS en `src/styles/components.css`. Clases globales; cada sección las usa y añade lo suyo en su
`<style>` con scope.

| Componente | Marcado | Notas |
|---|---|---|
| Botón primario | `<a class="btn" href="…" data-magnetic>Texto <span class="arrow" aria-hidden="true">→</span></a>` | lima/tinta en oscuro; tinta/lima en claro. Mín. 44 px de alto |
| Botón fantasma | `class="btn btn--ghost"` | borde `--line-strong`, hover ion |
| Botón de ícono | `<button class="icon-btn" aria-label="…">svg</button>` | 40 × 40 (44 × 44 con puntero táctil), chaflán pequeño |
| Magnético | atributo `data-magnetic` en cualquier botón | se desplaza ≤ 6 px hacia el puntero (`--mx/--my`, propiedad `translate`) |
| Chip | `<ul class="chip-list"><li class="chip">Java</li></ul>` | mono, pad cuadrado a la izquierda; variantes `chip--volt`, `chip--ion` |
| Tag | `<span class="tag">nuevo</span>` | Martian Mono en mayúsculas |
| Panel / ventana | `<div class="panel"><div class="panel__bar"><span class="led"></span><span class="panel__title">…</span></div><div class="panel__body">…</div></div>` | esquina superior derecha achaflanada; `panel--raised` |
| Marcas de registro | `class="reg"` (o `reg reg--volt`) en cualquier caja | 4 esquinas en L sin marcado extra (usa `background-image`) |
| Cruz suelta | `<span class="xmark" aria-hidden="true"></span>` | |
| Cabecera de sección | `<SectionHead index={sectionIndex('work')} label=… title=… lead=… />` (`src/components/ui/SectionHead.astro`) | índice "01 / etiqueta" con pista, h2, entradilla |
| Etiqueta | `<p class="label">texto <b>dato</b></p>` · `.eyebrow` | |
| LED | `<span class="led"></span>` + `led--volt` / `led--ion` / `led--flare` / `is-off` / `is-pulse` | cuadrado con halo |
| Tecla | `<kbd>Esc</kbd>` | |
| Enlace | `class="link"` | subrayado que se traza al hover |
| Anillo de foco | automático (`:focus-visible`) | 2 px `--focus`, offset 3 px. Los chaflanes van en `::before/::after` para no recortarlo |

Reglas: no metas `clip-path` en el propio elemento enfocable (recorta el outline); usa pseudos.

---

## 5. Movimiento

Tokens: `--ease-out`, `--ease-in-out`, `--ease-snap`; `--dur-1` 120 ms (color/hover), `--dur-2`
220 ms (controles, menú), `--dur-3` 420 ms (paneles), `--dur-4` 720 ms (aparición).

| Efecto | Módulo | Dónde | Reglas |
|---|---|---|---|
| Campo de señal | `fx/background.ts` | `<canvas data-fx-bg>` en `Base.astro` | ver 5.1 |
| Mira del cursor | `fx/cursor.ts` | se crea sola en `<body>` | solo `(hover: hover) and (pointer: fine)`; nunca oculta el cursor nativo; se esconde sobre `input/textarea/select/[contenteditable]` y `[data-cursor="none"]`; se abre sobre `a, button, summary, [role=button], label[for], [data-cursor="target"]` |
| Scramble | `fx/scramble.ts` | `<span data-scramble>texto</span>` dentro de un `a`/`button` | 420 ms; se dispara con hover de ratón o foco por teclado; el texto accesible queda en `.visually-hidden` |
| Progreso | `core/nav.ts` | barra en el borde inferior de la cabecera | `transform: scaleX`, un listener de scroll en rAF |
| Aparición | `core/reveal.ts` | `data-reveal` (sube 14 px) o `data-reveal="fade"`; `data-reveal-stagger="70"` en un contenedor | una sola vez por elemento |
| Magnético | `fx/cursor.ts` | `data-magnetic` | ≤ 6 px |

### 5.1 Presupuestos del fondo

- Capa base pre-renderizada como patrón (un `fillRect` por cuadro); solo se dibujan a mano los
  puntos afectados por el puntero, las ondas o el barrido, dentro de su caja.
- El bucle `requestAnimationFrame` corre **solo** mientras algo se mueve; en reposo, cero trabajo.
- Pausa con la pestaña oculta. DPR limitado a 2. Redimensionado con debounce de 120 ms.
- Medido: un cuadro completo con brillo + 4 ondas a 1440 × 900 @2x ≈ **0.2 ms** de hilo principal.
- Barrido "osciloscopio" cada 11 s durante 2.6 s. Parallax: 12 % del scroll.
- Toque/clic en táctil: onda sí, brillo y mira no.

### 5.2 Movimiento reducido (`prefers-reduced-motion: reduce`)

Fondo estático (un cuadro, sin ondas, barrido ni parallax), sin mira ni magnético, sin scramble,
sin aparición (todo visible), transiciones a 0.01 ms, scroll sin suavizado. Cualquier efecto nuevo de
nuevo **debe** respetarlo (usa `reducedMotion` de `src/lib/dom.ts`). Hoy lo hacen todos: fondo,
mira, scramble, aparición, intro de la terminal (queda la transcripción del HTML), sonda del retrato,
cursor de la traza, galerías (desplazamiento instantáneo), capas de la plataforma (se encienden de
una vez), flujos de "autoalojado" y la onda al copiar el correo.

Presupuesto general: 60 fps; nada de animar `width/height/top/left` en bucles (usa `transform`,
`translate`, `opacity`, `clip-path`); nada de lecturas de layout dentro de bucles que también escriben.
Sin librerías de animación.

---

## 6. Interacción y accesibilidad

- **Skip link** (`.skip`) es el primer foco y salta a `#main`.
- **Menú móvil** (< 1024 px, `core/menu.ts`): botón con `aria-expanded` + `aria-controls="site-nav"`
  y etiqueta que cambia (abrir/cerrar); al abrir, el resto del `body` queda `inert`, el foco va al
  primer enlace y queda atrapado en la cabecera; Esc cierra y devuelve el foco al botón; elegir un
  enlace cierra; scroll del body bloqueado (`html.is-locked`). Sin JS: fila desplazable.
- Enlace activo de la nav: `aria-current="location"`.
- Objetivos táctiles ≥ 44 × 44 px con puntero táctil (cabecera, menú, chips de la terminal, galerías,
  formulario, pie). Con ratón, los botones de ícono quedan en 40 × 40. Entradas de texto a 16 px
  (iOS no hace zoom).
- Foco: anillo `--focus` en todo; la entrada de la terminal no dibuja el suyo, lo lleva la ventana
  (`.term:has(.term__in:focus-visible)`). Lightbox: foco al botón Cerrar, Tab atrapado, Esc cierra y
  el foco vuelve a la captura que se estaba viendo.
- Todo lo que depende de JS lleva `data-js-only` (se oculta sin JS). El contenido nunca depende de JS.
- Imágenes con `alt` real; decorativos con `aria-hidden="true"`.
- Idioma: `lang` en `<html>` y en fragmentos de otro idioma.
- Contraste: ver 2.2. No uses `--muted` por debajo de 11 px.

---

## 7. Privacidad (regla del usuario)

Nunca en el sitio, el README, la imagen OG ni los textos:
"homelab", el nombre del host, "mi casa / my house", hardware (CPU, RAM, discos, GPU), versiones de
SO / kernel / k3s, namespaces, nombres de servicios internos, IPs, reglas de red (NetworkPolicy) ni
detalles del túnel. Se dice **"autoalojado en infraestructura propia" / "self-hosted"** o "local".
Menos detalle de arquitectura: describir *qué* hace cada pieza, no *cómo* está protegida.

---

## 8. CSP (no negociable)

El servidor Go envía:
`default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; … require-trusted-types-for 'script'; trusted-types 'none'`.

- Nada de `<script>` inline (salvo `type="application/json"` para datos) ni `<style>` inline ni
  atributos `style=""` en el HTML. El CI hace grep de `dist/**/*.html` y falla.
- Nada de `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`: construye nodos con
  `createElement` + `textContent` (`el()` en `src/lib/dom.ts`). `el.style.x = …` y
  `style.setProperty` desde JS sí están permitidos.
- `astro.config.mjs` mantiene `inlineStylesheets: 'never'` y `assetsInlineLimit: 0`.
- Sin CDNs, fuentes externas ni trackers. Dependencias con versión exacta, `npm audit --omit=dev` limpio.
- La CSP solo se aplica con el servidor Go: verifica siempre en Docker
  (`docker build -t portfolio:dev . && docker run --rm -p 8090:8080 portfolio:dev`, abrir
  `http://localhost:8090/es/`) con la consola sin errores de CSP/Trusted Types.

---

## 9. Código

```
src/i18n/{common,hero,system,work,projects,skills,contact,terminal}.ts   texto (es + en), un archivo por sección
src/i18n/index.ts        dict[lang] (misma API de siempre) + tipos Lang, Job, Project, careerStart
src/lib/time.ts          fechas: yearsSince, monthsBetween, formatRange, formatDuration, jobDuration, hydrateSince
src/lib/dom.ts           $, $$, el(), pageLang(), reducedMotion, finePointer, safe()
src/lib/sections.ts      orden de secciones → nav e índices "01 / …"
src/styles/{fonts,tokens,base,components,fx}.css  (global.css solo importa)
src/scripts/main.ts      solo importa e inicia (cada init aislado con safe())
src/scripts/core/{theme,nav,menu,reveal}.ts
src/scripts/fx/{background,cursor,scramble}.ts
src/scripts/sections/{hero,system,work,projects,contact}.ts   un init*() por sección (main.ts los llama)
src/scripts/hero/{channels,portrait}.ts · src/scripts/work/{trace,skills,gallery,lightbox,stack}.ts
src/scripts/terminal.ts (shell simulada, solo en el navegador), status.ts (/api/status), notfound.ts
src/components/{Hero,Work,Projects,Skills,System,Contact}.astro + hero/, projects/, ui/SectionHead.astro
src/components/{Header,Footer,Home,Terminal}.astro, layouts/Base.astro
scripts/og.mjs (imagen OG) · scripts/hero-photo/ (recorte y semitonos del retrato; no es dependencia del sitio)
```

**Experiencia dinámica:** nunca escribas "4+ años". Al construir: `yearsSince(careerStart)`; en el HTML:
`<span data-since="2022-04">4</span>` (años) o
`<span data-since="2025-10" data-since-format="duration">1 mes</span>` (duración inclusiva hasta hoy;
`data-to` opcional). `hydrateSince()` los recalcula al cargar, así que el número sigue bien aunque no
se reconstruya el sitio. También actualiza `[data-year]`.

**Orden de la página:** hero → experiencia (01) → proyectos (02) → stack (03) → autoalojado (04) →
contacto (05). Para un recruiter la experiencia va primero; la sección técnica del sitio pasa al final.
El hero ya cubre los cinco frentes y trae la terminal, así que "autoalojado" funciona como prueba
técnica antes del cierre, no como introducción.

**`/api/status`** publica solo `ok`, `generatedAt`, `uptimeSeconds` (múltiplo de 60), `requestsServed`
y, si hay métricas frescas, `cpu`, `memory` (0–1) y `cpuHistory`. El cliente (`status.ts`) descarta
cualquier otro campo. Nada de SO, versiones, hardware, pods ni namespaces.

Convenciones: comentarios y docs en español; identificadores en inglés.

---

## Decisiones de la revisión final (QA)

- Orden de secciones: se mantiene experiencia antes de "autoalojado" (ver §9).
- Títulos de proyecto (`h3`) en `--step-3`, un paso por debajo del `h2` de sección, igual que el puesto
  en Experiencia. Entradilla de sección separada del título también en móvil.
- Sin "Cloudflare" en la caja de herramientas ni en el stack: no explicar cómo se expone el sitio.
- Galerías: todas las capturas en `loading="lazy"` (están muy por debajo del pliegue); solo el retrato
  del hero va `eager` + `fetchpriority="high"`.
- Copiar el correo: solo `navigator.clipboard`. Si no está disponible, el correo queda seleccionado
  y se pide Ctrl/⌘ C (sin `document.execCommand`, obsoleto).
- Se retiraron alias y clases del kit que nadie usaba (`--accent*`, `--grid`, `--shadow`, `.btn-ghost`,
  `.btn--sm`, `.dot-grid`, `.trace`, `.ext`, `.link--ion/volt`, `.grid-cols`, `.scramble__glyph`).

## Cómo verificar

- `npm run build` (0 errores, 0 avisos), `npm audit --omit=dev` limpio.
- Grep de CSP sobre `dist/**/*.html`: sin `<script>` inline (salvo JSON), sin `<style`, sin `style="`.
- Grep de privacidad:
  `grep -rniE 'homelab|ryzen|mi casa|my house|k3s|namespace|cloudflared|tunnel|túnel|NetworkPolicy|sops|garage|nvme|kernel|kps-|tailscale' src server chart public README.md`
  (solo deben salir comentarios que explican la regla y los tests del servidor que comprueban que no se filtra).
- Go: `gofmt -l`, `go vet`, `go test`, `govulncheck` (ver README).
- Docker con la CSP real: `/es/` y `/en/` sin errores en consola.
