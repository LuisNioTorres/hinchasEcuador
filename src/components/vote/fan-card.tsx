import { Globe2, MapPin, Shield } from "lucide-react";
import {
  ECUADOR_MAP_VIEWBOX,
  ECUADOR_PROVINCES,
} from "@/components/home/results/ecuador-map-data";
import { ClubBadge } from "@/components/vote/club-badge";
import type { Club } from "@/mocks/catalogs";

export type Scope = "nacional" | "internacional";

/** Tinta legible (oscura o blanca) sobre el color del club. */
function inkFor(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#0b1f3f" : "#ffffff";
}

/**
 * Tarjeta del hincha: resume el voto mientras se completa el formulario. La franja
 * toma el color del club, y el mini mapa resalta la provincia elegida.
 */
export function FanCard({
  scope,
  club,
  provinceId,
  locationLabel,
}: {
  scope: Scope;
  club: Club | null;
  provinceId: string | null;
  locationLabel: string | null;
}) {
  const band = club?.color ?? "#dbe7fb";
  const ink = club ? inkFor(club.color) : "#0b1f3f";

  return (
    <figure
      aria-label="Resumen de tu voto"
      className="w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1.75rem_3.5rem_rgba(29,58,115,0.2)] ring-1 ring-black/5"
    >
      <div
        className="relative h-36 overflow-hidden transition-colors duration-500 motion-reduce:transition-none"
        style={{ backgroundColor: band, color: ink }}
      >
        {/* Brillo diagonal sutil. */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.08)_100%)]" />
        <p className="absolute top-5 right-[42%] left-6 text-[0.6875rem] leading-snug font-bold tracking-[0.16em] uppercase opacity-80">
          Censo Único del Ecuador
        </p>

        {scope === "nacional" ? (
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${ECUADOR_MAP_VIEWBOX.width} ${ECUADOR_MAP_VIEWBOX.height}`}
            className="absolute top-3 right-4 h-[calc(100%-1.5rem)]"
          >
            {ECUADOR_PROVINCES.map(({ id, d }) => {
              const isSelected = id === provinceId;
              return (
                <path
                  key={id}
                  d={d}
                  fillRule="evenodd"
                  fill="currentColor"
                  fillOpacity={isSelected ? 1 : 0.22}
                  stroke="currentColor"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  className="transition-[fill-opacity] duration-300 motion-reduce:transition-none"
                />
              );
            })}
          </svg>
        ) : (
          <Globe2
            aria-hidden="true"
            strokeWidth={1.25}
            className="absolute top-1/2 right-6 size-24 -translate-y-1/2 opacity-30"
          />
        )}
      </div>

      <figcaption className="relative px-6 pt-12 pb-6">
        <div className="absolute -top-10 left-6 rounded-full bg-white p-1.5 shadow-[0_0.5rem_1.25rem_rgba(15,30,60,0.18)]">
          {club ? (
            <ClubBadge club={club} className="size-[4.25rem]" />
          ) : (
            <span className="flex size-[4.25rem] items-center justify-center rounded-full border-2 border-dashed border-black/15 text-black/25">
              <Shield aria-hidden="true" className="size-7" />
            </span>
          )}
        </div>

        <p className="text-xs font-semibold tracking-wider text-black/45 uppercase">
          Mi equipo
        </p>
        <p
          className={`mt-1 text-2xl leading-tight font-bold break-words ${club ? "text-black" : "text-black/25"}`}
        >
          {club?.name ?? "Elige tu equipo"}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 text-sm">
          <span className="rounded-full bg-[#eef4fd] px-3 py-1 text-xs font-bold tracking-wide text-results-blue uppercase">
            {scope === "nacional" ? "Nacional" : "Internacional"}
          </span>
          <span
            className={`flex min-w-0 items-center gap-1.5 ${locationLabel ? "font-medium text-black/75" : "text-black/35"}`}
          >
            {scope === "nacional" ? (
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <Globe2 aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span className="min-w-0 break-words">
              {locationLabel ??
                (scope === "nacional"
                  ? "Tu provincia y cantón"
                  : "Tu continente")}
            </span>
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
