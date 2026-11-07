"use client";

import { useState, type PointerEvent } from "react";
import {
  ECUADOR_MAP_VIEWBOX,
  ECUADOR_PROVINCES,
  GALAPAGOS_BOX,
  GALAPAGOS_ID,
  type EcuadorProvince,
} from "@/components/home/results/ecuador-map-data";
import type {
  ProvinceLeader,
  ProvinceLeaders,
} from "@/lib/results/province-leaders";

const NO_VOTES_LABEL = "Sin votos todavía";

/** Línea de frontera con resultados: oscura para que se vea también el club blanco. */
const RESULTS_BORDER = "#1b2a4a";

const CARD_CLASS =
  "pointer-events-none absolute right-[3%] bottom-[2.5%] flex rounded-lg border border-results-blue/15 bg-white/90 px-[0.8em] py-[0.55em] leading-tight shadow-[0_0.25rem_0.875rem_rgba(29,58,115,0.12)]";

/** Con borde, para que se vea también el color blanco. */
const SWATCH_CLASS =
  "size-[0.75em] shrink-0 rounded-full border border-black/40";

interface EcuadorMapProps {
  /** Club líder de cada provincia, por código ISO. Sin votos, la provincia queda neutra. */
  leaders: ProvinceLeaders;
}

function leaderSummary(leader: ProvinceLeader | undefined) {
  return leader ? `${leader.clubName} · ${leader.percentage}%` : NO_VOTES_LABEL;
}

/** Clubes que lideran alguna provincia, de más a menos provincias. */
function getLegend(leaders: ProvinceLeaders) {
  const rows = new Map<string, { leader: ProvinceLeader; provinces: number }>();
  for (const leader of Object.values(leaders)) {
    const row = rows.get(leader.clubId);
    rows.set(leader.clubId, {
      leader,
      provinces: (row?.provinces ?? 0) + 1,
    });
  }
  return [...rows.values()].sort(
    (a, b) =>
      b.provinces - a.provinces ||
      a.leader.clubName.localeCompare(b.leader.clubName, "es"),
  );
}

/**
 * Mapa del Ecuador por provincias (Sección 2): cada provincia toma el color de su
 * club líder y, sin votos, queda en el tono neutro.
 *
 * Ocupa el 100% del ancho de su contenedor y conserva la proporción 565x643 del
 * recuadro reservado: el tamaño se controla desde el padre. Es un SVG, así que se
 * adapta a todos los tamaños de pantalla sin librerías.
 *
 * Al pasar el cursor, tocar o enfocar con teclado una provincia, se resalta y la
 * tarjeta de la esquina muestra su líder. En reposo, la tarjeta es la leyenda de
 * colores. Ambas ocupan la zona sin tierra del mapa.
 */
