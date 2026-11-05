// Fondo de página: "campo de señal". Una matriz de puntos fija detrás del contenido que:
//  - se ilumina y se levanta cerca del puntero (solo puntero fino),
//  - emite una onda al hacer clic o tocar,
//  - cada tanto recibe un barrido tenue, como el trazo de un osciloscopio,
//  - se desplaza un poco más lento que la página (parallax leve).
//
// Presupuesto: la capa base es un patrón pre-renderizado (un fillRect por cuadro); solo se dibujan
// a mano los puntos "calientes". El bucle de animación corre únicamente mientras hay algo que
// animar y se detiene con la pestaña oculta. DPR limitado a 2. Con movimiento reducido: un cuadro
// estático, sin ondas, sin barrido y sin parallax.

import { $, finePointer, reducedMotion } from '../../lib/dom';

interface Ripple {
  x: number;
  y: number;
  t0: number;
}
interface Palette {
  dot: string;
  mark: string;
  hot: string;
  cool: string;
}

const CELL = 24; // = --cell en tokens.css
const TILE = 8; // marcas de registro cada 8 celdas
const GLOW_R = 150; // radio de influencia del puntero (px CSS)
const LIFT = 5; // desplazamiento máximo de un punto lejos del puntero
const RIPPLE_SPEED = 0.75; // px por ms
const RIPPLE_MAX = 620;
const RIPPLE_BAND = 46;
const SWEEP_EVERY = 11000; // ms entre barridos
const SWEEP_DUR = 2600;
const PARALLAX = 0.12;
const MAX_DPR = 2;

