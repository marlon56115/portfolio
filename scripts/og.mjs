// Genera public/og.png (1200x630) para las vistas previas en redes, con la identidad "Signal".
// Se ejecuta a mano: node scripts/og.mjs
// Privacidad: sin hardware, host ni detalles de infraestructura; solo "self-hosted".
// Las fuentes del SVG son del sistema (librsvg no carga woff2); el carácter lo dan la rejilla y la traza.
import sharp from 'sharp';

const W = 1200;
const H = 630;
const cell = 30;

// Matriz de puntos con cruces de registro cada 8 celdas.
let dots = '';
for (let x = cell; x < W; x += cell) {
  for (let y = cell; y < H; y += cell) {
    const reg = x % (cell * 8) === 0 && y % (cell * 8) === 0;
    dots += reg
      ? `<path d="M${x - 5} ${y}h10M${x} ${y - 5}v10" stroke="#a8b6c3" stroke-opacity="0.35" stroke-width="1"/>`
      : `<rect x="${x}" y="${y}" width="2" height="2" fill="#a8b6c3" fill-opacity="0.18"/>`;
  }
}

// Traza de señal (onda) que cruza la parte baja.
let wave = `M0 ${H - 120}`;
for (let x = 0; x <= W; x += 6) {
  const env = Math.exp(-(((x - 760) / 260) ** 2));
  const y = H - 120 - Math.sin(x / 22) * 46 * env;
  wave += ` L${x} ${y.toFixed(1)}`;
}

const mono = "Menlo, 'SF Mono', 'DejaVu Sans Mono', monospace";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#070b11"/>
  ${dots}
  <path d="${wave}" fill="none" stroke="#38e1ff" stroke-width="2.5" stroke-opacity="0.9"/>
  <path d="M80 82h34l10 10v34H90l-10-10z" fill="#c8ff3d"/>
  <text x="102" y="116" text-anchor="middle" font-family="${mono}" font-weight="700" font-size="19" fill="#070b11">MG</text>
  <text x="140" y="114" font-family="${mono}" font-size="22" fill="#a8b6c3">marlon<tspan fill="#c8ff3d">.</tspan>guerra</text>
  <text x="76" y="290" font-family="${mono}" font-weight="700" font-size="92" fill="#e3eaf0" letter-spacing="-4">Marlon Guerra</text>
  <text x="80" y="352" font-family="${mono}" font-size="32" fill="#c8ff3d">Lead DevOps Engineer</text>
  <text x="80" y="404" font-family="${sans}" font-size="27" fill="#a8b6c3">CI/CD · Kubernetes · Infrastructure · Observability · AI</text>
  <rect x="80" y="${H - 64}" width="8" height="8" fill="#5be38a"/>
  <text x="100" y="${H - 55}" font-family="${mono}" font-size="20" fill="#7e8e9e">El Salvador · self-hosted</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('public/og.png');
