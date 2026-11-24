"use client";

import { useState } from "react";
import type { Producto } from "@/types/producto";
import { formatearPrecio, linkWhatsapp, mensajePedido } from "@/lib/formato";
import { IconoAmpliar, IconoFoto, IconoWhatsapp } from "@/components/ui/Iconos";
import VisorFoto from "./VisorFoto";

const TONOS = ["bg-rosa", "bg-lila-suave", "bg-crema"];

export default function TarjetaProducto({ producto, indice }: { producto: Producto; indice: number }) {
  const [elegida, setElegida] = useState(0);
  const [verFoto, setVerFoto] = useState(false);
  const variante = producto.variantes.length ? producto.variantes[Math.min(elegida, producto.variantes.length - 1)] : null;
  const precio = variante ? variante.precio : producto.precio;
  const href = linkWhatsapp(mensajePedido(producto, variante));

  return (
    <article className="flex w-[232px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_6px_18px_rgba(96,98,200,0.08)] sm:w-[260px]">
      <div className={`relative h-[150px] overflow-hidden sm:h-[170px] ${producto.imagen_url ? "bg-rosa" : TONOS[indice % TONOS.length]}`}>
        {producto.imagen_url ? (
          <button
            type="button"
            onClick={() => setVerFoto(true)}
            aria-label={`Ver foto completa de ${producto.nombre}`}
            className="group block size-full cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-white/85 text-texto shadow-sm">
              <IconoAmpliar />
            </span>
          </button>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 text-gris-claro">
            <IconoFoto />
            <span className="text-[11px] font-bold">Foto próximamente</span>
          </div>
        )}
        {producto.etiqueta && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-acento">
            {producto.etiqueta}
          </span>
        )}
      </div>

      <div className="flex grow flex-col gap-2 px-3.5 pb-3.5 pt-3">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-base font-extrabold leading-tight">{producto.nombre}</h4>
          {producto.descripcion && <p className="text-[13px] leading-snug text-gris">{producto.descripcion}</p>}
        </div>

        {producto.variantes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-gris-claro">
              {producto.titulo_variantes || "Opciones"}
            </p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={producto.titulo_variantes || "Opciones"}>
              {producto.variantes.map((v, i) => {
                const activa = i === elegida;
                return (
                  <button
                    key={v.nombre + i}
                    type="button"
                    role="radio"
                    aria-checked={activa}
                    onClick={() => setElegida(i)}
                    className={`min-h-[34px] rounded-full border-[1.5px] px-3 text-[13px] transition-colors ${
                      activa
                        ? "border-acento bg-acento font-extrabold text-white"
                        : "border-lila-suave bg-white font-bold text-texto hover:border-acento/40"
                    }`}
                  >
                    {v.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {producto.incluye.length > 0 && (
          <div className="flex flex-col gap-1 rounded-[14px] bg-fondo px-3 py-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-gris-claro">Incluye</p>
            <ul className="flex flex-col gap-0.5">
              {producto.incluye.map((x, i) => (
                <li key={i} className="text-[13px] leading-snug">
                  · {x}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-base font-extrabold text-acento">{formatearPrecio(precio)}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-1.5 rounded-[14px] bg-acento px-3.5 text-sm font-extrabold text-white transition-colors hover:bg-acento-oscuro"
          >
            <IconoWhatsapp />
            Lo quiero
          </a>
        </div>
      </div>

      {producto.imagen_url && (
        <VisorFoto
          abierto={verFoto}
          alCerrar={() => setVerFoto(false)}
          src={producto.imagen_url}
          nombre={producto.nombre}
          detalle={[variante?.nombre, formatearPrecio(precio)].filter(Boolean).join(" · ")}
          hrefPedido={href}
        />
      )}
    </article>
  );
}
