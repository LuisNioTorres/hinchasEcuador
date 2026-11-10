import { readSessionStatus } from "@/lib/auth/session-status";

/**
 * Estado de la sesión del navegador, para que las pestañas abiertas se mantengan al
 * día (src/lib/auth/use-session-guard.ts). Solo devuelve el id de la propia cuenta.
 *
 * Es un Route Handler y no una Server Function: si Supabase renueva la sesión aquí,
 * cambiar cookies en una Server Function vuelve a dibujar la página actual y bloquea
 * las demás acciones de la pestaña mientras tanto.
 */
export async function GET() {
  return Response.json(await readSessionStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}
