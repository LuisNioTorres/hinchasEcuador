"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { AuthPanelHeader } from "@/components/login/auth-shell";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";

/**
 * Destino del enlace mágico. Se comprueba desde esta página, y no al abrir la URL en
 * el servidor, para que los filtros de correo que revisan enlaces no lo gasten. Si
 * venció o ya se usó, pasa a "Enlace no válido".
 */
export function ConfirmPanel() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const tokenHash = new URLSearchParams(window.location.search).get(
      "token_hash",
    );
    // Navegación completa: no depende del router del navegador.
    if (!tokenHash) {
      window.location.replace(AUTH_ROUTES.expiredLink);
      return;
    }
    createClient()
      .auth.verifyOtp({ token_hash: tokenHash, type: "email" })
      .then(({ error }) => {
        window.location.replace(
          error ? AUTH_ROUTES.expiredLink : AUTH_ROUTES.login,
        );
      })
      .catch(() => window.location.replace(AUTH_ROUTES.expiredLink));
  }, []);

  return (
    <div role="status">
      <AuthPanelHeader
        icon={
          <LoaderCircle
            aria-hidden="true"
            className="size-7 animate-spin motion-reduce:animate-none wide:size-6"
          />
        }
        title="Verificando tu acceso…"
      >
        <p>Un momento, estamos confirmando tu enlace.</p>
      </AuthPanelHeader>
    </div>
  );
}
