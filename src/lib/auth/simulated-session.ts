import { useSyncExternalStore } from "react";
import { AUTH_ROUTES } from "@/lib/auth/simulation";

/**
 * SIMULACIÓN DE LA SESIÓN — solo desde componentes de cliente. Recuerda en este
 * dispositivo si hay sesión y si ya se votó, aunque se cierre el navegador. Con
 * Supabase Auth, el estado saldrá en el servidor de la sesión y de
 * `profiles.ha_votado`; `destinationFor` sigue valiendo.
 */
export type SessionStatus = "sin-sesion" | "sin-votar" | "ya-voto";

/** A dónde lleva VOTAR en cada caso (docs/DATOS_INFORMATION.md, Módulo 3). */
export function destinationFor(status: SessionStatus) {
  if (status === "ya-voto") return AUTH_ROUTES.results;
  if (status === "sin-votar") return AUTH_ROUTES.loggedIn;
  return AUTH_ROUTES.login;
}

const STATUS_KEY = "censo-sesion-simulada";
const CHANGE_EVENT = "censo-sesion-cambio";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStatus(): SessionStatus {
  try {
    const stored = localStorage.getItem(STATUS_KEY);
    return stored === "sin-votar" || stored === "ya-voto"
      ? stored
      : "sin-sesion";
  } catch {
    return "sin-sesion";
  }
}

function writeStatus(status: SessionStatus | null) {
  try {
    if (status) localStorage.setItem(STATUS_KEY, status);
    else localStorage.removeItem(STATUS_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Sin almacenamiento (modo privado estricto): VOTAR lleva al login.
  }
}

export function useSessionStatus() {
  return useSyncExternalStore(
    subscribe,
    readStatus,
    () => "sin-sesion" as const,
  );
}

/** Llegó al formulario con sesión. No retrocede a quien ya votó. */
export function markSignedIn() {
  if (readStatus() === "sin-sesion") writeStatus("sin-votar");
}

export function markVoted() {
  writeStatus("ya-voto");
}

export function clearSessionStatus() {
  writeStatus(null);
}
