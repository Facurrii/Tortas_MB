"use client";

import { useEffect, useState } from "react";
import { cargarCatalogo, type ResultadoCatalogo } from "@/lib/catalogo";
import { linkWhatsapp } from "@/lib/formato";
import TarjetaProducto from "./TarjetaProducto";
import { IconoWhatsapp } from "@/components/ui/Iconos";

export default function Catalogo() {
  const [res, setRes] = useState<ResultadoCatalogo | null>(null);

  useEffect(() => {
    let vivo = true;
    cargarCatalogo().then((r) => vivo && setRes(r));
    return () => {
      vivo = false;
    };
  }, []);

  if (!res) return <Esqueleto />;

  if (res.estado === "error" || res.categorias.length === 0) {
    return (
      <div className="mx-4 mt-6 flex flex-col items-start gap-3 rounded-3xl bg-white p-6">
        <p className="font-titulo text-xl font-semibold">
          {res.estado === "error" ? "No pudimos cargar los productos" : "Estamos armando el catálogo"}
        </p>
        <p className="text-[15px] leading-relaxed text-gris">
          Escribinos por WhatsApp y te pasamos todo lo que tenemos disponible.
        </p>
        <a
          href={linkWhatsapp("Hola! Quería consultar qué tienen disponible.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 rounded-full bg-acento px-5 font-extrabold text-white"
        >
          <IconoWhatsapp /> Consultar por WhatsApp
        </a>
      </div>
    );
  }

  const { categorias, ejemplo } = res;

  return (
    <>
      {ejemplo && (
        <p className="mx-4 mt-2 rounded-xl border border-dashed border-lila/40 bg-lila-suave/60 px-3 py-2 text-xs text-lila">
          Modo ejemplo: falta el <code>.env.local</code> con los datos de Supabase.
        </p>
      )}

      {/* Botones de categoría */}
      <nav aria-label="Categorías" className="flex flex-col gap-3 px-4 pt-2.5">
        <h2 className="font-titulo text-[26px] font-semibold">¿Qué se te antoja?</h2>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              className="flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] border-lila-suave bg-white px-3.5 text-sm font-bold transition-colors hover:border-lila/50"
            >
              {c.nombre}
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-lila-suave text-[11px] font-extrabold text-lila">
                {c.productos.length}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Una fila por categoría */}
      {categorias.map((c) => (
        <section key={c.id} id={`cat-${c.id}`} className="flex flex-col gap-1 pt-7" aria-labelledby={`t-${c.id}`}>
          <div className="flex items-baseline justify-between px-4">
            <h3 id={`t-${c.id}`} className="font-titulo text-[23px] font-semibold">
              {c.nombre} <span className="text-[15px] text-acento" aria-hidden="true">♥</span>
            </h3>
            {c.productos.length > 1 && <p className="text-[13px] font-bold text-lila sm:hidden">Deslizá →</p>}
          </div>
          {c.bajada && <p className="px-4 pb-2 text-sm text-gris">{c.bajada}</p>}
          <div className="sin-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2.5 pt-1 scroll-px-4">
            {c.productos.map((p, i) => (
              <TarjetaProducto key={p.id} producto={p} indice={i} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function Esqueleto() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4" aria-busy="true" aria-label="Cargando productos">
      <div className="h-8 w-48 animate-pulse rounded-full bg-rosa" />
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-white" />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[0, 1].map((i) => (
          <div key={i} className="h-[320px] w-[232px] shrink-0 animate-pulse rounded-[22px] bg-white" />
        ))}
      </div>
    </div>
  );
}
