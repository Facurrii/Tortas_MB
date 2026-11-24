import type { ButtonHTMLAttributes, ReactNode } from "react";

export const inputCls =
  "w-full min-h-11 rounded-xl border-[1.5px] border-lila-suave bg-white px-3 text-[15px] outline-none transition-colors focus:border-lila";

export function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-extrabold">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-xs text-gris">{ayuda}</span>}
    </label>
  );
}

type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "principal" | "secundario" | "peligro" };

export function Boton({ variante = "principal", className = "", ...props }: BotonProps) {
  const estilos = {
    principal: "bg-acento text-white hover:bg-acento-oscuro",
    secundario: "bg-white text-texto border-[1.5px] border-lila-suave hover:border-lila/50",
    peligro: "bg-white text-acento border-[1.5px] border-acento/30 hover:bg-rosa",
  }[variante];
  return (
    <button
      {...props}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-extrabold transition-colors disabled:opacity-50 ${estilos} ${className}`}
    />
  );
}
