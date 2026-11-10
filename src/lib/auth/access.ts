import { AUTH_ROUTES } from "@/lib/auth/routes";

export type AccessState =
  { signedIn: false } | { signedIn: true; hasName: boolean; hasVoted: boolean };

/** La página que le corresponde a cada usuario (docs/DATOS_INFORMATION.md, Módulo 3). */
export function destinationFor(state: AccessState): string {
  if (!state.signedIn) return AUTH_ROUTES.login;
  if (state.hasVoted) return AUTH_ROUTES.results;
  return state.hasName ? AUTH_ROUTES.loggedIn : AUTH_ROUTES.name;
}

/**
 * Quién puede ver cada página protegida, según su destino. "Enlace no válido" no está:
 * se muestra siempre, también con una sesión abierta, para que un enlace rechazado
 * nunca parezca haber dado acceso.
 */
const PAGE_AUDIENCE: Readonly<Record<string, string>> = {
  [AUTH_ROUTES.login]: AUTH_ROUTES.login,
  [AUTH_ROUTES.checkEmail]: AUTH_ROUTES.login,
  [AUTH_ROUTES.name]: AUTH_ROUTES.name,
  [AUTH_ROUTES.loggedIn]: AUTH_ROUTES.loggedIn,
  [AUTH_ROUTES.results]: AUTH_ROUTES.results,
  [AUTH_ROUTES.userInfo]: AUTH_ROUTES.results,
};

/** A dónde redirigir, o `null` si el usuario puede ver la página. */
export function redirectFor(path: string, state: AccessState): string | null {
  const audience = PAGE_AUDIENCE[path];
  if (!audience) return null;
  const destination = destinationFor(state);
  return audience === destination ? null : destination;
}
