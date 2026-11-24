// Prepara cualquier foto para subirla: JPG, PNG, WEBP, AVIF, GIF y también
// HEIC/HEIF (fotos de iPhone). Siempre devuelve un JPG liviano, derecho
// (respeta la rotación del celular) y con fondo blanco si la imagen era transparente.

const LADO_MAX = 1400; // px: se ve nítida en celular y en compu
const CALIDAD = 0.82;
export const TAMANO_MAX_MB = 30;

/** Error con un mensaje pensado para mostrarle a la clienta. */
export class ErrorFoto extends Error {}

/** Para el <input type="file">: incluye las extensiones que algunos navegadores no reconocen. */
export const FORMATOS_ACEPTADOS = "image/*,.heic,.heif,.HEIC,.HEIF,.webp,.avif";

function esHeic(archivo: File): boolean {
  return /image\/hei[cf]/i.test(archivo.type) || /\.hei[cf]$/i.test(archivo.name);
}

async function decodificar(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    // Navegadores viejos: decodificar con <img>
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }
}

export async function prepararFoto(archivo: File): Promise<Blob> {
  if (archivo.size > TAMANO_MAX_MB * 1024 * 1024) {
    throw new ErrorFoto(`La foto pesa más de ${TAMANO_MAX_MB} MB.`);
  }

  let origen: Blob = archivo;
  if (esHeic(archivo)) {
    // Safari (iPhone/Mac) ya sabe leer HEIC; el resto necesita convertirla.
    try {
      await createImageBitmap(archivo);
    } catch {
      const { heicTo } = await import("heic-to/next");
      try {
        origen = await heicTo({ blob: archivo, type: "image/jpeg", quality: 0.92 });
      } catch {
        throw new ErrorFoto("No se pudo convertir la foto de iPhone. Probá exportarla como JPG.");
      }
    }
  }

  let imagen: ImageBitmap | HTMLImageElement;
  try {
    imagen = await decodificar(origen);
  } catch {
    throw new ErrorFoto("No se pudo leer esa imagen. Probá con una foto JPG o PNG.");
  }

  const ancho = "naturalWidth" in imagen ? imagen.naturalWidth : imagen.width;
  const alto = "naturalHeight" in imagen ? imagen.naturalHeight : imagen.height;
  const escala = Math.min(1, LADO_MAX / Math.max(ancho, alto));
  const w = Math.round(ancho * escala);
  const h = Math.round(alto * escala);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ErrorFoto("Tu navegador no pudo procesar la foto.");
  ctx.fillStyle = "#FFFFFF"; // PNG transparente → fondo blanco (si no, queda negro)
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(imagen, 0, 0, w, h);
  if ("close" in imagen) imagen.close();

  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", CALIDAD));
  if (!blob) throw new ErrorFoto("Tu navegador no pudo procesar la foto.");
  return blob;
}
