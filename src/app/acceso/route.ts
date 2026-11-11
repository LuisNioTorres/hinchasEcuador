import { NextResponse, type NextRequest } from "next/server";
import {
  NO_INDEX_HEADER,
  PRELAUNCH_COOKIE,
  PRELAUNCH_COOKIE_MAX_AGE,
  accessCookieValue,
  isValidAccessKey,
} from "@/lib/prelaunch";

/**
 * Enlace secreto del dueño durante el pre-lanzamiento: `/acceso?clave=…`. Con la llave
 * correcta deja una cookie de acceso en ese navegador; con cualquier otra cosa lleva
 * a la portada sin decir por qué (que no sirva para adivinar).
 */
export async function GET(request: NextRequest) {
  const home = NextResponse.redirect(new URL("/", request.url));
  home.headers.set(...NO_INDEX_HEADER);
  home.headers.set("Cache-Control", "no-store");
  // Que la llave no quede en el historial de otras páginas ni en el "Referer".
  home.headers.set("Referrer-Policy", "no-referrer");

  const candidate = request.nextUrl.searchParams.get("clave");
  if (!(await isValidAccessKey(candidate))) return home;

  const value = await accessCookieValue();
  if (!value) return home;
  home.cookies.set(PRELAUNCH_COOKIE, value, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: PRELAUNCH_COOKIE_MAX_AGE,
  });
  return home;
}
