import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dulcevictorino.pages.dev"),
  title: "Dulce Victorino · Cositas ricas para el mate y tus eventos",
  description:
    "Materas, tartas, box y tortas hechas a pedido en Río Cuarto. Elegí lo que te guste y encargalo por WhatsApp.",
  openGraph: {
    title: "Dulce Victorino",
    description: "Cositas ricas para el mate y tus eventos · Río Cuarto",
    images: ["/img/logo.png"],
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf1e8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Nunito:wght@400;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
