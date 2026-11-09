"use client";

import { PRIMARY_BUTTON } from "@/components/login/auth-ui";

/** Si los resultados no se pueden leer, permite reintentar. */
export default function ResultadosError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-bone px-(--page-x) text-center font-montserrat">
      <p role="alert" className="text-lg font-semibold text-black">
        No se pudieron cargar los resultados.
      </p>
      <button
        type="button"
        onClick={reset}
        className={`max-w-60 ${PRIMARY_BUTTON}`}
      >
        Reintentar
      </button>
    </main>
  );
}
