import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página user logueado · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/**
 * Destino del usuario que inició sesión. Página provisional: su contenido
 * (resultados nacional, provincial y cantonal) todavía no está planeado.
 */
export default function CuentaPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-(--page-x) font-montserrat">
      <h1 className="text-center text-2xl font-bold text-black">
        PÁGINA USER LOGUEADO
      </h1>
    </main>
  );
}
