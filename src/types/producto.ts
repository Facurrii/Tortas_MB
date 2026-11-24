export type Variante = {
  nombre: string;
  /** null = "Consultar" */
  precio: number | null;
};

export type Categoria = {
  id: string;
  nombre: string;
  bajada: string | null;
  orden: number;
};

export type Producto = {
  id: string;
  categoria_id: string | null;
  nombre: string;
  descripcion: string | null;
  /** Se usa cuando el producto no tiene variantes. null = "Consultar" */
  precio: number | null;
  titulo_variantes: string | null;
  variantes: Variante[];
  incluye: string[];
  etiqueta: string | null;
  imagen_url: string | null;
  visible: boolean;
  destacado: boolean;
  orden: number;
};

export type CategoriaConProductos = Categoria & { productos: Producto[] };
