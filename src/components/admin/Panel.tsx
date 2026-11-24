"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { normalizarProducto } from "@/lib/catalogo";
import { formatearPrecio } from "@/lib/formato";
import type { Categoria, Producto } from "@/types/producto";
import { Boton } from "./ui";
import FormProducto from "./FormProducto";
import Categorias from "./Categorias";

type Vista = { tipo: "lista" } | { tipo: "producto"; producto: Producto | null; categoriaId?: string } | { tipo: "categorias" };

export default function Panel({ email }: { email: string }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [vista, setVista] = useState<Vista>({ tipo: "lista" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    const [c, p] = await Promise.all([
      supabase.from("categorias").select("*").order("orden"),
      supabase.from("productos").select("*").order("orden"),
    ]);
    if (c.error || p.error) setError("No se pudieron cargar los datos. Revisá la conexión y recargá.");
    else setError("");
    setCategorias(c.data ?? []);
    setProductos((p.data ?? []).map(normalizarProducto));
    setCargando(false);
  }, []);

  useEffect(() => {
    // recargar() actualiza el estado después del await, no en el mismo render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    recargar();
  }, [recargar]);

  async function alternarVisible(p: Producto) {
    setProductos((ps) => ps.map((x) => (x.id === p.id ? { ...x, visible: !x.visible } : x)));
    const { error } = await supabase.from("productos").update({ visible: !p.visible }).eq("id", p.id);
    if (error) {
      setError("No se pudo cambiar la visibilidad.");
      recargar();
    }
  }

  const volver = () => {
    setVista({ tipo: "lista" });
    recargar();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-16 pt-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="" className="size-11 shrink-0 rounded-full" />
          <div className="min-w-0">
            <p className="font-titulo text-xl font-semibold leading-tight">Panel</p>
            <p className="truncate text-xs text-gris">{email}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <a href="/" target="_blank" className="flex min-h-11 items-center whitespace-nowrap rounded-xl px-2 text-sm font-bold text-lila">
            Ver página
          </a>
          <Boton variante="secundario" onClick={() => supabase.auth.signOut()}>
            Salir
          </Boton>
        </div>
      </header>

      {error && <p className="rounded-xl bg-rosa px-4 py-3 text-sm font-bold text-acento">{error}</p>}

      {vista.tipo === "producto" ? (
        <FormProducto producto={vista.producto} categorias={categorias} categoriaInicial={vista.categoriaId} alTerminar={volver} />
      ) : vista.tipo === "categorias" ? (
        <Categorias categorias={categorias} productos={productos} alCambiar={recargar} alVolver={() => setVista({ tipo: "lista" })} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Boton onClick={() => setVista({ tipo: "producto", producto: null })} disabled={!categorias.length}>
              + Nuevo producto
            </Boton>
            <Boton variante="secundario" onClick={() => setVista({ tipo: "categorias" })}>
              Categorías
            </Boton>
          </div>

          {cargando ? (
            <p className="text-gris">Cargando…</p>
          ) : !categorias.length ? (
            <p className="rounded-2xl bg-white p-5 text-gris">
              Primero creá las categorías (Materas, Tartas, Box…) desde el botón <b>Categorías</b>.
            </p>
          ) : (
            [...categorias, { id: "__sin", nombre: "Sin categoría", bajada: null, orden: 9999 }].map((c) => {
              const lista = productos.filter((p) => (c.id === "__sin" ? !categorias.some((x) => x.id === p.categoria_id) : p.categoria_id === c.id));
              if (c.id === "__sin" && !lista.length) return null;
              return (
                <section key={c.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-titulo text-lg font-semibold">
                      {c.nombre} <span className="text-sm text-gris-claro">({lista.length})</span>
                    </h2>
                    {c.id !== "__sin" && (
                      <button
                        type="button"
                        onClick={() => setVista({ tipo: "producto", producto: null, categoriaId: c.id })}
                        className="min-h-10 shrink-0 rounded-full px-3 text-sm font-extrabold text-acento"
                      >
                        + Agregar
                      </button>
                    )}
                  </div>
                  {!lista.length && <p className="text-sm text-gris">Sin productos todavía.</p>}
                  <ul className="flex flex-col gap-2">
                    {lista.map((p) => (
                      <li key={p.id} className={`flex items-start gap-3 rounded-2xl bg-white p-2.5 ${p.visible ? "" : "opacity-60"}`}>
                        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-rosa">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {p.imagen_url && <img src={p.imagen_url} alt="" className="size-full object-cover" />}
                        </div>
                        <div className="flex min-w-0 grow flex-col gap-2">
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-extrabold leading-snug">{p.nombre}</p>
                            <p className="line-clamp-2 text-xs text-gris">
                              {p.variantes.length
                                ? p.variantes.map((v) => `${v.nombre} ${formatearPrecio(v.precio)}`).join(" · ")
                                : formatearPrecio(p.precio)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => alternarVisible(p)}
                              className={`min-h-10 rounded-full px-3.5 text-xs font-extrabold ${p.visible ? "bg-lila-suave text-lila" : "bg-fondo text-gris"}`}
                              aria-label={p.visible ? "Ocultar de la página" : "Mostrar en la página"}
                            >
                              {p.visible ? "● Visible" : "○ Oculto"}
                            </button>
                            <Boton variante="secundario" className="min-h-10" onClick={() => setVista({ tipo: "producto", producto: p })}>
                              Editar
                            </Boton>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
