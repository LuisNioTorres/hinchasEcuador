"use client";

import { useEffect } from "react";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { fetchSessionStatus } from "@/lib/auth/session-client";
import {
  broadcastSession,
  flagAccountChanged,
  listenSession,
} from "@/lib/auth/session-sync";

/** Cada cuánto se revisa la sesión mientras la pestaña está a la vista. */
const CHECK_EVERY_MS = 60_000;
/** Evita revisar varias veces seguidas (foco + pestaña visible llegan juntos). */
const MIN_GAP_MS = 3_000;

/**
 * La pestaña ya va camino a otra pantalla. Mientras carga, la página sigue a la vista
 * y se puede tocar: con esto no se envía nada más desde ella.
 */
let leaving = false;

function leaveTo(destination: "reload" | string) {
  leaving = true;
  if (destination === "reload") window.location.reload();
  else window.location.replace(destination);
}

/**
 * Mantiene la pestaña al día con la sesión del navegador, que comparten todas las
 * pestañas. Comprueba en el servidor al volver a la pestaña, al recibir el aviso de
 * otra pestaña y cada minuto mientras se ve.
 *
 * - `expectedUserId` = cuenta que muestra la pantalla. Si se cerró la sesión, vuelve
 *   al registro; si es otra cuenta, recarga y avisa.
 * - `expectedUserId` = `null` (pantallas de registro). Si ya hay sesión, lleva a la
 *   pantalla que le corresponde (la decide `src/proxy.ts`).
 *
 * Solo actualiza lo que se ve: la seguridad la da el servidor en cada acción.
 */
export function useSessionGuard(expectedUserId: string | null) {
  useEffect(() => {
    let stopped = false;
    let checking = false;
    let lastCheck = 0;

    const check = async (force = false) => {
      if (stopped || checking) return;
      if (!force && document.visibilityState !== "visible") return;
      if (!force && Date.now() - lastCheck < MIN_GAP_MS) return;
      checking = true;
      lastCheck = Date.now();
      try {
        const session = await fetchSessionStatus();
        if (stopped || session.status === "unknown") return;
        const currentUserId =
          session.status === "signed-in" ? session.userId : null;
        if (currentUserId === expectedUserId) return;

        stopped = true;
        if (expectedUserId && currentUserId) {
          flagAccountChanged();
          leaveTo("reload");
        } else {
          leaveTo(AUTH_ROUTES.login);
        }
      } catch {
        // Sin conexión: se vuelve a intentar en la próxima revisión.
      } finally {
        checking = false;
      }
    };

    const onReturn = () => void check();
    // Volver con "atrás" puede mostrar una copia guardada de la página: se recarga
    // para que la protección de páginas decida con la sesión de ahora.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) leaveTo("reload");
    };
    const stopListening = listenSession((message) => {
      const userId = message.type === "active" ? message.userId : null;
      if (userId !== expectedUserId) void check(true);
    });
    if (expectedUserId) {
      broadcastSession({ type: "active", userId: expectedUserId });
    }

    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    window.addEventListener("pageshow", onPageShow);
    const timer = window.setInterval(onReturn, CHECK_EVERY_MS);

    return () => {
      stopped = true;
      stopListening();
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
      window.removeEventListener("pageshow", onPageShow);
      window.clearInterval(timer);
    };
  }, [expectedUserId]);
}

/**
 * Para las pantallas de registro, justo antes de pedir un correo, abrir Google o
 * verificar un código: si el navegador ya tiene sesión (abierta en otra pestaña), no
 * hace nada y lleva a la pantalla que le corresponde. Devuelve `true` en ese caso.
 * Si no se puede comprobar, deja seguir: la acción falla sola si no hay conexión.
 */
export async function goOnIfSignedIn(): Promise<boolean> {
  if (leaving) return true;
  try {
    const session = await fetchSessionStatus();
    if (session.status !== "signed-in") return leaving;
  } catch {
    return leaving;
  }
  leaveTo(AUTH_ROUTES.login);
  return true;
}
