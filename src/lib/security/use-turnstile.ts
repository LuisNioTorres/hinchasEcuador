"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Textos de la comprobación (el de robot lo aprobó el dueño el 2026-11-10). */
export const CAPTCHA_TEXT = {
  robot: "No pudimos comprobar que no eres un robot. Inténtalo de nuevo.",
  offline:
    "No pudimos conectar. Revisa tu conexión a internet e inténtalo de nuevo.",
  checkbox: "Un paso más: marca la casilla de abajo para continuar.",
} as const;

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Tiempo máximo de una comprobación silenciosa (sin casilla). Pasado ese tiempo,
 * Cloudflare no responde y se avisa de la conexión. Mientras la casilla espera a la
 * persona no hay límite.
 */
const SILENT_CHECK_LIMIT_MS = 30_000;

type TurnstileOptions = {
  sitekey: string;
  appearance: "interaction-only";
  size: "flexible";
  theme: "light";
  language: string;
  execution: "render" | "execute";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  "before-interactive-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  execute: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

/** Carga el script de Cloudflare una sola vez por página (y otra vez si falló). */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    const fail = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("Turnstile no se cargó."));
    };
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : fail();
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * - `loading`: el script aún no llega. `idle`: listo, sin comprobar (modo `onDemand`).
 * - `checking`: comprobando en silencio. `interactive`: la casilla espera a la persona.
 * - `ready`: hay un comprobante. `failed`: Cloudflare lo rechazó.
 * - `unavailable`: no se pudo cargar Cloudflare (sin conexión o bloqueado).
 */
type Status =
  | "loading"
  | "idle"
  | "checking"
  | "interactive"
  | "ready"
  | "failed"
  | "unavailable";

export type CaptchaCheck =
  | { ok: true; token: string }
  | { ok: false; reason: "checkbox" | "robot" | "offline" };

/**
 * Comprobación "no soy un robot" de Cloudflare Turnstile. Trabaja en segundo plano y
 * solo muestra la casilla (en `containerRef`) si Cloudflare la pide.
 *
 * - Por defecto comprueba al cargar, para que el comprobante esté listo al pulsar el
 *   botón (inicio de sesión y voto).
 * - Con `onDemand`, comprueba solo al llamar a `check()` ("Reenviar", que es
 *   secundario): quien no lo usa nunca ve la casilla.
 *
 * `check()` entrega un comprobante de un solo uso. Si la casilla espera, devuelve
 * `checkbox`, deja `awaiting` en `true` y la lleva a la vista; cuando la persona la
 * marca (o Cloudflare falla), llama a `onResume` para que la pantalla repita la acción
 * con los datos de ese momento. Así nunca se envía nada sin comprobante, y nada se
 * queda esperando a ciegas.
 *
 * Quien valida el comprobante es el servidor (Supabase al pedir el correo,
 * `src/lib/security/turnstile.ts` al votar): esto solo lo obtiene.
 */
