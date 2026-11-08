import type { Metadata } from "next";
import { VoteScreen } from "@/components/vote/vote-screen";

export const metadata: Metadata = {
  title: "Registra tu voto · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/** Destino del usuario que inició sesión: el formulario de voto. */
export default function CuentaPage() {
  return <VoteScreen />;
}
