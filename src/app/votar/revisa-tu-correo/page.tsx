import type { Metadata } from "next";
import { AuthShell } from "@/components/login/auth-shell";
import { CheckEmailPanel } from "@/components/login/check-email-panel";

export const metadata: Metadata = {
  title: "Revisa tu correo · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

export default function RevisaTuCorreoPage() {
  return (
    <AuthShell>
      <CheckEmailPanel />
    </AuthShell>
  );
}
