"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Boton, Campo, inputCls } from "./ui";

export default function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
    setCargando(false);
    if (error) setError("Email o contraseña incorrectos.");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[linear-gradient(180deg,var(--color-crema),var(--color-rosa))] p-4">
      <form onSubmit={entrar} className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-7 shadow-[0_14px_34px_rgba(28,24,36,0.12)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="Dulce Victorino" className="mx-auto size-24 rounded-full" />
        <h1 className="text-center font-titulo text-2xl font-semibold">Panel de productos</h1>
        <Campo etiqueta="Email">
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Campo>
        <Campo etiqueta="Contraseña">
          <input
            type="password"
            required
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className={inputCls}
          />
        </Campo>
        {error && <p className="text-sm font-bold text-acento">{error}</p>}
        <Boton type="submit" disabled={cargando}>
          {cargando ? "Entrando…" : "Entrar"}
        </Boton>
        <Link href="/" className="text-center text-sm font-bold text-lila">
          ← Volver a la página
        </Link>
      </form>
    </div>
  );
}
