"use client";

import { useEffect, useRef } from "react";
import { IconoCerrar, IconoWhatsapp } from "@/components/ui/Iconos";

type Props = {
  abierto: boolean;
  alCerrar: () => void;
  src: string;
  nombre: string;
  detalle?: string;
  hrefPedido?: string;
};

/** Foto a pantalla completa. Se cierra tocando afuera, con la X o con Escape. */
export default function VisorFoto({ abierto, alCerrar, src, nombre, detalle, hrefPedido }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden"; // que no se mueva la página de atrás
    }
    if (!abierto && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-label={`Foto de ${nombre}`}
      onClose={() => {
        document.documentElement.style.overflow = "";
        alCerrar();
      }}
      onClick={(e) => {
        // Tocar el fondo oscuro (no la foto ni los botones) cierra
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.fondo) ref.current?.close();
      }}
      className="m-0 size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-texto/90 backdrop:backdrop-blur-sm open:flex"
    >
      <div data-fondo="1" className="flex size-full flex-col items-center justify-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-16">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Cerrar foto"
          className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        >
          <IconoCerrar />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={nombre}
          className="max-h-[calc(100dvh-11rem)] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />

        <div data-fondo="1" className="flex w-full max-w-md items-center justify-between gap-3 text-white">
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold">{nombre}</p>
            {detalle && <p className="truncate text-sm text-white/75">{detalle}</p>}
          </div>
          {hrefPedido && (
            <a
              href={hrefPedido}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-[14px] bg-acento px-3.5 text-sm font-extrabold text-white transition-colors hover:bg-acento-oscuro"
            >
              <IconoWhatsapp />
              Lo quiero
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
