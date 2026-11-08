"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Info, MapPinned } from "lucide-react";
import {
  ECUADOR_MAP_VIEWBOX,
  ECUADOR_PROVINCES,
  GALAPAGOS_BOX,
} from "@/components/home/results/ecuador-map-data";
import {
  ChoroplethMap,
  MapLegend,
  type MapRegion,
} from "@/components/results/choropleth-map";
import type { ProvinceCantonMap } from "@/components/results/canton-map-data";
import {
  GeneralRanking,
  InternationalResults,
} from "@/components/results/international-results";
import { PanelTitle, TWO_COLUMNS } from "@/components/results/panel-layout";
import { RankingTable } from "@/components/results/ranking-table";
import { useResultsData } from "@/components/results/results-data";
import { TopFive } from "@/components/results/top-five";
import { Combobox, type ComboboxOption } from "@/components/vote/combobox";
import { formatVoteCount, type Ranking } from "@/lib/results/rankings";
import { CANTON_NAME, CLUB_BY_ID, PROVINCE_NAME } from "@/mocks/catalog-lookup";
import { CANTONS, PROVINCES } from "@/mocks/catalogs";

type View = "nacional" | "provincial";

const PROVINCE_OPTIONS: ComboboxOption[] = [...PROVINCES]
  .sort((a, b) => a.name.localeCompare(b.name, "es"))
  .map((p) => ({
    id: p.id,
    label: p.name,
    hint: `${CANTONS.filter((c) => c.provinceId === p.id).length} cantones`,
  }));

function regionFrom(
  id: string,
  name: string,
  d: string,
  ranking: Ranking | undefined,
): MapRegion {
  const lead = ranking?.entries[0];
  return {
    id,
    name,
    d,
    leader: lead ? (CLUB_BY_ID.get(lead.clubId) ?? null) : null,
    percentage: lead?.percentage ?? 0,
    votes: lead?.votes ?? 0,
  };
}

function useProvinceRegions() {
  const { provinceResults } = useResultsData();
  return useMemo<MapRegion[]>(
    () =>
      ECUADOR_PROVINCES.map((p) =>
        regionFrom(p.id, p.name, p.d, provinceResults.get(p.id)?.ranking),
      ),
    [provinceResults],
  );
}

/** Recuadro de Galápagos (está a unos 1000 km del continente), como en la página principal. */
const GalapagosInset = (
  <g aria-hidden="true" pointerEvents="none">
    <rect
      x={GALAPAGOS_BOX.x}
      y={GALAPAGOS_BOX.y}
      width={GALAPAGOS_BOX.width}
      height={GALAPAGOS_BOX.height}
      rx={8}
      fill="#ffffff"
      fillOpacity={0.6}
      stroke="#376cd3"
      strokeOpacity={0.35}
      strokeDasharray="4 3"
      vectorEffect="non-scaling-stroke"
    />
    <text
      x={GALAPAGOS_BOX.x + 8}
      y={GALAPAGOS_BOX.y + 13}
      fontSize={10}
      fontWeight={600}
      fill="#376cd3"
    >
      Galápagos
    </text>
  </g>
);

/**
 * Marco del mapa (el mapa nacional mide 565x643; la ficha ocupa la franja inferior).
 * En lg+ tiene un alto fijo, parecido al del Top 5 de al lado, para que las dos
 * columnas queden equilibradas. Cuando va en una sola columna (teléfonos grandes y
 * tablet vertical), se limita su ancho para que no llene la pantalla.
 */
const MAP_FRAME =
  "aspect-[565/740] w-full max-[48rem]:mx-auto max-[48rem]:max-w-[30rem] tablet:portrait:mx-auto tablet:portrait:max-w-[30rem] lg:aspect-auto lg:h-[clamp(30rem,36vw,38rem)]";

/**
 * Segunda sección: estadísticas de popularidad con dos vistas.
 * - NACIONAL (por defecto): Top 5, mapa por provincias y clasificación general.
 * - PROVINCIAL: buscador de provincia; su Top 5, el mapa de sus cantones y su
 *   clasificación. Tocar una provincia en el mapa nacional abre su vista provincial.
 */
