import { useMemo, useSyncExternalStore } from "react";
import { clearSessionStatus } from "@/lib/auth/simulated-session";
import { forgetEmail } from "@/lib/auth/simulation";

/**
 * SIMULACIÓN DEL PERFIL — solo para revisar el diseño, y solo desde componentes de
 * cliente. Guarda el nombre editado en esta pestaña. Al conectar Supabase Auth se
 * reemplaza por el perfil real del servidor y `supabase.auth.signOut()`, y este
 * archivo se elimina. El nombre nunca interviene en el voto.
 */
export type ProfileName = { firstName: string; lastName: string };

const NAME_KEY = "censo-perfil-nombre";
const CHANGE_EVENT = "censo-perfil-cambio";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function readStoredName(): string | null {
  try {
    return sessionStorage.getItem(NAME_KEY);
  } catch {
    return null;
  }
}

/** El nombre editado, o `null` si todavía no se ha cambiado. */
export function useEditedName(): ProfileName | null {
  const stored = useSyncExternalStore(subscribe, readStoredName, () => null);
  return useMemo(
    () => (stored ? (JSON.parse(stored) as ProfileName) : null),
    [stored],
  );
}

export function saveEditedName(name: ProfileName) {
  try {
    sessionStorage.setItem(NAME_KEY, JSON.stringify(name));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Sin almacenamiento (modo privado estricto): el cambio dura solo en pantalla.
  }
}

/** Olvida lo que esta pestaña recuerda de la cuenta. */
export function clearSimulatedSession() {
  forgetEmail();
  clearSessionStatus();
  try {
    sessionStorage.removeItem(NAME_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Sin almacenamiento: no hay nada que borrar.
  }
}
