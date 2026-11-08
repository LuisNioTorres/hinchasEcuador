"use client";

import { useId, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, MousePointerClick } from "lucide-react";
import { ClubBadge } from "@/components/vote/club-badge";
import { formatPercentage, formatVoteCount } from "@/lib/results/rankings";
import type { Club } from "@/mocks/catalogs";

export interface MapRegion {
  readonly id: string;
  readonly name: string;
  readonly d: string;
  /** Club líder de la región, o null si aún no tiene votos. */
  readonly leader: Club | null;
  readonly percentage: number;
  readonly votes: number;
}

const NEUTRAL = "#E5E7EB";

/** Con mouse, la región elegida solo cambia al elegir otra. */
const isMouseClick = (event: MouseEvent) =>
  (event.nativeEvent as PointerEvent).pointerType === "mouse";

/**
 * Mapa coroplético: cada región se pinta con el color de su club líder
 * (docs/DATOS_INFORMATION.md, Módulo 5). Al pasar el cursor, tocar o enfocar una
 * región con el teclado, una ficha muestra quién lidera ahí. Con `onOpen`, la
 * ficha ofrece abrir el detalle de la región (p. ej., ir a su vista provincial).
 */
export function ChoroplethMap({
  regions,
  width,
  height,
  regionNoun,
  hint,
  onOpen,
  openLabel,
  overlay,
  selectedId,
  onSelect,
  className = "",
}: {
  regions: readonly MapRegion[];
  width: number;
  height: number;
  /** "provincia" o "cantón", para los textos accesibles. */
  regionNoun: string;
  hint: string;
  onOpen?: (id: string) => void;
  openLabel?: (region: MapRegion) => string;
  /** Elementos extra dentro del SVG (p. ej., el recuadro de Galápagos). */
  overlay?: ReactNode;
  /** Región elegida, cuando la controla el componente padre. */
  selectedId?: string;
  /** Avisa de la región elegida; con él, siempre hay una región seleccionada. */
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const noVotesPattern = useId();
  const hasEmptyRegions = regions.some((r) => !r.leader);
  /** La trama se ve del mismo tamaño aunque cada mapa tenga otra escala. */
  const hatch = width / 70;
  const [hovered, setHovered] = useState<string | null>(null);
  const [ownSelected, setOwnSelected] = useState<string | null>(null);
  const selected = selectedId ?? ownSelected;
  // La selección manda sobre el hover: el cursor no debe ocultarla.
  const activeId = selected ?? hovered;
  const active = regions.find((r) => r.id === activeId) ?? null;

  const choose = (id: string, event: MouseEvent) => {
    if (onSelect) {
      onSelect(id);
      return;
    }
    const keep = isMouseClick(event);
    setOwnSelected((s) => (s === id && !keep ? null : id));
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-black/5 bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#eef4fd_55%,#e2ecfb_100%)] ${className}`}
    >
      {/* Trama de puntos sutil. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(55,108,211,0.12)_1px,transparent_1px)] [background-size:14px_14px]"
      />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative mx-auto block h-full max-h-full w-full max-w-full px-[5%] pt-[5%] pb-[5.75rem] drop-shadow-[0_1rem_1.5rem_rgba(29,58,115,0.18)]"
        onPointerLeave={() => setHovered(null)}
        onClick={(event) => {
          // En táctil, tocar fuera de las regiones limpia la selección.
          if (
            event.target === event.currentTarget &&
            !isMouseClick(event) &&
            !onSelect
          ) {
            setOwnSelected(null);
          }
        }}
      >
        {hasEmptyRegions && (
          <defs>
            <pattern
              id={noVotesPattern}
              width={hatch}
              height={hatch}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width={hatch} height={hatch} fill={NEUTRAL} />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={hatch}
                stroke="#9CA3AF"
                strokeWidth={hatch / 3}
                strokeOpacity={0.6}
              />
            </pattern>
          </defs>
        )}
        {overlay}
        {regions.map((region) => {
          const isActive = region.id === activeId;
          const dimmed = activeId !== null && !isActive;
          const label = region.leader
            ? `${region.name}: lidera ${region.leader.name} con ${formatPercentage(region.percentage)}`
            : `${region.name}: sin votos registrados`;
          return (
            <path
              key={region.id}
              d={region.d}
              fillRule="evenodd"
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={region.id === selected}
              fill={region.leader?.color ?? `url(#${noVotesPattern})`}
              stroke={isActive ? "#0b1f3f" : "#1b2a4a"}
              strokeOpacity={isActive ? 0.9 : 0.45}
              strokeWidth={isActive ? 2.25 : 0.9}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              onPointerEnter={(e) =>
                e.pointerType === "mouse" && setHovered(region.id)
              }
              onClick={(event) => choose(region.id, event)}
              onFocus={(e) => {
                // Solo el foco de teclado selecciona: con clic o toque ya lo hace
                // onClick, y seleccionar aquí haría que ese clic la deseleccionara.
                if (e.currentTarget.matches(":focus-visible")) {
                  (onSelect ?? setOwnSelected)(region.id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && onOpen) onOpen(region.id);
              }}
              className={`cursor-pointer outline-none transition-[opacity,stroke-width] duration-200 motion-reduce:transition-none ${dimmed ? "opacity-45" : "opacity-100"}`}
            />
          );
        })}
        {/* La región activa se vuelve a dibujar encima para que su borde no quede tapado. */}
        {active && (
          <path
            d={active.d}
            fillRule="evenodd"
            fill="none"
            stroke="#0b1f3f"
            strokeOpacity={0.9}
            strokeWidth={2.25}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Ficha de la región activa. */}
      <div
        aria-live="polite"
        className="absolute inset-x-3 bottom-3 rounded-2xl border border-black/5 bg-white/90 p-3 shadow-[0_0.75rem_1.75rem_rgba(15,30,60,0.14)] backdrop-blur sm:inset-x-4 sm:bottom-4 sm:p-3.5"
      >
        {active ? (
          <div className="flex items-center gap-3">
            {active.leader ? (
              <ClubBadge club={active.leader} className="size-10 sm:size-11" />
            ) : (
              <span className="size-10 rounded-full bg-[#E5E7EB]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold tracking-wide text-black/50 uppercase">
                {active.name}
              </p>
              <p className="truncate text-[0.9375rem] leading-tight font-bold">
                {active.leader ? active.leader.name : "Sin votos registrados"}
              </p>
              {active.leader && (
                <p className="text-xs text-black/60 tabular-nums">
                  Lidera con{" "}
                  <span className="font-semibold text-black">
                    {formatPercentage(active.percentage)}
                  </span>{" "}
                  · {formatVoteCount(active.votes)}
                </p>
              )}
            </div>
            {onOpen && (
              <button
                type="button"
                onClick={() => onOpen(active.id)}
                className="group flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-brand-blue px-3.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-[#0f3f75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue sm:px-4"
              >
                <span className="max-[22rem]:sr-only">
                  {openLabel ? openLabel(active) : "Ver detalle"}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </button>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2.5 text-[0.8125rem] text-black/60">
            <MousePointerClick
              aria-hidden="true"
              className="size-[1.125rem] shrink-0 text-results-blue"
            />
            {hint}
          </p>
        )}
      </div>
      <span className="sr-only">
        Mapa por {regionNoun}: usa Tab para recorrer cada {regionNoun}.
      </span>
    </div>
  );
}

/** Leyenda: cuántas regiones lidera cada club. */
export function MapLegend({
  regions,
  noun,
}: {
  regions: readonly MapRegion[];
  noun: { one: string; many: string };
}) {
  const counts = new Map<string, { club: Club; count: number }>();
  for (const r of regions) {
    if (!r.leader) continue;
    const c = counts.get(r.leader.id) ?? { club: r.leader, count: 0 };
    c.count += 1;
    counts.set(r.leader.id, c);
  }
  const items = [...counts.values()].sort(
    (a, b) => b.count - a.count || a.club.name.localeCompare(b.club.name, "es"),
  );
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Leyenda del mapa">
      {items.map(({ club, count }) => (
        <li
          key={club.id}
          className="flex items-center gap-2 rounded-full border border-black/8 bg-white py-1 pr-3 pl-1 text-xs font-semibold"
        >
          <span
            aria-hidden="true"
            className="size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
            style={{ backgroundColor: club.color }}
          />
          {club.name}
          <span className="font-medium text-black/50 tabular-nums">
            {count} {count === 1 ? noun.one : noun.many}
          </span>
        </li>
      ))}
    </ul>
  );
}
