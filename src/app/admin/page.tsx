"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import Login from "@/components/admin/Login";
import Panel from "@/components/admin/Panel";

export default function AdminPage() {
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-dvh bg-fondo">
      {!supabaseConfigurado ? (
        <Aviso />
      ) : sesion === undefined ? (
        <p className="p-8 text-center text-gris">Cargando…</p>
      ) : sesion ? (
        <Panel email={sesion.user.email ?? ""} />
      ) : (
        <Login />
      )}
    </div>
  );
}

function Aviso() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 p-8">
      <h1 className="font-titulo text-2xl font-semibold">Falta configurar Supabase</h1>
      <p className="text-gris">
        Creá el archivo <code>.env.local</code> en la raíz del proyecto (copiá <code>.env.local.example</code>) con la URL y la
        clave anon de Supabase, y volvé a correr <code>npm run dev</code>.
      </p>
    </div>
  );
}