export function useTurnstile({
  onDemand = false,
  onResume,
}: {
  onDemand?: boolean;
  onResume: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ api: TurnstileApi; id: string } | null>(null);
  const statusRef = useRef<Status>("loading");
  const tokenRef = useRef<string | null>(null);
  /** El comprobante actual ya se entregó: hay que pedir otro antes de reutilizar. */
  const usedRef = useRef(false);
  /** En modo `onDemand`, se pidió comprobar antes de que el widget existiera. */
  const wantedRef = useRef(false);
  const awaitingRef = useRef(false);
  const listenersRef = useRef(new Set<() => void>());
  const initRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const onResumeRef = useRef(onResume);
  const [status, setStatus] = useState<Status>("loading");
  const [awaiting, setAwaiting] = useState(false);

  useEffect(() => {
    onResumeRef.current = onResume;
  });

  const update = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
    listenersRef.current.forEach((listener) => listener());
  }, []);

  /** La casilla dejó de esperar (aprobada o fallida): la pantalla repite la acción. */
  const resume = useCallback(() => {
    if (!awaitingRef.current) return;
    awaitingRef.current = false;
    setAwaiting(false);
    // Después de que React pinte el nuevo estado.
    window.setTimeout(() => onResumeRef.current(), 0);
  }, []);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    let cancelled = false;

    const init = async () => {
      const container = containerRef.current;
      if (!siteKey || !container) {
        console.error("Turnstile: falta NEXT_PUBLIC_TURNSTILE_SITE_KEY.");
        update("unavailable");
        return;
      }
      if (widgetRef.current) return;
      update("loading");
      let api: TurnstileApi;
      try {
        api = await loadTurnstile();
      } catch {
        if (!cancelled) update("unavailable");
        return;
      }
      if (cancelled) return;
      const id = api.render(container, {
        sitekey: siteKey,
        appearance: "interaction-only",
        size: "flexible",
        theme: "light",
        language: "es",
        execution: onDemand ? "execute" : "render",
        callback: (token) => {
          tokenRef.current = token;
          usedRef.current = false;
          update("ready");
          resume();
        },
        "expired-callback": () => {
          // Cloudflare renueva solo el comprobante vencido.
          tokenRef.current = null;
          update(onDemand ? "idle" : "checking");
        },
        "before-interactive-callback": () => update("interactive"),
        "error-callback": () => {
          tokenRef.current = null;
          update("failed");
          resume();
        },
      });
      widgetRef.current = { api, id };
      if (onDemand && wantedRef.current) {
        wantedRef.current = false;
        update("checking");
        api.execute(id);
      } else {
        update(onDemand ? "idle" : "checking");
      }
    };
    initRef.current = init;
    void init();

    return () => {
      cancelled = true;
      const widget = widgetRef.current;
      widgetRef.current = null;
      tokenRef.current = null;
      if (widget) widget.api.remove(widget.id);
    };
  }, [onDemand, update, resume]);

  /** Lleva la casilla a la vista (en móvil puede quedar debajo del borde). */
  const reveal = useCallback(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    containerRef.current?.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  const check = useCallback(async (): Promise<CaptchaCheck> => {
    if (statusRef.current === "unavailable") await initRef.current();

    const widget = widgetRef.current;
    if (widget && (usedRef.current || statusRef.current === "failed")) {
      // Comprobante ya usado o rechazado: se pide uno nuevo.
      const failed = statusRef.current === "failed";
      usedRef.current = false;
      tokenRef.current = null;
      widget.api.reset(widget.id);
      update(onDemand ? "idle" : "checking");
      if (failed) return { ok: false, reason: "robot" };
    }
    if (onDemand && statusRef.current === "idle") {
      if (widget) {
        update("checking");
        widget.api.execute(widget.id);
      } else {
        wantedRef.current = true;
      }
    }

    const result = await new Promise<CaptchaCheck>((resolve) => {
      let timer: number | undefined;
      const finish = (value: CaptchaCheck) => {
        listenersRef.current.delete(evaluate);
        window.clearTimeout(timer);
        resolve(value);
      };
      function evaluate() {
        const current = statusRef.current;
        if (current === "ready" && tokenRef.current) {
          const token = tokenRef.current;
          tokenRef.current = null;
          usedRef.current = true;
          finish({ ok: true, token });
        } else if (current === "interactive") {
          finish({ ok: false, reason: "checkbox" });
        } else if (current === "failed") {
          finish({ ok: false, reason: "robot" });
        } else if (current === "unavailable") {
          finish({ ok: false, reason: "offline" });
        }
      }
      listenersRef.current.add(evaluate);
      evaluate();
      if (listenersRef.current.has(evaluate)) {
        timer = window.setTimeout(
          () => finish({ ok: false, reason: "offline" }),
          SILENT_CHECK_LIMIT_MS,
        );
      }
    });

    if (!result.ok && result.reason === "checkbox") {
      awaitingRef.current = true;
      setAwaiting(true);
      reveal();
    }
    return result;
  }, [onDemand, update, reveal]);

  return {
    containerRef,
    check,
    /** La persona pulsó el botón y la casilla la espera: mostrar `CaptchaHint`. */
    awaiting,
    /** La casilla está a la vista: solo entonces ocupa espacio. */
    visible: status === "interactive",
  };
}
