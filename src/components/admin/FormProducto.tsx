"use client";

import { useState } from "react";
import { BUCKET_FOTOS, supabase } from "@/lib/supabase";
import { ErrorFoto, FORMATOS_ACEPTADOS, prepararFoto } from "@/lib/imagen";
import type { Categoria, Producto } from "@/types/producto";
import { Boton, Campo, inputCls } from "./ui";

type VarForm = { nombre: string; precio: string };

const aNumero = (s: string): number | null => {
  const limpio = s.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
};
const aTexto = (n: number | null) => (n === null ? "" : String(n));

export default function FormProducto({
  producto,
  categorias,
  categoriaInicial,
  alTerminar,
}: {
  producto: Producto | null;
  categorias: Categoria[];
  categoriaInicial?: string;
  alTerminar: () => void;
}) {
  const p = producto;
  const [nombre, setNombre] = useState(p?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(p?.descripcion ?? "");
  const [categoriaId, setCategoriaId] = useState(p?.categoria_id ?? categoriaInicial ?? categorias[0]?.id ?? "");
  const [precio, setPrecio] = useState(aTexto(p?.precio ?? null));
  const [tituloVar, setTituloVar] = useState(p?.titulo_variantes ?? "");
  const [variantes, setVariantes] = useState<VarForm[]>(
    (p?.variantes ?? []).map((v) => ({ nombre: v.nombre, precio: aTexto(v.precio) }))
  );
  const [incluye, setIncluye] = useState((p?.incluye ?? []).join("\n"));
  const [etiqueta, setEtiqueta] = useState(p?.etiqueta ?? "");
  const [visible, setVisible] = useState(p?.visible ?? true);
  const [destacado, setDestacado] = useState(p?.destacado ?? false);
  const [orden, setOrden] = useState(String(p?.orden ?? 0));
  const [imagenUrl, setImagenUrl] = useState(p?.imagen_url ?? "");
  const [estadoFoto, setEstadoFoto] = useState(""); // "" | "Preparando foto…" | "Subiendo…"
  const [vistaPrevia, setVistaPrevia] = useState("");
  const subiendo = estadoFoto !== "";
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  /** Sube a Storage reintentando: si la sesión venció (celular en segundo plano) la renueva. */
  async function subirAStorage(ruta: string, foto: Blob) {
    let ultimo: unknown;
    for (let intento = 1; intento <= 3; intento++) {
      const { data } = await supabase.auth.getSession(); // renueva el token si venció
      if (!data.session) throw new ErrorFoto("Se cerró tu sesión. Volvé a entrar al panel y probá de nuevo.");
      const { error } = await supabase.storage.from(BUCKET_FOTOS).upload(ruta, foto, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: true,
      });
      if (!error) return;
      ultimo = error;
      console.warn(`[foto] intento ${intento} falló`, error);
      if (/jwt|token|auth|row-level|unauthori|403|401/i.test(error.message)) await supabase.auth.refreshSession();
      await new Promise((r) => setTimeout(r, 800 * intento));
    }
    throw ultimo;
  }

  async function subirFoto(archivo: File) {
    setError("");
    setEstadoFoto("Preparando foto…");
    let previa = "";
    try {
      const comprimida = await prepararFoto(archivo);
      previa = URL.createObjectURL(comprimida);
      setVistaPrevia(previa); // se ve al toque, aunque la subida tarde
      setEstadoFoto("Subiendo…");
      const ruta = `${crypto.randomUUID()}.jpg`;
      await subirAStorage(ruta, comprimida);
      setImagenUrl(supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta).data.publicUrl);
    } catch (e) {
      console.error(e);
      const detalle = e instanceof Error ? e.message : String(e);
      setError(
        e instanceof ErrorFoto ? e.message : `No se pudo subir la foto. Revisá la conexión y probá de nuevo. (${detalle})`
      );
    } finally {
      setEstadoFoto("");
      setVistaPrevia("");
      if (previa) URL.revokeObjectURL(previa);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const vars = variantes.filter((v) => v.nombre.trim()).map((v) => ({ nombre: v.nombre.trim(), precio: aNumero(v.precio) }));
    const datos = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      categoria_id: categoriaId || null,
      precio: vars.length ? null : aNumero(precio),
      variantes: vars,
      titulo_variantes: vars.length ? tituloVar.trim() || null : null,
      incluye: incluye.split("\n").map((x) => x.trim()).filter(Boolean),
      etiqueta: etiqueta.trim() || null,
      imagen_url: imagenUrl || null,
      visible,
      destacado,
      orden: Number(orden) || 0,
    };
    if (!datos.nombre) return setError("Poné un nombre.");
    setGuardando(true);
    const { error } = p
      ? await supabase.from("productos").update(datos).eq("id", p.id)
      : await supabase.from("productos").insert(datos);
    setGuardando(false);
    if (error) return setError("No se pudo guardar: " + error.message);
    alTerminar();
  }

  async function borrar() {
    if (!p || !window.confirm(`¿Borrar "${p.nombre}"? No se puede deshacer.`)) return;
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) return setError("No se pudo borrar: " + error.message);
    // La foto se borra del almacenamiento si es nuestra
    const marca = `/${BUCKET_FOTOS}/`;
    if (p.imagen_url?.includes(marca)) {
      await supabase.storage.from(BUCKET_FOTOS).remove([p.imagen_url.split(marca)[1]]);
    }
    alTerminar();
  }

  const cambiarVar = (i: number, campo: keyof VarForm, valor: string) =>
    setVariantes((vs) => vs.map((v, j) => (j === i ? { ...v, [campo]: valor } : v)));

  return (
    <form onSubmit={guardar} className="flex flex-col gap-4 rounded-3xl bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-titulo text-xl font-semibold">{p ? "Editar producto" : "Nuevo producto"}</h2>
        <button type="button" onClick={alTerminar} className="text-sm font-bold text-lila">
          ← Volver
        </button>
      </div>

      {/* Foto */}
      <div className="flex items-center gap-4">
        <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-rosa">
          {(vistaPrevia || imagenUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vistaPrevia || imagenUrl}
              alt=""
              className={`size-full object-cover ${vistaPrevia ? "animate-pulse opacity-70" : ""}`}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className={`inline-flex min-h-11 items-center rounded-xl ${subiendo ? "cursor-wait opacity-70" : "cursor-pointer"} border-[1.5px] border-lila-suave px-4 text-sm font-extrabold hover:border-lila/50`}>
            {estadoFoto || (imagenUrl ? "Cambiar foto" : "Subir foto")}
            <input
              type="file"
              accept={FORMATOS_ACEPTADOS}
              className="sr-only"
              disabled={subiendo}
              onChange={(e) => {
                const archivo = e.target.files?.[0];
                e.target.value = ""; // permite volver a elegir la misma foto
                if (archivo) subirFoto(archivo);
              }}
            />
          </label>
          <p className="text-xs leading-snug text-gris">JPG, PNG, WEBP o fotos de iPhone (HEIC). Se achica sola.</p>
          {imagenUrl && (
            <button type="button" onClick={() => setImagenUrl("")} className="self-start text-xs font-bold text-acento">
              Quitar foto
            </button>
          )}
        </div>
      </div>

      <Campo etiqueta="Nombre">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputCls} placeholder="Rosca matera" required />
      </Campo>
      <Campo etiqueta="Descripción corta">
        <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={inputCls} placeholder="Esponjosa, con glaseado." />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Categoría">
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputCls}>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Etiqueta (opcional)" ayuda='Ej: "Más pedida", "Nuevo"'>
          <input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} className={inputCls} />
        </Campo>
      </div>

      {/* Variantes */}
      <fieldset className="flex flex-col gap-3 rounded-2xl bg-fondo p-4">
        <legend className="sr-only">Opciones</legend>
        <p className="text-sm font-extrabold">Opciones con precio propio (sabores, tamaños…)</p>
        {variantes.length > 0 && (
          <Campo etiqueta="Título de las opciones" ayuda='Ej: "Sabor", "Tamaño", "Porciones"'>
            <input value={tituloVar} onChange={(e) => setTituloVar(e.target.value)} className={inputCls} />
          </Campo>
        )}
        {variantes.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v.nombre}
              onChange={(e) => cambiarVar(i, "nombre", e.target.value)}
              className={inputCls}
              placeholder="Limón"
              aria-label={`Opción ${i + 1}`}
            />
            <input
              value={v.precio}
              onChange={(e) => cambiarVar(i, "precio", e.target.value)}
              className={`${inputCls} max-w-32`}
              inputMode="numeric"
              placeholder="Precio"
              aria-label={`Precio opción ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => setVariantes((vs) => vs.filter((_, j) => j !== i))}
              className="shrink-0 px-2 text-lg text-gris"
              aria-label="Quitar opción"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setVariantes((vs) => [...vs, { nombre: "", precio: "" }])} className="self-start text-sm font-extrabold text-lila">
          + Agregar opción
        </button>
        {variantes.length === 0 && (
          <Campo etiqueta="Precio" ayuda='Vacío = se muestra "Consultar"'>
            <input value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputCls} inputMode="numeric" placeholder="12000" />
          </Campo>
        )}
      </fieldset>

      <Campo etiqueta="Qué incluye (para box)" ayuda="Uno por línea. Dejalo vacío si no aplica.">
        <textarea value={incluye} onChange={(e) => setIncluye(e.target.value)} rows={3} className={`${inputCls} py-2`} />
      </Campo>

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="size-5 accent-acento" />
          Visible en la página
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="size-5 accent-acento" />
          Mostrar primero
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          Orden
          <input value={orden} onChange={(e) => setOrden(e.target.value)} inputMode="numeric" className={`${inputCls} w-20`} />
        </label>
      </div>

      {error && <p className="text-sm font-bold text-acento">{error}</p>}

      <div className="flex flex-wrap justify-between gap-2">
        {p ? (
          <Boton type="button" variante="peligro" onClick={borrar}>
            Borrar
          </Boton>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Boton type="button" variante="secundario" onClick={alTerminar}>
            Cancelar
          </Boton>
          <Boton type="submit" disabled={guardando || subiendo}>
            {guardando ? "Guardando…" : "Guardar"}
          </Boton>
        </div>
      </div>
    </form>
  );
}
