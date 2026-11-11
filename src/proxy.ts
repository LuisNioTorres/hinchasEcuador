import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { redirectFor, type AccessState } from "@/lib/auth/access";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { ownerAssets } from "@/config/owner-assets";
import {
  ACCESS_ROUTE,
  NO_INDEX_HEADER,
  PRELAUNCH_COOKIE,
  PRELAUNCH_PAGE,
  hasPrelaunchAccess,
  isSitePublic,
} from "@/lib/prelaunch";
import { getSupabaseEnv } from "@/lib/supabase/env";

/** Páginas de acceso y privadas: se comprueba en el servidor a quién le toca verlas. */
const PROTECTED_PAGES: ReadonlySet<string> = new Set([
  AUTH_ROUTES.login,
  AUTH_ROUTES.checkEmail,
  AUTH_ROUTES.name,
  AUTH_ROUTES.loggedIn,
  AUTH_ROUTES.results,
  AUTH_ROUTES.userInfo,
]);

/** Lo único que "Próximamente" necesita, además de `/_next/static`. */
const PRELAUNCH_ASSETS: ReadonlySet<string> = new Set([
  ownerAssets.companyIcon.src,
]);

const isRead = (request: NextRequest) =>
  request.method === "GET" || request.method === "HEAD";

/**
 * Modo pre-lanzamiento (`src/lib/prelaunch.ts`). Sin acceso, cualquier página muestra
 * "Próximamente" (sin cambiar la dirección) y cualquier envío se rechaza, incluido el
 * voto. Devuelve `null` si el navegador puede seguir.
 */
async function prelaunchGate(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === ACCESS_ROUTE) return null;
  if (await hasPrelaunchAccess(request.cookies.get(PRELAUNCH_COOKIE)?.value)) {
    return null;
  }

  let response: NextResponse;
  if (!isRead(request)) {
    response = new NextResponse(null, { status: 403 });
  } else if (pathname === PRELAUNCH_PAGE) {
    response = NextResponse.next();
  } else if (pathname === "/_next/image") {
    // Las imágenes optimizadas: solo el logo de "Próximamente".
    response = PRELAUNCH_ASSETS.has(searchParams.get("url") ?? "")
      ? NextResponse.next()
      : new NextResponse(null, { status: 404 });
  } else if (PRELAUNCH_ASSETS.has(pathname)) {
    response = NextResponse.next();
  } else if (/\.[a-z0-9]+$/i.test(pathname)) {
    // Archivos públicos (imágenes, etc.): no se muestran antes del lanzamiento.
    response = new NextResponse(null, { status: 404 });
  } else {
    response = NextResponse.rewrite(new URL(PRELAUNCH_PAGE, request.url));
  }
  response.headers.set(...NO_INDEX_HEADER);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

/**
 * Antes de mostrar una página de acceso o privada, renueva la sesión y comprueba en
 * el servidor a quién le corresponde verla.
 */
async function authGate(request: NextRequest) {
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
  if (!isRead(request)) return response;

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isSitePublic()) {
    // Ya lanzado, "Próximamente" no tiene sentido: a la portada.
    if (pathname === PRELAUNCH_PAGE) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    const blocked = await prelaunchGate(request);
    if (blocked) return blocked;
  }

  const response = PROTECTED_PAGES.has(pathname)
    ? await authGate(request)
    : NextResponse.next();
  // Mientras no se lance, tampoco se indexa lo que ve el dueño.
  if (!isSitePublic()) response.headers.set(...NO_INDEX_HEADER);
  return response;
}

export const config = {
  // Todas las rutas salvo el código y los estilos del sitio (los necesita
  // "Próximamente"). Las imágenes optimizadas sí pasan, para filtrarlas.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