export function EcuadorMap({ leaders }: EcuadorMapProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = ECUADOR_PROVINCES.find(({ id }) => id === activeId);
  const activeLeader = activeId ? leaders[activeId] : undefined;
  const legend = getLegend(leaders);
  const hasResults = legend.length > 0;
  const { width, height } = ECUADOR_MAP_VIEWBOX;

  const provinceHandlers = (id: string) => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setActiveId(id);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setActiveId(null);
    },
    onClick: () => setActiveId(id),
    onFocus: () => setActiveId(id),
    onBlur: () => setActiveId(null),
  });

  const renderProvince = ({ id, name, d }: EcuadorProvince) => {
    const leader = leaders[id];
    const isDimmed = hasResults && activeId !== null && id !== activeId;

    return (
      <path
        key={id}
        d={d}
        tabIndex={0}
        role="img"
        aria-label={`${name}: ${leaderSummary(leader)}`}
        fillRule="evenodd"
        strokeWidth={hasResults ? 0.75 : 1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={leader ? { fill: leader.color } : undefined}
        {...provinceHandlers(id)}
        className={`cursor-pointer transition-[fill,opacity] duration-150 outline-none motion-reduce:transition-none ${
          !leader && id === activeId ? "fill-results-blue" : ""
        } ${isDimmed ? "opacity-45" : ""}`}
      />
    );
  };

  return (
    <div
      data-ecuador-map
      style={{ aspectRatio: `${width} / ${height}` }}
      className="@container relative w-full overflow-hidden rounded-2xl border border-results-blue/15 bg-[linear-gradient(165deg,#f8fbff_0%,#edf3fc_100%)] phone:rounded-xl"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`Mapa del Ecuador por provincias.${hasResults ? "" : ` ${NO_VOTES_LABEL}.`}`}
        className="absolute inset-0 block size-full select-none"
      >
        <defs>
          <pattern
            id="ecuador-map-dots"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.9" fill="#376cd3" fillOpacity="0.13" />
          </pattern>
          <filter
            id="ecuador-map-shadow"
            x="-10%"
            y="-10%"
            width="120%"
            height="125%"
          >
            {/* Silueta de un solo color, aunque las provincias tengan colores de club. */}
            <feFlood floodColor="#a3b5d0" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="7"
              floodColor="#1d3a73"
              floodOpacity="0.2"
            />
          </filter>
        </defs>

        {/* Mar: tocarlo quita la selección. */}
        <rect
          width={width}
          height={height}
          fill="url(#ecuador-map-dots)"
          onClick={() => setActiveId(null)}
        />

        <text
          x="16"
          y="462"
          aria-hidden="true"
          className="pointer-events-none fill-results-blue/55 font-tiro text-[15px] italic phone:hidden"
        >
          <tspan x="16">Océano</tspan>
          <tspan x="16" dy="18">
            Pacífico
          </tspan>
        </text>

        <g
          {...provinceHandlers(GALAPAGOS_ID)}
          aria-hidden="true"
          className="cursor-pointer"
        >
          <rect
            {...GALAPAGOS_BOX}
            rx="8"
            fill="#ffffff"
            fillOpacity="0.65"
            stroke="#376cd3"
            strokeOpacity="0.28"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Relieve del continente: su silueta, desplazada y con sombra. */}
        <use
          href="#ecuador-map-mainland"
          y="4"
          aria-hidden="true"
          filter="url(#ecuador-map-shadow)"
          className="pointer-events-none"
        />

        <g fill="#cfdbec" stroke={hasResults ? RESULTS_BORDER : "#ffffff"}>
          <g id="ecuador-map-mainland">
            {ECUADOR_PROVINCES.filter(({ id }) => id !== GALAPAGOS_ID).map(
              renderProvince,
            )}
          </g>
          {ECUADOR_PROVINCES.filter(({ id }) => id === GALAPAGOS_ID).map(
            renderProvince,
          )}
        </g>

        {/* Contorno de la provincia activa, por encima de sus vecinas. */}
        {active && (
          <path
            d={active.d}
            fill="none"
            stroke={hasResults ? RESULTS_BORDER : "#ffffff"}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            aria-hidden="true"
            className="pointer-events-none"
          />
        )}
      </svg>

      <span
        aria-hidden="true"
        style={{
          left: `${(GALAPAGOS_BOX.x / width) * 100}%`,
          top: `${(GALAPAGOS_BOX.y / height) * 100}%`,
          width: `${(GALAPAGOS_BOX.width / width) * 100}%`,
        }}
        className="pointer-events-none absolute pt-[0.4em] text-center text-[clamp(0.5rem,2.1cqw,0.75rem)] leading-none font-semibold text-results-blue/80"
      >
        Galápagos
      </span>

      {hasResults && !active ? (
        <div
          aria-hidden="true"
          className={`${CARD_CLASS} w-[37%] min-w-fit flex-col items-stretch gap-[0.3em] text-[clamp(0.5625rem,2.3cqw,0.875rem)]`}
        >
          {legend.map(({ leader, provinces }) => (
            <span key={leader.clubId} className="flex items-center gap-[0.5em]">
              <span
                style={{ backgroundColor: leader.color }}
                className={SWATCH_CLASS}
              />
              <span className="font-semibold whitespace-nowrap text-black">
                {leader.clubName}
              </span>
              <span className="ml-auto pl-[0.5em] font-bold text-black/60 tabular-nums">
                {provinces}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`${CARD_CLASS} max-w-[54%] items-center gap-[0.55em] text-[clamp(0.6875rem,2.75cqw,1rem)]`}
        >
          <span
            style={
              activeLeader ? { backgroundColor: activeLeader.color } : undefined
            }
            className={`${SWATCH_CLASS} ${
              activeLeader ? "" : active ? "bg-results-blue" : "bg-[#a3b5d0]"
            }`}
          />
          <span className="min-w-0">
            <span className="block font-bold text-black">
              {active ? active.name : NO_VOTES_LABEL}
            </span>
            <span className="block text-[0.82em] font-medium text-black/60">
              {active
                ? leaderSummary(activeLeader)
                : `${ECUADOR_PROVINCES.length} provincias`}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
