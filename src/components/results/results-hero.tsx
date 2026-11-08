import { ArrowDown } from "lucide-react";
import {
  ECUADOR_MAP_VIEWBOX,
  ECUADOR_PROVINCES,
  GALAPAGOS_ID,
} from "@/components/home/results/ecuador-map-data";
import { ClubBadge } from "@/components/vote/club-badge";
import { VoteBackdrop } from "@/components/vote/vote-backdrop";
import {
  formatPercentage,
  formatVotes,
  type RankingEntry,
} from "@/lib/results/rankings";
import { clubOf } from "@/mocks/catalog-lookup";

const MAINLAND = ECUADOR_PROVINCES.filter(({ id }) => id !== GALAPAGOS_ID);

/** Posición de cada tarjeta del podio sobre el mapa (1.º, 2.º y 3.º). */
const PODIUM_PLACEMENT = [
  "top-[14%] left-[6%] z-30 -rotate-2 sm:left-[10%] lg:top-[16%] lg:left-[8%]",
  "top-[44%] right-[5%] z-20 rotate-2 sm:right-[10%] lg:right-[9%]",
  "bottom-[9%] left-[12%] z-10 -rotate-1 sm:left-[18%] lg:bottom-[12%] lg:left-[16%]",
] as const;

/**
 * Primera sección del usuario logueado: la composición del login invertida.
 * Texto a la izquierda y, a la derecha, el mapa de Ecuador pintado con el color del
 * líder de cada provincia, con el podio nacional flotando encima.
 */
export function ResultsHero({
  podium,
  totalVotes,
  clubsWithVotes,
  provinceColors,
}: {
  podium: readonly RankingEntry[];
  totalVotes: number;
  clubsWithVotes: number;
  provinceColors: ReadonlyMap<string, string>;
}) {
  const stats = [
    { value: formatVotes(totalVotes), label: "hinchas censados" },
    { value: "24", label: "provincias" },
    { value: String(clubsWithVotes), label: "equipos con votos" },
  ];

  return (
    <section
      aria-labelledby="presentacion-titulo"
      className="bg-white lg:grid lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] tablet:landscape:grid tablet:landscape:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col justify-center px-(--page-x) py-12 tablet:py-16 wide:py-8 lg:py-16 lg:pr-[3vw] lg:pl-[6vw]">
        <p className="flex w-fit items-center gap-2 rounded-full bg-[#eef4fd] px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.14em] text-results-blue uppercase">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-results-blue"
          />
          Censo Único del Ecuador
        </p>
        <h1
          id="presentacion-titulo"
          className="mt-5 font-tiro text-[clamp(2.5rem,11vw,3.5rem)] leading-[1.02] text-[#0b1f3f] italic tablet:text-[clamp(3rem,7vw,4.25rem)] wide:text-[clamp(2rem,5vw,2.75rem)] lg:text-[clamp(3.25rem,4.6vw,5.75rem)]"
        >
          LA PASIÓN DE UN PAÍS, EN NÚMEROS
        </h1>
        <p className="mt-5 max-w-[34rem] text-[0.8125rem] leading-relaxed font-semibold tracking-wide text-[#0b1f3f]/75 uppercase tablet:text-sm lg:mt-6 lg:text-[clamp(0.875rem,1vw,1.0625rem)]">
          Conoce los equipos más populares del Ecuador y de cada provincia,
          contados voto a voto por hinchas como tú.
        </p>

        <dl className="mt-8 grid max-w-[34rem] grid-cols-3 gap-3 wide:mt-5 lg:mt-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-black/8 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-4"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-xl leading-none font-bold tracking-tight text-black tabular-nums sm:text-2xl lg:text-[clamp(1.5rem,1.9vw,2rem)]">
                  {s.value}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1.5 block text-[0.6875rem] leading-tight font-medium text-black/55 sm:text-xs"
                >
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <a
          href="#estadisticas"
          className="group mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-brand-blue px-6 text-[0.9375rem] font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(21,78,142,0.28)] transition-colors hover:bg-[#0f3f75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue wide:mt-5 lg:mt-10"
        >
          Ver estadísticas
          <ArrowDown
            aria-hidden="true"
            className="size-[1.125rem] transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
          />
        </a>
      </div>

      {/* Escenario: mapa pintado por los líderes y podio nacional. */}
      <div className="relative isolate h-[clamp(24rem,105vw,32rem)] overflow-hidden tablet:h-[clamp(28rem,70vw,38rem)] tablet:landscape:h-auto wide:h-[26rem] lg:h-auto">
        <VoteBackdrop />
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${ECUADOR_MAP_VIEWBOX.width} ${ECUADOR_MAP_VIEWBOX.height}`}
          className="absolute top-1/2 left-1/2 h-[92%] max-w-none -translate-x-[42%] -translate-y-1/2 drop-shadow-[0_1.5rem_2.5rem_rgba(29,58,115,0.22)]"
        >
          {MAINLAND.map(({ id, d }) => (
            <path
              key={id}
              d={d}
              fillRule="evenodd"
              fill={provinceColors.get(id) ?? "#E5E7EB"}
              fillOpacity={0.88}
              stroke="#ffffff"
              strokeWidth={1.25}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <ol aria-label="Podio nacional">
          {podium.map((entry, i) => {
            const club = clubOf(entry.clubId);
            return (
              <li
                key={entry.clubId}
                className={`absolute flex items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 shadow-[0_1rem_2rem_rgba(15,30,60,0.2)] ring-1 ring-black/5 backdrop-blur ${PODIUM_PLACEMENT[i] ?? ""} ${i === 0 ? "lg:py-3.5 lg:pr-6 lg:pl-3.5" : ""}`}
              >
                <ClubBadge
                  club={club}
                  className={
                    i === 0 ? "size-12 lg:size-14" : "size-10 lg:size-11"
                  }
                />
                <span>
                  <span className="block text-[0.6875rem] font-bold tracking-wider text-black/45 uppercase">
                    {entry.position}.º nacional
                  </span>
                  <span
                    className={`block leading-tight font-bold ${i === 0 ? "text-base lg:text-lg" : "text-sm lg:text-base"}`}
                  >
                    {club.name}
                  </span>
                  <span className="block text-xs font-semibold text-results-blue tabular-nums">
                    {formatPercentage(entry.percentage)}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
