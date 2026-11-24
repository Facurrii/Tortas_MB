// Datos de la clienta. Si algo cambia (teléfono, redes, textos), se edita acá.
export const sitio = {
  nombre: "Dulce Victorino",
  ciudad: "Río Cuarto",
  // Formato internacional sin + ni espacios: 54 9 + característica + número
  whatsapp: "5493584288023",
  instagram: "dulce_victorino_",
  facebook: "https://www.facebook.com/", // TODO: link exacto de la página "Dullce Victorino"
  portada: {
    titulo: "Cositas ricas para el mate",
    tituloResaltado: "y tus eventos",
    bajada:
      "Materas, tartas, box y tortas hechas a pedido. Elegí lo que te guste y encargalo por WhatsApp.",
  },
  eventos: {
    titulo: "¿Tenés un cumple o un evento?",
    texto:
      "Armamos tu mesa dulce a medida. Contanos la fecha y cuántas personas son, y te pasamos opciones.",
    mensaje: "Hola! Quería consultar por una mesa dulce para un evento.",
  },
  // Se muestra en la portada, debajo de la frase
  entrega: "Retiro por domicilio o envío (a cargo del cliente)",
  pasos: [
    { titulo: "Elegís lo que te gusta", texto: "Si tiene sabores o tamaños, tocá el que quieras." },
    { titulo: 'Tocás "Lo quiero"', texto: "Se abre WhatsApp con tu pedido ya escrito." },
    {
      titulo: "Retirás o te lo enviamos",
      texto: "Podés retirarlo por nuestro domicilio o pedir envío. El costo del envío corre por cuenta del cliente.",
    },
  ],
  pie: "Un emprendimiento pensado para quienes amamos compartir el mate con cositas ricas de por medio.",
  creditos: "Web por F.B Dev",
};
