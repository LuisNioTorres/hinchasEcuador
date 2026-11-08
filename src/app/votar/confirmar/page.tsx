import type { Metadata } from "next";
import { AuthShell } from "@/components/login/auth-shell";
import { ConfirmPanel } from "@/components/login/confirm-panel";

export const metadata: Metadata = {
  title: "Verificando tu acceso · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Adonde lleva el botón "Iniciar sesión" del correo. */
export default function ConfirmarPage() {
  return (
    <AuthShell>
      <ConfirmPanel />
    </AuthShell>
  );
}
