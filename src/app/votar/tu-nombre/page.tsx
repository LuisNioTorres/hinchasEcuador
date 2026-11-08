import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { AuthPanelHeader, AuthShell } from "@/components/login/auth-shell";
import { NameForm } from "@/components/login/name-form";

export const metadata: Metadata = {
  title: "Tu nombre · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Último paso de quien entra con correo. */
export default function TuNombrePage() {
  return (
    <AuthShell>
      <AuthPanelHeader
        icon={<UserRound aria-hidden="true" className="size-7 wide:size-6" />}
        title="¿Cómo te llamas?"
      >
        <p>Es lo último que necesitamos para registrarte en el censo.</p>
      </AuthPanelHeader>
      <div className="mt-7 wide:mt-5">
        <NameForm />
      </div>
    </AuthShell>
  );
}
