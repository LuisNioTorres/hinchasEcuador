import { TOP_FIVE_ROW_HEIGHT } from "@/components/home/results/top-five-list";
import type { ResultsStatus } from "@/mocks/national-results";

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
        <ul
          className="flex flex-col gap-3 phone:gap-3.5 lg:gap-[1.67vw]"
          aria-hidden="true"
        >
          {ROWS.map((row) => (
            <li
              key={row}
              className={`animate-pulse border-4 border-black/15 bg-black/5 motion-reduce:animate-none phone:border-[3px] lg:border-[length:max(3px,0.21vw)] ${TOP_FIVE_ROW_HEIGHT}`}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex h-72 items-center justify-center border-4 border-black bg-white px-6 text-center text-lg font-semibold phone:border-[3px] tablet:h-[22rem] wide:h-64 lg:h-[29.06vw] lg:border-[length:max(3px,0.21vw)] lg:text-[1.46vw]"
    >
      {MESSAGES[status]}
    </div>
  );
}
