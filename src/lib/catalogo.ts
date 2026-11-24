import { supabase, supabaseConfigurado } from "./supabase";
import { catalogoEjemplo } from "./ejemplo";
import type { Categoria, CategoriaConProductos, Producto, Variante } from "@/types/producto";

export type ResultadoCatalogo =
  | { estado: "ok"; categorias: CategoriaConProductos[]; ejemplo: boolean }
  | { estado: "error"; categorias: []; ejemplo: false };

const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));

/** Pasa una fila de Supabase al tipo Producto (jsonb/numeric vienen sueltos). */
export function normalizarProducto(fila: Record<string, unknown>): Producto {
  const variantes = Array.isArray(fila.variantes) ? (fila.variantes as Variante[]) : [];
  return {
    ...(fila as unknown as Producto),
    precio: num(fila.precio),
    variantes: variantes.map((v) => ({ nombre: String(v.nombre ?? ""), precio: num(v.precio) })),
    incluye: Array.isArray(fila.incluye) ? (fila.incluye as string[]) : [],
  };
}

/** Categorías con sus productos visibles, en orden. Las vacías no se muestran. */
export async function cargarCatalogo(): Promise<ResultadoCatalogo> {
  if (!supabaseConfigurado) return { estado: "ok", categorias: catalogoEjemplo, ejemplo: true };

  try {
    const [cats, prods] = await Promise.all([
      supabase.from("categorias").select("id, nombre, bajada, orden").order("orden"),
      supabase
        .from("productos")
        .select("*")
        .eq("visible", true)
        .order("destacado", { ascending: false })
        .order("orden")
        .order("created_at"),
    ]);
    if (cats.error || prods.error) throw cats.error || prods.error;

    const productos = (prods.data ?? []).map(normalizarProducto);
    const categorias = (cats.data as Categoria[])
      .map((c) => ({ ...c, productos: productos.filter((p) => p.categoria_id === c.id) }))
      .filter((c) => c.productos.length > 0);
    return { estado: "ok", categorias, ejemplo: false };
  } catch (e) {
    console.error("[catalogo]", e);
    return { estado: "error", categorias: [], ejemplo: false };
  }
}