export function StatsSection() {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<View>("nacional");
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [cantonMaps, setCantonMaps] = useState<Record<
    string,
    ProvinceCantonMap
  > | null>(null);

  // La geometría de los cantones (unos 130 KB) solo se descarga al abrir PROVINCIAL.
  useEffect(() => {
    if (view !== "provincial" || cantonMaps) return;
    let cancelled = false;
    void import("@/components/results/canton-map-data").then((m) => {
      if (!cancelled) setCantonMaps({ ...m.CANTON_MAPS });
    });
    return () => {
      cancelled = true;
    };
  }, [view, cantonMaps]);

  const openProvince = (next: string) => {
    setProvinceId(next);
    setView("provincial");
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tabs: { key: View; label: string }[] = [
    { key: "nacional", label: "Nacional" },
    { key: "provincial", label: "Provincial" },
  ];
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = view === "nacional" ? "provincial" : "nacional";
    setView(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="estadisticas"
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-(--header-h) bg-bone px-(--page-x) py-14 font-montserrat text-black tablet:py-16 lg:px-[6vw] lg:py-20"
    >
      <div className="mx-auto max-w-[82rem]">
        <div className="flex flex-col gap-5 min-[43rem]:flex-row min-[43rem]:items-end min-[43rem]:justify-between">
          <div>
            <h2
              id={`${id}-titulo`}
              className="font-tiro text-[clamp(2rem,8vw,2.75rem)] leading-[1.05] text-[#0b1f3f] italic lg:text-[clamp(2.5rem,3.2vw,3.5rem)]"
            >
              ESTADÍSTICAS DE POPULARIDAD
            </h2>
            <p className="mt-2 max-w-[38rem] text-[0.9375rem] text-black/60">
              Mira quién manda en el país o elige una provincia para ver cómo se
              reparte su hinchada, cantón por cantón.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Ámbito de las estadísticas"
            className="flex w-full shrink-0 rounded-full border border-black/10 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] min-[43rem]:w-auto"
          >
            {tabs.map((tab) => {
              const selected = view === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`${id}-tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setView(tab.key)}
                  onKeyDown={onTabKey}
                  className={`h-11 flex-1 cursor-pointer rounded-full px-6 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue max-[22rem]:px-2 sm:px-8 min-[43rem]:flex-none ${
                    selected
                      ? "bg-brand-blue text-white shadow-[0_0.375rem_1rem_rgba(21,78,142,0.3)]"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${view}`}
          className="mt-8 lg:mt-10"
        >
          {view === "nacional" ? (
            <NationalView onOpenProvince={openProvince} />
          ) : (
            <>
              <ProvincialView
                provinceId={provinceId}
                onSelect={setProvinceId}
                cantonMaps={cantonMaps}
              />
              <InternationalResults />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function NationalView({
  onOpenProvince,
}: {
  onOpenProvince: (id: string) => void;
}) {
  const { nationalRanking } = useResultsData();
  const provinceRegions = useProvinceRegions();
  return (
    <>
      <div className={TWO_COLUMNS}>
        <div>
          <PanelTitle
            title="Top 5 del Ecuador"
            subtitle={`Sobre ${formatVoteCount(nationalRanking.total)} de hinchas que viven en el país.`}
          />
          <TopFive
            entries={nationalRanking.entries}
            title="Top 5 del Ecuador"
          />
        </div>
        <div>
          <PanelTitle
            title="¿Quién lidera en cada provincia?"
            subtitle="Cada provincia lleva el color del equipo con más votos."
          />
          <ChoroplethMap
            regions={provinceRegions}
            width={ECUADOR_MAP_VIEWBOX.width}
            height={ECUADOR_MAP_VIEWBOX.height}
            regionNoun="provincia"
            hint="Toca una provincia para ver quién lidera y abrir su detalle."
            onOpen={onOpenProvince}
            openLabel={() => "Ver provincia"}
            overlay={GalapagosInset}
            className={MAP_FRAME}
          />
          <div className="mt-4">
            <MapLegend
              regions={provinceRegions}
              noun={{ one: "provincia", many: "provincias" }}
            />
          </div>
        </div>
      </div>
      <InternationalResults />
      <div className="mt-10">
        <GeneralRanking national={nationalRanking} />
      </div>
    </>
  );
}

function ProvincialView({
  provinceId,
  onSelect,
  cantonMaps,
}: {
  provinceId: string | null;
  onSelect: (id: string) => void;
  cantonMaps: Record<string, ProvinceCantonMap> | null;
}) {
  const id = useId();
  const { provinceResults } = useResultsData();
  const provinceRegions = useProvinceRegions();
  const results = provinceId ? provinceResults.get(provinceId) : undefined;
  const name = provinceId ? (PROVINCE_NAME.get(provinceId) ?? "") : "";
  const map = provinceId ? cantonMaps?.[provinceId] : undefined;

  const cantonRegions = useMemo<MapRegion[]>(
    () =>
      map && results
        ? map.cantons.map((c) =>
            regionFrom(
              c.id,
              CANTON_NAME.get(c.id) ?? c.id,
              c.d,
              results.cantonRankings.get(c.id),
            ),
          )
        : [],
    [map, results],
  );
  const cantonCount = provinceId
    ? CANTONS.filter((c) => c.provinceId === provinceId).length
    : 0;

  return (
    <>
      <div className="max-w-[28rem]">
        <Combobox
          id={`${id}-provincia`}
          label="Provincia"
          placeholder="Busca una provincia"
          emptyText="No encontramos esa provincia."
          options={PROVINCE_OPTIONS}
          value={provinceId}
          onChange={onSelect}
        />
      </div>

      {!provinceId || !results ? (
        <div className={`mt-8 ${TWO_COLUMNS}`}>
          <div className="flex flex-col justify-center rounded-[1.75rem] border border-dashed border-results-blue/30 bg-white/70 p-6 sm:p-8">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[#eef4fd] text-results-blue">
              <MapPinned aria-hidden="true" className="size-7" />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight sm:text-2xl">
              Elige una provincia
            </h3>
            <p className="mt-2 text-[0.9375rem] text-black/60">
              Búscala arriba o tócala en el mapa. Verás su Top 5, quién lidera
              en cada uno de sus cantones y la clasificación completa de la
              provincia.
            </p>
          </div>
          <ChoroplethMap
            regions={provinceRegions}
            width={ECUADOR_MAP_VIEWBOX.width}
            height={ECUADOR_MAP_VIEWBOX.height}
            regionNoun="provincia"
            hint="Toca una provincia para elegirla."
            onOpen={onSelect}
            openLabel={() => "Elegir"}
            overlay={GalapagosInset}
            className={MAP_FRAME}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-tiro text-[clamp(1.75rem,6vw,2.5rem)] leading-none text-[#0b1f3f] italic uppercase">
              {name}
            </h3>
            <p className="text-sm font-semibold text-black/55 tabular-nums">
              {formatVoteCount(results.ranking.total)} · {cantonCount} cantones
            </p>
          </div>

          <div className={`mt-6 ${TWO_COLUMNS}`}>
            <div>
              <PanelTitle
                title={`Top 5 de ${name}`}
                subtitle="Los equipos con más votos de hinchas que viven en esta provincia."
              />
              <TopFive
                entries={results.ranking.entries}
                title={`Top 5 de ${name}`}
              />
            </div>
            <div>
              <PanelTitle
                title="¿Quién lidera en cada cantón?"
                subtitle="Cada cantón lleva el color del equipo con más votos."
              />
              {map ? (
                <ChoroplethMap
                  key={provinceId}
                  regions={cantonRegions}
                  width={map.width}
                  height={map.height}
                  regionNoun="cantón"
                  hint="Toca un cantón para ver quién lidera."
                  className={MAP_FRAME}
                />
              ) : (
                <div
                  className={`${MAP_FRAME} animate-pulse rounded-[1.75rem] bg-[#e7eefa] motion-reduce:animate-none`}
                  aria-label="Cargando el mapa de cantones"
                  role="status"
                />
              )}
              <div className="mt-4 flex flex-col gap-3">
                {cantonRegions.length > 0 && (
                  <MapLegend
                    regions={cantonRegions}
                    noun={{ one: "cantón", many: "cantones" }}
                  />
                )}
                {provinceId === "EC-S" && (
                  <p className="flex items-start gap-2 text-xs text-black/55">
                    <Info
                      aria-hidden="true"
                      className="mt-px size-3.5 shrink-0"
                    />
                    Sevilla Don Bosco (creado en 2024) aún no tiene límites
                    oficiales publicados: no aparece en el mapa, pero sus votos
                    sí cuentan.
                  </p>
                )}
                <p className="text-[0.6875rem] text-black/40">
                  Límites cantonales: INEC (2019), vía OCHA ROLAC y
                  geoBoundaries · CC BY 3.0 IGO.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <RankingTable
              key={provinceId}
              ranking={results.ranking}
              title={`Clasificación de ${name}`}
              description="Todos los equipos con votos en esta provincia, de más a menos votado."
            />
          </div>
        </>
      )}
    </>
  );
}
