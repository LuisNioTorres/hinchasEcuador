/**
 * Modo pre-lanzamiento (paso 7 de docs/PLAN_INFRAESTRUCTURA.md, aprobado por el dueño
 * el 2026-11-10): mientras el sitio no se lanza, el público solo ve "Próximamente" y
 * nadie sin acceso puede enviar nada (ni votar). El dueño entra con un enlace secreto.
 *
 * Cerrado por defecto: el sitio solo se abre con `SITE_PUBLIC=true`. Si falta la
 * variable, sigue cerrado. Se usa desde `src/proxy.ts` y desde el servidor.
 */

export const PRELAUNCH_PAGE = "/proximamente";
export const ACCESS_ROUTE = "/acceso";
export const PRELAUNCH_COOKIE = "censo-prelanzamiento";
/** El enlace secreto da acceso a ese navegador durante 90 días. */
export const PRELAUNCH_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
/** Una llave más corta se ignora: nadie entra hasta configurar una segura. */
const MIN_KEY_LENGTH = 32;

/** Encabezado que pide a los buscadores no mostrar el sitio. */
export const NO_INDEX_HEADER = ["X-Robots-Tag", "noindex, nofollow"] as const;

export function isSitePublic(): boolean {
  return process.env.SITE_PUBLIC === "true";
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/** Compara sin revelar por el tiempo de respuesta cuántos caracteres coinciden. */
function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function accessKey(): string | null {
  const key = process.env.PRELAUNCH_ACCESS_KEY;
  return key && key.length >= MIN_KEY_LENGTH ? key : null;
}

/** Valor de la cookie de acceso. Guarda una huella de la llave, nunca la llave. */
export async function accessCookieValue(): Promise<string | null> {
  const key = accessKey();
  return key ? sha256Hex(`censo-prelanzamiento:${key}`) : null;
}

/** ¿La llave del enlace secreto es la correcta? */
export async function isValidAccessKey(candidate: string | null) {
  const key = accessKey();
  if (!key || !candidate) return false;
  // Se comparan huellas del mismo largo, no los textos originales.
  return sameText(await sha256Hex(candidate), await sha256Hex(key));
}

/** ¿Este navegador puede ver el sitio? Siempre `true` una vez lanzado. */
export async function hasPrelaunchAccess(cookie: string | undefined) {
  if (isSitePublic()) return true;
  const expected = await accessCookieValue();
  return Boolean(expected && cookie && sameText(cookie, expected));
}
