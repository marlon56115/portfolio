// Genera public/og.png (1200x630) para las vistas previas en redes. Se ejecuta a mano: node scripts/og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0e1013"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="84" width="44" height="44" rx="4" fill="#e8e6e1"/>
  <text x="102" y="114" text-anchor="middle" font-family="Menlo, monospace" font-weight="700" font-size="20" fill="#0e1013">mg</text>
  <text x="142" y="113" font-family="Menlo, monospace" font-size="22" fill="#8c919b">marlon@homelab:~</text>
  <text x="80" y="300" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="104" fill="#e8e6e1" letter-spacing="-3">Marlon Guerra</text>
  <text x="84" y="370" font-family="Menlo, monospace" font-size="34" fill="#f08a4b">Lead Full-Stack Engineer</text>
  <text x="84" y="420" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="28" fill="#c3c1bb">Java · Node.js · Kubernetes · Cloud — El Salvador</text>
  <line x1="80" y1="500" x2="1120" y2="500" stroke="#252a31"/>
  <circle cx="90" cy="548" r="6" fill="#4ac26b"/>
  <text x="108" y="556" font-family="Menlo, monospace" font-size="22" fill="#8c919b">served from a k3s node in my house · marlon.mihomeserver.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('public/og.png');
