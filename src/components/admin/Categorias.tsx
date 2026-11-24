"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Categoria, Producto } from "@/types/producto";
import { Boton, inputCls } from "./ui";

export default function Categorias({
  categorias,
  productos,
  alCambiar,
  alVolver,
}: {
  categorias: Categoria[];
  productos: Producto[];
  alCambiar: () => void;
  alVolver: () => void;
}) {
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!nueva.trim()) return;
    const orden = Math.max(0, ...categorias.map((c) => c.orden)) + 1;
    const { error } = await supabase.from("categorias").insert({ nombre: nueva.trim(), orden });
    if (error) return setError("No se pudo crear: " + error.message);
    setNueva("");
    alCambiar();
  }

  async function guardar(c: Categoria, cambios: Partial<Categoria>) {
    const { error } = await supabase.from("categorias").update(cambios).eq("id", c.id);
    if (error) setError("No se pudo guardar: " + error.message);
    alCambiar();
  }

  async function mover(i: number, dir: -1 | 1) {
    const a = categorias[i];
    const b = categorias[i + dir];
    if (!a || !b) return;
    await Promise.all([
      supabase.from("categorias").update({ orden: b.orden }).eq("id", a.id),
      supabase.from("categorias").update({ orden: a.orden }).eq("id", b.id),
    ]);
    alCambiar();
  }

  async function borrar(c: Categoria) {
    const cant = productos.filter((p) => p.categoria_id === c.id).length;
    const aviso = cant
      ? `"${c.nombre}" tiene ${cant} producto(s). Quedan sin categoría y no se ven en la página hasta que les asignes otra. ¿Borrar igual?`
      : `¿Borrar la categoría "${c.nombre}"?`;
    if (!window.confirm(aviso)) return;
    const { error } = await supabase.from("categorias").delete().eq("id", c.id);
    if (error) setError("No se pudo borrar: " + error.message);
    alCambiar();
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-titulo text-xl font-semibold">Categorías</h2>
        <button type="button" onClick={alVolver} className="text-sm font-bold text-lila">
          ← Volver
        </button>
      </div>
      <p className="text-sm text-gris">El orden de acá es el orden en la página. Los cambios se guardan al salir de cada campo.</p>

      <ul className="flex flex-col gap-3">
        {categorias.map((c, i) => (
          <li key={c.id} className="flex flex-col gap-2 rounded-2xl bg-fondo p-3">
            <div className="flex gap-2">
              <input
                defaultValue={c.nombre}
                onBlur={(e) => e.target.value.trim() && e.target.value !== c.nombre && guardar(c, { nombre: e.target.value.trim() })}
                className={`${inputCls} font-bold`}
                aria-label="Nombre de la categoría"
              />
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="px-2 text-lg disabled:opacity-30" aria-label="Subir">
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === categorias.length - 1}
                className="px-2 text-lg disabled:opacity-30"
                aria-label="Bajar"
              >
                ↓
              </button>
            </div>
            <input
              defaultValue={c.bajada ?? ""}
              onBlur={(e) => e.target.value !== (c.bajada ?? "") && guardar(c, { bajada: e.target.value.trim() || null })}
              className={inputCls}
              placeholder="Frase corta (opcional)"
              aria-label="Frase de la categoría"
            />
            <button type="button" onClick={() => borrar(c)} className="self-end text-xs font-bold text-acento">
              Borrar categoría
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={crear} className="flex gap-2">
        <input value={nueva} onChange={(e) => setNueva(e.target.value)} className={inputCls} placeholder="Nueva categoría (ej: Dulces)" />
        <Boton type="submit" className="shrink-0">
          Agregar
        </Boton>
      </form>
      {error && <p className="text-sm font-bold text-acento">{error}</p>}
    </div>
  );
}
