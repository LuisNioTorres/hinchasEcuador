"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const tokenHash = new URLSearchParams(window.location.search).get(
      "token_hash",
    );
    if (!tokenHash) {
      router.replace(AUTH_ROUTES.expiredLink);
      return;
    }
    createClient()
      .auth.verifyOtp({ token_hash: tokenHash, type: "email" })
      .then(({ error }) => {
        if (error) router.replace(AUTH_ROUTES.expiredLink);
        else window.location.assign(AUTH_ROUTES.login);
      });
  }, [router]);

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
