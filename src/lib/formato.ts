import { sitio } from "@/config/sitio";
import type { Producto, Variante } from "@/types/producto";

export function formatearPrecio(precio: number | null | undefined): string {
  if (precio === null || precio === undefined || Number.isNaN(precio)) return "Consultar";
  return "$ " + new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(precio);
}

export function linkWhatsapp(texto: string): string {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/**
 * Mensaje del pedido para WhatsApp. Sin links: queda corto, prolijo y
 * la clienta ve de un vistazo qué le piden.
 *
 *   Hola! 👋 Quiero encargar:
 *
 *   🍰 *Torta de coco y dulce de leche*
 *   Porciones: 12 porciones
 *   Precio: $ 12.000
 *
 *   ¿Para cuándo la podría tener?
 */
export function mensajePedido(p: Producto, variante: Variante | null): string {
  const precio = formatearPrecio(variante ? variante.precio : p.precio);
  const lineas = ["Hola! 👋 Quiero encargar:", "", `🍰 *${p.nombre}*`];
  if (variante) lineas.push(`${p.titulo_variantes || "Opción"}: ${variante.nombre}`);
  lineas.push(precio === "Consultar" ? "Precio: a consultar" : `Precio: ${precio}`);
  lineas.push("", "¿Para cuándo lo podría tener?");
  return lineas.join("\n");
}
