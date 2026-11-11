import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanelHeader, AuthShell } from "@/components/login/auth-shell";
import { LoginForm } from "@/components/login/login-form";
import { PRIVACY_PAGE } from "@/lib/prelaunch";

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
      {/* Fuera del formulario: no se cruza con la casilla de Cloudflare ni con los errores. */}
      <p className="mt-5 text-center wide:mt-3">
        <Link
          href={PRIVACY_PAGE}
          className="inline-flex h-10 items-center rounded-full px-3 text-xs font-semibold text-black/60 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black hover:decoration-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
        >
          Política de privacidad
        </Link>
      </p>
    </AuthShell>
  );
}
