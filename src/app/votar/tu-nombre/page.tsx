import { Suspense } from "react";
import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { AuthPanelHeader, AuthShell } from "@/components/login/auth-shell";
import { NameForm } from "@/components/login/name-form";
import { requireAccount } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Tu nombre · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

async function TuNombre() {
  const account = await requireAccount();

  return (
    <AuthShell account={account}>
      <AuthPanelHeader
        icon={<UserRound aria-hidden="true" className="size-7 wide:size-6" />}
        title="¿Cómo te llamas?"
      >
        <p>Es lo último que necesitamos para registrarte en el censo.</p>
      </AuthPanelHeader>
      <div className="mt-7 wide:mt-5">
        <NameForm userId={account.userId} />
      </div>
    </AuthShell>
  );
}

/** Último paso de quien entra con correo. */
export default function TuNombrePage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-bone" />}>
      <TuNombre />
    </Suspense>
  );
}
