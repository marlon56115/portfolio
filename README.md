# portfolio

Portafolio de Marlon Guerra, Lead DevOps Engineer: **https://marlon.mihomeserver.com**. Autoalojado en infraestructura propia.

- **Sitio:** Astro, 100 % estático, en español e inglés, con tema claro y oscuro, una terminal simulada (corre solo en el navegador, sin acceso al servidor) y un panel de métricas en vivo.
- **Servidor:** un binario de Go sin dependencias externas que embebe el sitio, añade las cabeceras de seguridad, elige el idioma de la primera visita y sirve `/api/status` (solo agregados).
- **Diseño:** sistema "Signal" documentado en [`DESIGN.md`](DESIGN.md) (tokens, tipografía, componentes, movimiento, accesibilidad).

## Desarrollo

```bash
nvm use          # Node 24
npm ci
npm run dev      # http://localhost:4321/es/ (sin el servidor Go el panel muestra "sin señal")
npm run build    # astro check + build; debe terminar con 0 errores
```

Con el servidor Go (es la única forma de ver la CSP real):

```bash
docker build -t portfolio:dev .
docker run --rm --read-only --cap-drop ALL -p 8080:8080 portfolio:dev
```

Pruebas del servidor (necesitan `server/public/`, que el Dockerfile rellena con el build):

```bash
cd server && mkdir -p public && touch public/404.html
gofmt -l . && go vet ./... && go test ./... && go run golang.org/x/vuln/cmd/govulncheck@v1.8.0 ./...
```

Imagen para redes sociales: `node scripts/og.mjs` regenera `public/og.png`.

## Reglas del proyecto

- **CSP estricta:** nada de `<script>` ni `<style>` inline, ni atributos `style=""`, ni `innerHTML`. Todo el DOM dinámico se construye con `createElement`/`textContent`. El CI lo comprueba sobre `dist/`.
- **Sin terceros:** fuentes autoalojadas, sin CDNs ni trackers. Dependencias con versión exacta.
- **Texto:** todo vive en `src/i18n/` (un archivo por sección). Los años de experiencia y las duraciones se calculan con `src/lib/time.ts`, nunca se escriben a mano.

## Publicar una versión

```bash
git tag v0.2.0 && git push origin v0.2.0
```

`release.yml` corre el CI y publica la imagen `ghcr.io/marlon56115/portfolio` con esa versión; el despliegue es GitOps.

## Estructura

```
src/i18n/       texto en los dos idiomas, un archivo por sección
src/lib/        utilidades compartidas (fechas, DOM, orden de secciones)
src/styles/     tokens, base, kit de componentes y efectos
src/scripts/    core/ (tema, nav, menú, aparición) · fx/ (fondo, cursor, scramble) · sections/, hero/, work/
                terminal.ts (shell simulada) · status.ts (cliente de /api/status)
src/components/ secciones de la página (y sus piezas en hero/, projects/, ui/)
scripts/        og.mjs (imagen OG) · hero-photo/ (recorte del retrato, herramienta aparte)
server/         servidor Go y sus tests
chart/          chart de Helm
public/         archivos estáticos (theme-init.js, favicon, og.png, security.txt)
```
