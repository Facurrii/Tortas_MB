import Link from "next/link";
import { sitio } from "@/config/sitio";
import { linkWhatsapp } from "@/lib/formato";
import Catalogo from "@/components/catalogo/Catalogo";
import { IconoInstagram, IconoWhatsapp } from "@/components/ui/Iconos";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Portada: crema → rosa, con el logo oscuro de la marca */}
      <header className="relative bg-[linear-gradient(180deg,var(--color-crema)_0%,var(--color-crema)_35%,var(--color-rosa)_75%,var(--color-fondo)_100%)]">
        <a
          href={`https://instagram.com/${sitio.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de ${sitio.nombre}`}
          className="absolute right-4 top-3.5 flex size-11 items-center justify-center rounded-full bg-texto text-rosa"
        >
          <IconoInstagram />
        </a>

        <div className="flex justify-center pt-7">
          <div className="flex rounded-full border-[1.5px] border-rosa bg-white p-[7px] shadow-[0_14px_34px_rgba(28,24,36,0.22)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo.png"
              alt={`${sitio.nombre} · Cositas ricas`}
              width={262}
              height={262}
              className="size-[230px] rounded-full sm:size-[262px]"
            />
          </div>
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 pb-8 pt-5 text-center">
          <h1 className="font-titulo text-[30px] font-medium leading-[1.12] sm:text-4xl">
            {sitio.portada.titulo} <span className="text-acento">{sitio.portada.tituloResaltado}</span>
          </h1>
          <p className="max-w-[330px] text-[15px] leading-relaxed text-gris">{sitio.portada.bajada}</p>
          <p className="max-w-[300px] sm:max-w-none rounded-2xl bg-white/70 px-4 py-2 text-[13px] font-bold leading-snug text-texto">
            {sitio.entrega}
          </p>
          <a
            href="#productos"
            className="mt-1.5 rounded-full bg-acento px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_6px_16px_rgba(182,94,116,0.25)] transition-colors hover:bg-acento-oscuro"
          >
            Ver productos
          </a>
          <div aria-hidden="true" className="mt-3.5 flex items-center gap-2.5 text-lila/70">
            <span className="h-px w-[60px] bg-current" />
            <span className="text-xs">♥</span>
            <span className="h-px w-[60px] bg-current" />
          </div>
        </div>
      </header>

      <main id="productos" className="mx-auto w-full max-w-5xl">
        <Catalogo />

        {/* Eventos */}
        <section className="mx-4 mt-8 flex flex-col gap-3 rounded-[26px] bg-rosa px-6 py-6">
          <p className="text-[13px] font-extrabold uppercase tracking-[1.5px] text-acento">Eventos</p>
          <h2 className="font-titulo text-[25px] font-semibold leading-tight">{sitio.eventos.titulo}</h2>
          <p className="text-[15px] leading-relaxed">{sitio.eventos.texto}</p>
          <a
            href={linkWhatsapp(sitio.eventos.mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center gap-2 self-start rounded-full bg-texto px-5 text-[15px] font-extrabold text-white"
          >
            <IconoWhatsapp className="size-[18px]" />
            Consultar por mi evento
          </a>
        </section>

        {/* Cómo encargar */}
        <section className="flex flex-col gap-3 px-4 pt-8">
          <h2 className="font-titulo text-[25px] font-semibold">Cómo encargar</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {sitio.pasos.map((paso, i) => (
              <li key={i} className="flex items-start gap-3.5 rounded-[20px] bg-white p-4">
                <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-texto font-extrabold text-rosa">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] font-extrabold">{paso.titulo}</p>
                  <p className="text-sm text-gris">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      {/* Pie */}
      <footer className="mt-auto flex flex-col items-center gap-3 bg-[linear-gradient(180deg,var(--color-fondo)_0%,var(--color-rosa)_45%,var(--color-crema)_100%)] px-5 pb-7 pt-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/logo.png"
          alt={sitio.nombre}
          width={120}
          height={120}
          className="size-[120px] rounded-full border-4 border-white shadow-[0_8px_20px_rgba(28,24,36,0.2)]"
        />
        <p className="max-w-[300px] text-sm leading-relaxed text-gris">{sitio.pie}</p>
        <div className="flex gap-5 text-sm font-bold">
          <a href={`https://instagram.com/${sitio.instagram}`} target="_blank" rel="noopener noreferrer" className="text-acento">
            @{sitio.instagram}
          </a>
          <a href={sitio.facebook} target="_blank" rel="noopener noreferrer" className="text-lila">
            Facebook
          </a>
        </div>
        <p className="text-xs text-gris-claro">{sitio.creditos}</p>
        <Link href="/admin/" className="pt-2 text-xs text-gris-claro/80 underline underline-offset-2 transition-colors hover:text-acento">
          Acceso administración
        </Link>
      </footer>
    </div>
  );
}
