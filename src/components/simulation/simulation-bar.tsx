import Link from "next/link";
import { SCENARIOS } from "@/mocks/simulation";

/** Barra temporal para cambiar de escenario; solo existe en las rutas /simulacion/*. */
export function SimulationBar({
  scenarioId,
  page,
}: {
  scenarioId: string;
  page: "inicio" | "resultados";
}) {
  const votes = SCENARIOS.find((s) => s.id === scenarioId)?.votes.length ?? 0;
  const link = "shrink-0 rounded-full px-3 py-1.5 font-semibold";
  return (
    <>
      <div aria-hidden="true" className="h-14" />
      <nav
        aria-label="Simulación"
        className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center gap-1 overflow-x-auto bg-[#0b1f3f] px-3 font-montserrat text-xs text-white"
      >
        <span className="mr-2 shrink-0 font-bold">
          SIMULACIÓN · {votes} {votes === 1 ? "voto" : "votos"}
        </span>
        {SCENARIOS.map((s) => (
          <Link
            key={s.id}
            href={`/simulacion/${s.id}/${page}`}
            className={`${link} ${s.id === scenarioId ? "bg-white text-[#0b1f3f]" : "bg-white/10"}`}
          >
            {s.label}
          </Link>
        ))}
        <span className="mx-1 shrink-0 text-white/40">|</span>
        <Link
          href={`/simulacion/${scenarioId}/inicio`}
          className={`${link} ${page === "inicio" ? "bg-white text-[#0b1f3f]" : "bg-white/10"}`}
        >
          Página principal
        </Link>
        <Link
          href={`/simulacion/${scenarioId}/resultados`}
          className={`${link} ${page === "resultados" ? "bg-white text-[#0b1f3f]" : "bg-white/10"}`}
        >
          Usuario logueado
        </Link>
      </nav>
    </>
  );
}
