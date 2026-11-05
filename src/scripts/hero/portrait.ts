// Retrato del hero: "bloqueo de señal" al cargar, sonda bajo el puntero y botón natural / señal.
// Respeta movimiento reducido (sin barrido ni sonda). Escribe solo variables CSS en un rAF.
import { $, finePointer, reducedMotion } from '../../lib/dom';

const LENS = 64; // radio de la sonda (px)

export function initPortrait(): void {
  const fig = $('[data-portrait]');
  const stage = fig && $('[data-portrait-stage]', fig);
  const img = fig && $<HTMLImageElement>('[data-portrait-img]', fig);
  const toggle = fig && $<HTMLButtonElement>('[data-portrait-toggle]', fig);
  if (!fig || !stage) return;

  // ---- bloqueo de señal: una vez, cuando la foto ya está decodificada ----
  if (!reducedMotion.matches) {
    const lock = () => {
      fig.classList.add('is-scanning');
      window.setTimeout(() => fig.classList.remove('is-scanning'), 2300);
    };
    const ready = img && !img.complete ? img.decode().catch(() => undefined) : Promise.resolve();
    void ready.then(() => requestAnimationFrame(lock));
  }

  // ---- alternar vista ----
  const setSignal = (on: boolean) => {
    fig.classList.toggle('is-signal', on);
    toggle?.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  toggle?.addEventListener('click', () => setSignal(!fig.classList.contains('is-signal')));
  // Táctil: tocar la foto alterna (no hay hover que la active).
  stage.addEventListener('click', () => {
    if (!finePointer.matches) setSignal(!fig.classList.contains('is-signal'));
  });

  // ---- sonda (solo ratón y con movimiento) ----
  if (!finePointer.matches || reducedMotion.matches) return;
  let raf = 0;
  let px = 0;
  let py = 0;
  let r = 0;
  let target = 0;
  const frame = () => {
    raf = 0;
    r += (target - r) * 0.25;
    if (Math.abs(target - r) < 0.5) r = target;
    fig.style.setProperty('--lx', `${px}px`);
    fig.style.setProperty('--ly', `${py}px`);
    fig.style.setProperty('--lr', `${r.toFixed(1)}px`);
    if (r !== target) raf = requestAnimationFrame(frame);
    else if (r === 0) fig.classList.remove('is-probing');
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  let box: DOMRect | null = null;
  stage.addEventListener('pointerenter', () => {
    box = stage.getBoundingClientRect();
    fig.classList.add('is-probing');
    target = LENS;
    kick();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!box) box = stage.getBoundingClientRect();
    px = e.clientX - box.left;
    py = e.clientY - box.top;
    kick();
  });
  stage.addEventListener('pointerleave', () => {
    box = null;
    target = 0;
    kick();
  });
  window.addEventListener('scroll', () => (box = null), { passive: true });
}
