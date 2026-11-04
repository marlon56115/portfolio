// @ts-check
import { defineConfig } from 'astro/config';

// Sitio 100 % estático. El servidor Go (server/) lo embebe y añade cabeceras, CSP e idioma.
export default defineConfig({
  site: 'https://marlon.mihomeserver.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Nada inline: la CSP del servidor solo permite estilos y scripts de 'self'.
    inlineStylesheets: 'never',
    assets: '_astro',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  devToolbar: { enabled: false },
});
