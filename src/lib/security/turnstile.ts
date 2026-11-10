import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 10_000;

/**
 * Comprueba con Cloudflare que el comprobante de Turnstile es auténtico y no se usó.
 * Si Cloudflare no responde, se rechaza: la acción no sigue sin comprobación.
 */
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("Falta TURNSTILE_SECRET_KEY.");

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const body: unknown = await response.json();
    return (
      typeof body === "object" &&
      body !== null &&
      "success" in body &&
      body.success === true
    );
  } catch {
    return false;
  }
}
