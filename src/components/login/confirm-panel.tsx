"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { AuthPanelHeader } from "@/components/login/auth-shell";
import { AUTH_ROUTES, SIMULATED_DELAY_MS } from "@/lib/auth/simulation";

/**
 * Destino del enlace mágico mientras se comprueba. SIMULACIÓN: siempre sale bien y
 * pasa a "Tu nombre". Con la autenticación real, si el enlace venció o ya se usó,
 * se redirige a "Enlace no válido".
 */
export function ConfirmPanel() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(
      () => router.replace(AUTH_ROUTES.name),
      SIMULATED_DELAY_MS * 1.5,
    );
    return () => clearTimeout(timer);
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
