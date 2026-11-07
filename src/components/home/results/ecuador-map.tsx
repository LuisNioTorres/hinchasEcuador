"use client";

import { useState, type PointerEvent } from "react";
import {
  ECUADOR_MAP_VIEWBOX,
  ECUADOR_PROVINCES,
  GALAPAGOS_BOX,
  GALAPAGOS_ID,
  type EcuadorProvince,
} from "@/components/home/results/ecuador-map-data";

const NO_VOTES_LABEL = "Sin votos todavía";

/**
 * Mapa del Ecuador por provincias (Sección 2), en su estado sin votos.
 *
 * Ocupa el 100% del ancho de su contenedor y conserva la proporción 565x643 del
 * recuadro reservado: el tamaño se controla desde el padre. Es un SVG, así que se
 * adapta a todos los tamaños de pantalla sin librerías.
 *
 * Al pasar el cursor, tocar o enfocar con teclado una provincia, se resalta y su
 * nombre aparece en la tarjeta de la esquina, que tiene sitio libre sobre la zona
 * sin tierra del mapa.
 */
export function EcuadorMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = ECUADOR_PROVINCES.find(({ id }) => id === activeId);
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

  const renderProvince = ({ id, name, d }: EcuadorProvince) => (
    <path
      key={id}
      d={d}
      tabIndex={0}
      role="img"
      aria-label={`${name}: ${NO_VOTES_LABEL.toLowerCase()}`}
      fillRule="evenodd"
      strokeWidth="1"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      {...provinceHandlers(id)}
      className={`cursor-pointer transition-[fill] duration-150 outline-none motion-reduce:transition-none ${
        id === activeId ? "fill-results-blue" : ""
      }`}
    />
  );

  return (
    <div
      data-ecuador-map
      style={{ aspectRatio: `${width} / ${height}` }}
      className="@container relative w-full overflow-hidden rounded-2xl border border-results-blue/15 bg-[linear-gradient(165deg,#f8fbff_0%,#edf3fc_100%)] phone:rounded-xl"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`Mapa del Ecuador por provincias. ${NO_VOTES_LABEL}.`}
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
          fill="#a3b5d0"
          stroke="#a3b5d0"
        />

        <g fill="#cfdbec" stroke="#ffffff">
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
            stroke="#ffffff"
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] bottom-[2.5%] flex max-w-[54%] items-center gap-[0.55em] rounded-lg border border-results-blue/15 bg-white/90 px-[0.8em] py-[0.55em] text-[clamp(0.6875rem,2.75cqw,1rem)] leading-tight shadow-[0_0.25rem_0.875rem_rgba(29,58,115,0.12)]"
      >
        <span
          className={`size-[0.6em] shrink-0 rounded-full transition-colors duration-150 motion-reduce:transition-none ${
            active ? "bg-results-blue" : "bg-[#a3b5d0]"
          }`}
        />
        <span className="min-w-0">
          <span className="block font-bold text-black">
            {active ? active.name : NO_VOTES_LABEL}
          </span>
          <span className="block text-[0.82em] font-medium text-black/60">
            {active ? NO_VOTES_LABEL : `${ECUADOR_PROVINCES.length} provincias`}
          </span>
        </span>
      </div>
    </div>
  );
}
