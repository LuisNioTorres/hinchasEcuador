import type { Metadata } from "next";
import { AuthPanelHeader, AuthShell } from "@/components/login/auth-shell";
import { LoginForm } from "@/components/login/login-form";

export const metadata: Metadata = {
  title: "Inicia sesión · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Inicio de sesión, al que dirige el botón VOTAR. */
export default function VotarPage() {
  return (
    <AuthShell>
      <AuthPanelHeader title="Inicia sesión">
        Entra con tu cuenta de Google o con tu correo.
      </AuthPanelHeader>
      <div className="mt-7 wide:mt-5">
        <LoginForm />
      </div>
    </AuthShell>
  );
}
