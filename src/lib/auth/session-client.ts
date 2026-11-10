import type { SessionStatus } from "@/lib/auth/account";
import { AUTH_ROUTES } from "@/lib/auth/routes";

/** Ninguna consulta puede dejar la pantalla esperando para siempre. */
const TIMEOUT_MS = 10_000;

/** Pregunta al servidor qué cuenta tiene la sesión de este navegador. */
export async function fetchSessionStatus(): Promise<SessionStatus> {
  const response = await fetch(AUTH_ROUTES.session, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) return { status: "unknown" };
  const body: unknown = await response.json();
  if (typeof body !== "object" || body === null || !("status" in body)) {
    return { status: "unknown" };
  }
  if (
    body.status === "signed-in" &&
    "userId" in body &&
    typeof body.userId === "string"
  ) {
    return { status: "signed-in", userId: body.userId };
  }
  return body.status === "signed-out"
    ? { status: "signed-out" }
    : { status: "unknown" };
}

/** Cierra la sesión en este dispositivo. `true` si se cerró. */
export async function requestSignOut(): Promise<boolean> {
  try {
    const response = await fetch(AUTH_ROUTES.signOut, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}
