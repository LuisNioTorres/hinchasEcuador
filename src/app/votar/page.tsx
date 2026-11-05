import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Página provisional en blanco ("página quemada") a la que dirige el botón VOTAR.
 * Los destinos definitivos (registro, inicio de sesión, inicio de usuario
 * logueado) se implementarán en un hito posterior.
 */
export default function VotarPage() {
  return <main className="min-h-svh bg-white" />;
}
