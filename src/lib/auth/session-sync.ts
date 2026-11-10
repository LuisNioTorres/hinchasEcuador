/**
 * Sincroniza las pestañas del mismo navegador. Todas comparten una sola sesión: si en
 * una se cierra sesión o se entra con otra cuenta, las demás deben enterarse.
 * Solo avisa; quién tiene la sesión lo decide siempre el servidor.
 */

const CHANNEL = "censo-sesion";
const NOTICE_KEY = "censo-cuenta-cambio";

export type SessionMessage =
  { type: "signed-out" } | { type: "active"; userId: string };

export function broadcastSession(message: SessionMessage) {
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage(message);
    channel.close();
  } catch {
    // Navegador sin BroadcastChannel: las pestañas se revisan al volver a ellas.
  }
}

export function listenSession(
  onMessage: (message: SessionMessage) => void,
): () => void {
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event: MessageEvent<SessionMessage>) =>
      onMessage(event.data);
    return () => channel.close();
  } catch {
    return () => {};
  }
}

/** Marca que la cuenta cambió, para avisarlo después de recargar la pestaña. */
export function flagAccountChanged() {
  try {
    sessionStorage.setItem(NOTICE_KEY, "1");
  } catch {
    // Sin almacenamiento: se recarga igual, solo que sin el aviso.
  }
}

let noticeOnLoad: boolean | undefined;

/** Si la cuenta cambió justo antes de cargar la página. Se lee una sola vez. */
export function accountChangedOnLoad(): boolean {
  if (noticeOnLoad === undefined) {
    try {
      noticeOnLoad = sessionStorage.getItem(NOTICE_KEY) === "1";
      sessionStorage.removeItem(NOTICE_KEY);
    } catch {
      noticeOnLoad = false;
    }
  }
  return noticeOnLoad;
}
