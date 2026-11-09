import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "./env";

/**
 * Cliente con la clave secreta. Solo sirve para registrar el voto, que es el único
 * permiso de esa clave sobre `votos`. Nunca debe llegar al navegador.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("Falta SUPABASE_SECRET_KEY.");

  return createClient(getSupabaseEnv().url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