export function initBackground(): void {
  const canvas = $<HTMLCanvasElement>('[data-fx-bg]');
  const ctx = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !ctx) return;

  let dpr = 1;
  let w = 0;
  let h = 0;
  let pattern: CanvasPattern | null = null;
  let colors: Palette = { dot: '#a8b6c32e', mark: '#a8b6c347', hot: '#c8ff3d', cool: '#38e1ff' };
  let raf = 0;
  let still = reducedMotion.matches;

  // puntero: objetivo y valor suavizado; `glow` es la intensidad (0 al salir de la ventana)
  const ptr = { tx: -9999, ty: -9999, x: -9999, y: -9999, glow: 0, glowT: 0 };
  const ripples: Ripple[] = [];
  let sweepStart = -1;
  let nextSweep = performance.now() + 4000;
  let sweepTimer = 0;

  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    colors = {
      dot: v('--fx-dot', colors.dot),
      mark: v('--fx-mark', colors.mark),
      hot: v('--fx-hot', colors.hot),
      cool: v('--fx-cool', colors.cool),
    };
  };

  // Patrón de TILE×TILE celdas: puntos + una cruz de registro en la esquina.
  const buildPattern = () => {
    const size = Math.round(CELL * TILE * dpr);
    const tile = document.createElement('canvas');
    tile.width = size;
    tile.height = size;
    const t = tile.getContext('2d');
    if (!t) return;
    const s = CELL * dpr;
    const d = Math.max(1, Math.round(1.25 * dpr));
    t.fillStyle = colors.dot;
    for (let i = 0; i < TILE; i++) for (let j = 0; j < TILE; j++) t.fillRect(Math.round(i * s), Math.round(j * s), d, d);
    // cruz de registro
    const arm = Math.round(4 * dpr);
    const lw = Math.max(1, Math.round(dpr));
    t.fillStyle = colors.mark;
    t.clearRect(0, 0, d, d);
    t.fillRect(-arm, 0, arm * 2 + d, lw);
    t.fillRect(0, -arm, lw, arm * 2 + d);
    t.fillRect(size - arm, 0, arm, lw);
    t.fillRect(0, size - arm, lw, arm);
    pattern = ctx.createPattern(tile, 'repeat');
  };

  const resize = () => {
    dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    w = document.documentElement.clientWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    buildPattern();
    draw(performance.now());
  };

  const offsetY = () => (still ? 0 : -((window.scrollY * PARALLAX) % (CELL * TILE)));

  // ---------- dibujo ----------
  function draw(now: number): boolean {
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    if (!pattern) return false;
    const oy = offsetY();

    // capa base: el patrón ya está en píxeles de dispositivo, así que se pinta sin escalar
    const oyd = Math.round(oy * dpr);
    ctx!.setTransform(1, 0, 0, 1, 0, oyd);
    ctx!.fillStyle = pattern;
    ctx!.fillRect(0, -oyd, canvas!.width, canvas!.height);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (still) return false;
    let busy = false;

    // puntero suavizado
    ptr.x += (ptr.tx - ptr.x) * 0.22;
    ptr.y += (ptr.ty - ptr.y) * 0.22;
    ptr.glow += (ptr.glowT - ptr.glow) * 0.12;
    if (Math.abs(ptr.tx - ptr.x) > 0.3 || Math.abs(ptr.ty - ptr.y) > 0.3 || Math.abs(ptr.glowT - ptr.glow) > 0.01) busy = true;

    // ondas vivas
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      if (r && (now - r.t0) * RIPPLE_SPEED > RIPPLE_MAX + RIPPLE_BAND) ripples.splice(i, 1);
    }
    if (ripples.length) busy = true;

    // barrido
    let sweepX = -1;
    if (sweepStart >= 0) {
      const p = (now - sweepStart) / SWEEP_DUR;
      if (p >= 1) sweepStart = -1;
      else {
        sweepX = easeInOut(p) * (w + 160) - 80;
        busy = true;
      }
    }

    const hasGlow = ptr.glow > 0.01;
    if (!hasGlow && !ripples.length && sweepX < 0) return busy;

    // Recorre solo las celdas dentro de la caja que puede verse afectada.
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const grow = (ax: number, ay: number, bx: number, by: number) => {
      x0 = Math.min(x0, ax);
      y0 = Math.min(y0, ay);
      x1 = Math.max(x1, bx);
      y1 = Math.max(y1, by);
    };
    if (hasGlow) grow(ptr.x - GLOW_R, ptr.y - GLOW_R, ptr.x + GLOW_R, ptr.y + GLOW_R);
    for (const r of ripples) {
      const rad = (now - r.t0) * RIPPLE_SPEED + RIPPLE_BAND;
      grow(r.x - rad, r.y - rad, r.x + rad, r.y + rad);
    }
    if (sweepX >= 0) grow(sweepX - 60, 0, sweepX + 60, h);

    const iMin = Math.max(0, Math.floor(x0 / CELL));
    const iMax = Math.min(Math.ceil(w / CELL), Math.ceil(x1 / CELL));
    const jMin = Math.max(-1, Math.floor((y0 - oy) / CELL));
    const jMax = Math.min(Math.ceil((h - oy) / CELL) + 1, Math.ceil((y1 - oy) / CELL));

    for (let i = iMin; i <= iMax; i++) {
      const gx = i * CELL;
      for (let j = jMin; j <= jMax; j++) {
        const gy = j * CELL + oy;
        let hot = 0;
        let cool = 0;
        let dx = 0;
        let dy = 0;

        if (hasGlow) {
          const ex = gx - ptr.x;
          const ey = gy - ptr.y;
          const d = Math.hypot(ex, ey);
          if (d < GLOW_R) {
            const k = 1 - d / GLOW_R;
            const e = k * k * ptr.glow;
            hot = e;
            if (d > 0.001) {
              dx = (ex / d) * e * LIFT;
              dy = (ey / d) * e * LIFT;
            }
          }
        }
        for (const r of ripples) {
          const rad = (now - r.t0) * RIPPLE_SPEED;
          const d = Math.hypot(gx - r.x, gy - r.y);
          const band = 1 - Math.abs(d - rad) / RIPPLE_BAND;
          if (band > 0) cool = Math.max(cool, band * (1 - rad / RIPPLE_MAX));
        }
        if (sweepX >= 0) {
          const band = 1 - Math.abs(gx - sweepX) / 60;
          if (band > 0) cool = Math.max(cool, band * 0.35);
        }

        const a = Math.max(hot, cool);
        if (a < 0.04) continue;
        const size = 1.25 + a * 2.2;
        ctx!.globalAlpha = Math.min(1, 0.25 + a * 0.85);
        ctx!.fillStyle = hot >= cool ? colors.hot : colors.cool;
        ctx!.fillRect(gx + dx - size / 2 + 0.6, gy + dy - size / 2 + 0.6, size, size);
      }
    }

    // anillo tenue de cada onda
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = colors.cool;
    for (const r of ripples) {
      const rad = (now - r.t0) * RIPPLE_SPEED;
      const fade = 1 - rad / RIPPLE_MAX;
      if (fade <= 0) continue;
      ctx!.globalAlpha = fade * 0.22;
      ctx!.beginPath();
      ctx!.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx!.stroke();
    }
    ctx!.globalAlpha = 1;
    return busy;
  }

  // ---------- bucle ----------
  const loop = (now: number) => {
    raf = 0;
    if (document.hidden) return;
    if (draw(now)) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf && !document.hidden) raf = requestAnimationFrame(loop);
  };

  const scheduleSweep = () => {
    window.clearTimeout(sweepTimer);
    if (still) return;
    sweepTimer = window.setTimeout(() => {
      if (!document.hidden) {
        sweepStart = performance.now();
        kick();
      }
      nextSweep = performance.now() + SWEEP_EVERY;
      scheduleSweep();
    }, Math.max(0, nextSweep - performance.now()));
  };

  // ---------- eventos ----------
  window.addEventListener(
    'pointermove',
    (e) => {
      if (still || e.pointerType !== 'mouse' || !finePointer.matches) return;
      ptr.tx = e.clientX;
      ptr.ty = e.clientY;
      if (ptr.glowT === 0) {
        // entra desde fuera: arranca en la posición, sin barrer desde lejos
        ptr.x = ptr.tx;
        ptr.y = ptr.ty;
      }
      ptr.glowT = 1;
      kick();
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    ptr.glowT = 0;
    kick();
  });
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (still) return;
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      if (ripples.length > 6) ripples.shift();
      kick();
    },
    { passive: true },
  );
  window.addEventListener('scroll', () => !still && kick(), { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      draw(performance.now());
      kick();
    }
  });
  const recolor = () => {
    readColors();
    buildPattern();
    draw(performance.now());
  };
  document.documentElement.addEventListener('themechange', recolor);
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', recolor);
  reducedMotion.addEventListener('change', () => {
    still = reducedMotion.matches;
    ripples.length = 0;
    ptr.glowT = 0;
    ptr.glow = 0;
    scheduleSweep();
    draw(performance.now());
  });

  readColors();
  resize();
  scheduleSweep();
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
