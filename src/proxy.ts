import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { redirectFor, type AccessState } from "@/lib/auth/access";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Antes de mostrar una página de acceso o privada, renueva la sesión y comprueba en
 * el servidor a quién le corresponde verla.
 */
export async function proxy(request: NextRequest) {
  const { url, publishableKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Las Server Functions se envían por POST a la misma ruta y validan la sesión por
  // su cuenta; redirigirlas aquí interrumpiría su respuesta.
  if (request.method !== "GET" && request.method !== "HEAD") return response;

  let state: AccessState = { signedIn: false };
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre, ha_votado")
      .eq("id", user.id)
      .single();
    // Si el perfil no se puede leer, se trata como sin sesión: nunca se abre de más.
    if (profile) {
      state = {
        signedIn: true,
        hasName: Boolean(profile.nombre),
        hasVoted: profile.ha_votado,
      };
    }
  }

  const target = redirectFor(request.nextUrl.pathname, state);
  if (!target) return response;

  const redirect = NextResponse.redirect(new URL(target, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: [
    "/votar",
    "/votar/revisa-tu-correo",
    "/votar/tu-nombre",
    "/cuenta",
    "/resultados",
    "/user-info",
  ],
};
