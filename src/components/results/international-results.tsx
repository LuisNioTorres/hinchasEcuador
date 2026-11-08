"use client";

import { useId, useState } from "react";
import {
  ChoroplethMap,
  type MapRegion,
} from "@/components/results/choropleth-map";
import { PanelTitle } from "@/components/results/panel-layout";
import { RankingTable } from "@/components/results/ranking-table";
import { useResultsData } from "@/components/results/results-data";
import { TopFive } from "@/components/results/top-five";
import {
  WORLD_CONTINENTS,
  WORLD_MAP_VIEWBOX,
} from "@/components/results/world-map-data";
import { formatVoteCount, type Ranking } from "@/lib/results/rankings";
import { clubOf } from "@/mocks/catalog-lookup";

const NO_VOTES: Ranking = { total: 0, entries: [] };

/** TWO_COLUMNS con el ancho de cada bloque intercambiado: el Top 5 conserva el suyo. */
const COLUMNS =
  "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-[clamp(2rem,4vw,4.5rem)] tablet:landscape:grid-cols-2 tablet:landscape:gap-6";

/** El mapa mundial es apaisado: en lg+ tiene el mismo alto que los otros mapas. */
const WORLD_MAP_FRAME =
  "aspect-[6/5] w-full max-[22rem]:aspect-square sm:aspect-[16/10] tablet:landscape:aspect-[6/5] lg:aspect-auto lg:h-[clamp(30rem,36vw,38rem)]";

/**
 * Resultados de los hinchas que viven fuera del Ecuador, por continente
 * (docs/DATOS_INFORMATION.md, Módulo 5: vista_ranking_continental).
 */
export function InternationalResults() {
  const id = useId();
  const { continentRankings } = useResultsData();
  const rankingOf = (continent: string) =>
    continentRankings.get(continent) ?? NO_VOTES;
  const regions: MapRegion[] = WORLD_CONTINENTS.map((continent) => {
    const lead = rankingOf(continent.id).entries[0];
    return {
      id: continent.id,
      name: continent.name,
      d: continent.d,
      leader: lead ? clubOf(lead.clubId) : null,
      percentage: lead?.percentage ?? 0,
      votes: lead?.votes ?? 0,
    };
  });
  // Al abrir, el continente con más votos; en empate, alfabético.
  const [continentId, setContinentId] = useState<string>(
    () =>
      [...WORLD_CONTINENTS].sort(
        (a, b) =>
          rankingOf(b.id).total - rankingOf(a.id).total ||
          a.name.localeCompare(b.name, "es"),
      )[0]?.id ?? "",
  );
  const ranking = rankingOf(continentId);
  const name = WORLD_CONTINENTS.find((c) => c.id === continentId)?.name ?? "";

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

      <div className={`mt-6 ${COLUMNS}`}>
        {/* Primero en el código: a la izquierda en dos columnas y arriba en una. */}
        <div>
          <PanelTitle
            title="Elige un continente"
            subtitle="Toca un continente para ver sus resultados."
          />
          <ChoroplethMap
            regions={regions}
            width={WORLD_MAP_VIEWBOX.width}
            height={WORLD_MAP_VIEWBOX.height}
            regionNoun="continente"
            hint="Toca un continente para ver sus resultados."
            selectedId={continentId}
            onSelect={setContinentId}
            className={WORLD_MAP_FRAME}
          />
        </div>
        <div>
          <PanelTitle
            title={`Top 5 de ${name}`}
            subtitle={`Sobre ${formatVoteCount(ranking.total)} de hinchas que viven en este continente.`}
          />
          <TopFive entries={ranking.entries} title={`Top 5 de ${name}`} />
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
  const { internationalRanking } = useResultsData();
  const [scope, setScope] = useState<Scope>("nacional");
  const international = scope === "internacional";

  return (
    <RankingTable
      ranking={international ? internationalRanking : national}
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
