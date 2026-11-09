import {
  TOP_FIVE_GAP,
  TOP_FIVE_PLACEHOLDER_ROW,
} from "@/components/home/results/top-five-list";
import type { ResultsStatus } from "@/lib/results/types";

interface ResultsStateProps {
  status: Exclude<ResultsStatus, "ok">;
}

/**
 * Estados no nominales del área de resultados (error de datos, sin conexión,
 * cargando). Mantienen la línea visual del TOP 5: mismas filas con borde negro.
 * Textos PROVISIONALES pendientes de aprobación del dueño.
 */
const MESSAGES: Record<"error" | "offline", string> = {
  error: "No se pudieron cargar los resultados.",
  offline: "Sin conexión. Revisa tu conexión a internet.",
};

const ROWS = [0, 1, 2, 3, 4] as const;

export function ResultsState({ status }: ResultsStateProps) {
  if (status === "loading") {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Cargando resultados…</span>
        <ul className={`flex flex-col ${TOP_FIVE_GAP}`} aria-hidden="true">
          {ROWS.map((row) => (
            <li
              key={row}
              className={`animate-pulse motion-reduce:animate-none ${TOP_FIVE_PLACEHOLDER_ROW}`}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex h-72 items-center justify-center border-4 border-black bg-white px-6 text-center text-lg font-semibold phone:h-[calc(5*var(--top-row)+1.5rem)] phone:rounded-lg phone:border phone:border-black/40 phone:text-base tablet:h-[22rem] tablet:rounded-xl tablet:border tablet:border-black/40 wide:h-64 lg:h-[29.06vw] lg:rounded-[0.95vw] lg:border lg:border-black/40 lg:text-[1.46vw]"
    >
      {MESSAGES[status]}
    </div>
  );
}
