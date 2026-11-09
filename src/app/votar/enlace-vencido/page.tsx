import type { Metadata } from "next";
import Link from "next/link";
import { Link2Off } from "lucide-react";
import { AuthPanelHeader, AuthShell } from "@/components/login/auth-shell";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/login/auth-ui";
import { AUTH_ROUTES } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Enlace no válido · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Cuando el enlace del correo venció o ya se usó. */
export default function EnlaceVencidoPage() {
  return (
    <AuthShell>
      <AuthPanelHeader
        icon={<Link2Off aria-hidden="true" className="size-7 wide:size-6" />}
        title="Este enlace ya no es válido"
      >
        <p>
          Puede que haya vencido o que ya se haya usado. Si todavía tienes el
          código del correo, ingrésalo. Si no, pide un correo nuevo.
        </p>
      </AuthPanelHeader>
      <div className="mt-7 flex flex-col gap-3 wide:mt-5">
        <Link href={AUTH_ROUTES.login} className={PRIMARY_BUTTON}>
          Pedir un correo nuevo
        </Link>
        <Link href={AUTH_ROUTES.checkEmail} className={SECONDARY_BUTTON}>
          Ingresar el código
        </Link>
      </div>
    </AuthShell>
  );
}
