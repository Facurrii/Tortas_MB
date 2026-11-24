// Catálogo de prueba: solo se usa en local mientras no exista el .env.local.
import type { CategoriaConProductos, Producto } from "@/types/producto";

let n = 0;
function p(categoria_id: string, datos: Partial<Producto> & { nombre: string }): Producto {
  n += 1;
  return {
    id: `ej-${n}`,
    categoria_id,
    descripcion: null,
    precio: null,
    variantes: [],
    titulo_variantes: null,
    incluye: [],
    etiqueta: null,
    imagen_url: null,
    visible: true,
    destacado: false,
    orden: n,
    ...datos,
  };
}

const cat = (id: string, nombre: string, bajada: string, orden: number, productos: Producto[]): CategoriaConProductos => ({
  id,
  nombre,
  bajada,
  orden,
  productos,
});

export const catalogoEjemplo: CategoriaConProductos[] = [
  cat("materas", "Para el mate", "Roscas, budines, alfajores y cositas para la merienda.", 1, [
    p("materas", {
      nombre: "Rosca matera",
      descripcion: "Esponjosa, con glaseado.",
      etiqueta: "Más pedida",
      titulo_variantes: "Sabor",
      variantes: [
        { nombre: "Limón", precio: 9000 },
        { nombre: "Arándanos", precio: 10500 },
        { nombre: "Chocolate", precio: 10000 },
      ],
    }),
    p("materas", {
      nombre: "Budín",
      descripcion: "Ideal para la merienda.",
      titulo_variantes: "Sabor",
      variantes: [
        { nombre: "Limón", precio: 6000 },
        { nombre: "Marmolado", precio: 6500 },
      ],
    }),
    p("materas", { nombre: "Rosca de coco", descripcion: "Con dulce de leche y coco.", precio: 9500 }),
    p("materas", {
      nombre: "Alfajores de maicena",
      descripcion: "Con dulce de leche y coco.",
      titulo_variantes: "Cantidad",
      variantes: [
        { nombre: "x6", precio: 5000 },
        { nombre: "x12", precio: 9000 },
      ],
    }),
    p("materas", { nombre: "Bombones", descripcion: "De chocolate, surtidos.", precio: 7000 }),
  ]),
  cat("tartas", "Tartas y postres", "Clásicas de siempre, hechas en casa.", 2, [
    p("tartas", {
      nombre: "Lemon pie",
      descripcion: "Con merengue dorado.",
      titulo_variantes: "Tamaño",
      variantes: [
        { nombre: "Chica", precio: 12000 },
        { nombre: "Grande", precio: 18000 },
      ],
    }),
    p("tartas", {
      nombre: "Pastafrola",
      descripcion: "De membrillo o batata.",
      titulo_variantes: "Relleno",
      variantes: [
        { nombre: "Membrillo", precio: 8000 },
        { nombre: "Batata", precio: 8000 },
      ],
    }),
    p("tartas", { nombre: "Tarta frutal", descripcion: "Con frutas de estación." }),
  ]),
  cat("box", "Box y regalos", "Para regalar o para darte un gusto.", 3, [
    p("box", { nombre: "Box 1", descripcion: "Para dos.", precio: 11000, incluye: ["2 porciones de budín", "2 alfajores", "1 porción de pastafrola"] }),
    p("box", {
      nombre: "Box 2",
      descripcion: "Para la ronda de mates.",
      etiqueta: "Para regalar",
      precio: 19000,
      incluye: ["4 porciones de budín", "4 alfajores", "2 porciones de pastafrola"],
    }),
  ]),
  cat("tortas", "Tortas y eventos", "Cumples, mesas dulces y tortas a medida.", 4, [
    p("tortas", {
      nombre: "Chocolate y dulce de leche",
      descripcion: "Decorada con ganache.",
      titulo_variantes: "Porciones",
      variantes: [
        { nombre: "12 porciones", precio: 30000 },
        { nombre: "20 porciones", precio: 45000 },
      ],
    }),
    p("tortas", { nombre: "Torta a medida", descripcion: "Contanos tu idea." }),
  ]),
];
