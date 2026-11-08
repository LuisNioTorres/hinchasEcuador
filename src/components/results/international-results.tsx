"use client";

import { useId, useState } from "react";
import { Globe2 } from "lucide-react";
import { PanelTitle, TWO_COLUMNS } from "@/components/results/panel-layout";
import { RankingTable } from "@/components/results/ranking-table";
import { TopFive } from "@/components/results/top-five";
import { ClubBadge } from "@/components/vote/club-badge";
import {
  formatPercentage,
  formatVotes,
  type Ranking,
} from "@/lib/results/rankings";
import {
  CONTINENT_RANKINGS,
  INTERNATIONAL_RANKING,
} from "@/mocks/abroad-votes";
import { clubOf } from "@/mocks/catalog-lookup";
import { CONTINENTS } from "@/mocks/catalogs";

const rankingOf = (continentId: string): Ranking =>
  CONTINENT_RANKINGS.get(continentId) ?? { total: 0, entries: [] };

/** Continentes de más a menos votos; en empate, alfabético. */
const CONTINENTS_BY_VOTES = [...CONTINENTS].sort(
  (a, b) =>
    rankingOf(b.id).total - rankingOf(a.id).total ||
    a.name.localeCompare(b.name, "es"),
);

/**
 * Resultados de los hinchas que viven fuera del Ecuador, por continente
 * (docs/DATOS_INFORMATION.md, Módulo 5: vista_ranking_continental).
 */
export function InternationalResults() {
  const id = useId();
  const [continentId, setContinentId] = useState(
    CONTINENTS_BY_VOTES[0]?.id ?? "",
  );
  const ranking = rankingOf(continentId);
  const name = CONTINENTS.find((c) => c.id === continentId)?.name ?? "";

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="mt-12 border-t border-black/8 pt-10 lg:mt-14 lg:pt-12"
    >
      <h3
        id={`${id}-titulo`}
        className="font-tiro text-[clamp(1.75rem,6vw,2.5rem)] leading-none text-[#0b1f3f] italic uppercase"
      >
        Resultados internacionales
      </h3>
      <p className="mt-2 max-w-[38rem] text-[0.9375rem] text-black/60">
        Así votan los hinchas ecuatorianos que viven fuera del país, continente
        por continente.
      </p>

      <div className={`mt-6 ${TWO_COLUMNS}`}>
        <div>
          <PanelTitle
            title={`Top 5 de ${name}`}
            subtitle={`Sobre ${formatVotes(ranking.total)} votos de hinchas que viven en este continente.`}
          />
          {ranking.entries.length > 0 ? (
            <TopFive entries={ranking.entries} title={`Top 5 de ${name}`} />
          ) : (
            <div className="flex flex-col justify-center rounded-[1.75rem] border border-dashed border-results-blue/30 bg-white/70 p-6 sm:p-8">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#eef4fd] text-results-blue">
                <Globe2 aria-hidden="true" className="size-7" />
              </span>
              <p className="mt-5 text-xl font-bold tracking-tight">
                Sin votos todavía
              </p>
              <p className="mt-2 text-[0.9375rem] text-black/60">
                Aún no hay votos de hinchas en {name}.
              </p>
            </div>
          )}
        </div>

        {/* En una sola columna, primero se elige el continente. */}
        <div className="order-first lg:order-none tablet:landscape:order-none">
          <PanelTitle
            title="Elige un continente"
            subtitle="Ordenados de más a menos votos."
          />
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1 tablet:landscape:grid-cols-1">
            {CONTINENTS_BY_VOTES.map((continent) => {
              const result = rankingOf(continent.id);
              const lead = result.entries[0];
              const leader = lead ? clubOf(lead.clubId) : null;
              const selected = continent.id === continentId;
              return (
                <li key={continent.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setContinentId(continent.id)}
                    className={`flex h-full min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue lg:px-4 ${
                      selected
                        ? "border-brand-blue bg-[#eef4fd] shadow-[inset_0_0_0_1px_var(--color-brand-blue)]"
                        : "border-black/6 bg-white hover:bg-[#f4f8fe]"
                    }`}
                  >
                    {leader ? (
                      <ClubBadge club={leader} className="size-9 shrink-0" />
                    ) : (
                      <span className="size-9 shrink-0 rounded-full bg-[#E5E7EB]" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-tight font-bold">
                        {continent.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs text-black/60 ${leader ? "truncate" : ""}`}
                      >
                        {leader ? leader.name : "Sin votos todavía"}
                      </span>
                    </span>
                    {lead && (
                      <span className="shrink-0 text-right max-[30rem]:hidden">
                        <span className="block text-sm font-bold tabular-nums">
                          {formatPercentage(lead.percentage)}
                        </span>
                        <span className="block text-[0.6875rem] text-black/50 tabular-nums">
                          {formatVotes(result.total)} votos
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

type Scope = "nacional" | "internacional";

const SCOPES: { key: Scope; label: string }[] = [
  { key: "nacional", label: "Nacional" },
  { key: "internacional", label: "Internacional" },
];

/** Clasificación general: alterna entre los votos del Ecuador y los del exterior. */
export function GeneralRanking({ national }: { national: Ranking }) {
  const [scope, setScope] = useState<Scope>("nacional");
  const international = scope === "internacional";

  return (
    <RankingTable
      ranking={international ? INTERNATIONAL_RANKING : national}
      title={
        international ? "Clasificación internacional" : "Clasificación nacional"
      }
      description={
        international
          ? "Todos los equipos con votos desde el exterior, de más a menos votado."
          : "Todos los equipos con votos en el Ecuador, de más a menos votado."
      }
      toolbar={
        <div
          role="group"
          aria-label="Ámbito de la clasificación"
          className="mb-5 flex w-full rounded-full border border-black/10 bg-[#f7f9fd] p-1 sm:w-fit"
        >
          {SCOPES.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={scope === item.key}
              onClick={() => setScope(item.key)}
              className={`h-10 flex-1 cursor-pointer rounded-full px-5 text-[0.8125rem] font-bold tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue max-[22rem]:px-2 max-[22rem]:text-xs sm:flex-none ${
                scope === item.key
                  ? "bg-brand-blue text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      }
    />
  );
}
