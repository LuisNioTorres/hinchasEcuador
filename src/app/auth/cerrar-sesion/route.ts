import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Igual que la protección CSRF de Next.js: solo se acepta desde este mismo sitio. */
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Cierra la sesión solo en este dispositivo.
 *
 * Es un Route Handler y no una Server Function: borrar cookies en una Server Function
 * vuelve a dibujar la página actual, que ya no tiene sesión, y esa respuesta podía
 * quedarse colgada ("Cerrando sesión…" sin fin) y bloquear la pestaña.
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  return Response.json(
    { ok: !error },
    { status: error ? 502 : 200, headers: { "Cache-Control": "no-store" } },
  );
}
