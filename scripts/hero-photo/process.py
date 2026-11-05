# Retrato del hero: recorte + semitonos. Uso (desde la raíz del repo, macOS):
#   swift scripts/hero-photo/person-mask.swift src/assets/marlon.jpg /tmp/mask.png
#   python3 scripts/hero-photo/process.py /tmp src/assets/hero
# Necesita Pillow y numpy (no son dependencias del sitio). Sale:
#   marlon-cutout.webp       recorte en color natural (bordes descontaminados del gris de estudio)
#   marlon-dots-bright.webp  máscara alfa de semitono a 45°: puntos ∝ luz (tema oscuro)
#   marlon-dots-dark.webp    igual, puntos ∝ sombra (tema claro)
import sys
import numpy as np
from PIL import Image, ImageFilter
S, out = sys.argv[1], sys.argv[2]  # S: carpeta con mask.png
src = Image.open("src/assets/marlon.jpg").convert("RGB")
I = np.asarray(src).astype(np.float32) / 255
a = np.asarray(Image.open(f"{S}/mask.png").convert("L")).astype(np.float32) / 255
# Endurece un poco el borde (menos halo gris) sin perder el pelo fino.
a = np.clip((a - 0.04) / 0.92, 0, 1) ** 1.15
# Fondo local estimado: desenfoque ponderado por (1 - a) → color del gris de estudio detrás del borde.
w = (a < 0.02).astype(np.float32)
from PIL import Image as PI
def gblur(ch, r):
    im = PI.fromarray((np.clip(ch, 0, 1) * 255 + 0.5).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im).astype(np.float32) / 255
num = np.stack([gblur(I[..., c] * w, 24) for c in range(3)], -1)
den = gblur(w, 24)[..., None] + 1e-4
B = num / den
# Descontaminación: F = (I - (1-a)·B) / a en la franja semitransparente.
edge = (a > 0.02) & (a < 0.985)
F = I.copy()
aa = np.maximum(a, 0.05)[..., None]
Fe = np.clip((I - (1 - aa) * B) / aa, 0, 1)
F[edge] = Fe[edge]
rgba = np.dstack([F, a])
img = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA")
img.save(f"{out}/marlon-cutout.webp", quality=94, method=6, alpha_quality=100)

# ---- semitono: máscaras de puntos a 45° (alfa) ----
N = 840  # tamaño final
SS = 3   # supermuestreo
size = N * SS
lum = np.asarray(img.convert("RGB").resize((size, size), Image.LANCZOS).convert("L")).astype(np.float32) / 255
al = np.asarray(img.getchannel("A").resize((size, size), Image.LANCZOS)).astype(np.float32) / 255
# contraste local suave para que el rostro lea bien
lo, hi = np.percentile(lum[al > 0.5], [3, 97])
lum = np.clip((lum - lo) / (hi - lo), 0, 1)
cell = 7.0 * SS
yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
th = np.deg2rad(45)
u = (xx * np.cos(th) + yy * np.sin(th)) / cell
v = (-xx * np.sin(th) + yy * np.cos(th)) / cell
du = (u - np.round(u)); dv = (v - np.round(v))
d = np.sqrt(du * du + dv * dv)  # distancia al centro de la celda (en celdas)
for name, val, k in (("bright", lum ** 2.2, 0.10), ("dark", 1 - lum, 0.12)):
    # radio por celda (muestreado en el centro de la celda para puntos limpios)
    cu = np.round(u); cv = np.round(v)
    cx = (cu * np.cos(th) - cv * np.sin(th)) * cell
    cy = (cu * np.sin(th) + cv * np.cos(th)) * cell
    ix = np.clip(cx.astype(int), 0, size - 1); iy = np.clip(cy.astype(int), 0, size - 1)
    vc = val[iy, ix]; ac = al[iy, ix]
    r = (k + 0.5 * np.sqrt(vc)) * (ac > 0.5)
    dots = (d < r).astype(np.float32)
    m = Image.fromarray((dots * 255).astype(np.uint8), "L").resize((N, N), Image.BOX)
    rgba = Image.merge("RGBA", (Image.new("L", (N, N), 255),) * 3 + (m,))
    rgba.save(f"{out}/marlon-dots-{name}.webp", lossless=True, quality=100, method=6)
print("ok")
