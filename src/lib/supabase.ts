import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** false si falta el .env.local: la landing muestra productos de ejemplo. */
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://sin-configurar.supabase.co",
  supabaseAnonKey || "sin-configurar"
);

export const BUCKET_FOTOS = "productos";
