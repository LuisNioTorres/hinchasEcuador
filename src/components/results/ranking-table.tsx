"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { ClubBadge } from "@/components/vote/club-badge";
import {
  formatPercentage,
  formatVotes,
  type Ranking,
} from "@/lib/results/rankings";
import { searchOptions } from "@/lib/search";
import { clubOf } from "@/mocks/catalog-lookup";

/** Filas visibles antes de "Ver todos": suficiente para cubrir Serie A y buena parte de la B. */
const INITIAL_ROWS = 20;

/**
 * Clasificación completa de un ámbito. Muestra los 20 primeros y permite ver todos o
 * buscar un equipo (la búsqueda recorre la lista entera y conserva su posición real).
 */
export function RankingTable({
  ranking,
  title,
  description,
  toolbar,
}: {
  ranking: Ranking;
  title: string;
  description: string;
  /** Controles opcionales sobre el título (p. ej., cambiar de ámbito). */
  toolbar?: ReactNode;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const rows = useMemo(() => {
    const withClub = ranking.entries.map((e) => ({
      ...e,
      club: clubOf(e.clubId),
    }));
    if (query.trim()) {
      return searchOptions(withClub, query, (r) => [
        r.club.name,
        r.club.officialName,
      ]).sort((a, b) => a.position - b.position);
    }
    return expanded ? withClub : withClub.slice(0, INITIAL_ROWS);
  }, [ranking, query, expanded]);

  const max = ranking.entries[0]?.percentage || 1;
  const total = ranking.entries.length;
  const searching = query.trim().length > 0;

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="rounded-[1.75rem] border border-black/6 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 lg:p-8"
    >
      {toolbar}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3
            id={`${id}-titulo`}
            className="text-lg font-bold tracking-tight sm:text-xl"
          >
            {title}
          </h3>
          <p className="mt-1 text-sm text-black/55">{description}</p>
        </div>
        <div className="relative sm:w-72">
          <label htmlFor={`${id}-buscar`} className="sr-only">
            Buscar equipo en la clasificación
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-black/35"
          />
          <input
            id={`${id}-buscar`}
            type="search"
            autoComplete="off"
            placeholder="Buscar equipo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-black/12 bg-[#f7f9fd] pr-10 pl-10 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-black/40 focus:border-results-blue focus:bg-white focus:ring-4 focus:ring-results-blue/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Borrar búsqueda"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-black/45 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-results-blue"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>

      <table className="mt-5 w-full table-fixed border-separate border-spacing-y-1 text-sm">
        <thead className="text-left text-[0.6875rem] font-bold tracking-wider text-black/45 uppercase">
          <tr>
            <th scope="col" className="w-10 pb-1 pl-2 font-bold sm:w-12">
              #
            </th>
            <th scope="col" className="pb-1 font-bold">
              Equipo
            </th>
            <th
              scope="col"
              className="hidden w-28 pb-1 text-right font-bold sm:table-cell"
            >
              Votos
            </th>
            <th
              scope="col"
              className="w-[4.75rem] pr-2 pb-1 text-right font-bold sm:w-24"
            >
              %
            </th>
          </tr>
        </thead>
        <tbody aria-live="polite">
          {rows.map((row) => (
            <tr
              key={row.clubId}
              className={`group ${row.position <= 5 ? "bg-[#f4f8fe]" : "bg-transparent"} hover:bg-[#eef4fd]`}
            >
              <td className="rounded-l-xl py-2 pl-2 font-bold text-black/40 tabular-nums sm:py-2.5">
                {row.position}
              </td>
              <td className="py-2 sm:py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <ClubBadge club={row.club} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{row.club.name}</p>
                    <div className="mt-1 h-1.5 max-w-64 overflow-hidden rounded-full bg-black/6">
                      <div
                        className="h-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                        style={{
                          width: `${Math.max((row.percentage / max) * 100, 1.5)}%`,
                          backgroundColor: row.club.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden py-2 text-right font-medium text-black/70 tabular-nums sm:table-cell sm:py-2.5">
                {formatVotes(row.votes)}
              </td>
              <td className="rounded-r-xl py-2 pr-2 text-right tabular-nums sm:py-2.5">
                <span className="font-bold whitespace-nowrap">
                  {formatPercentage(row.percentage)}
                </span>
                <span className="block text-[0.6875rem] text-black/45 sm:hidden">
                  {formatVotes(row.votes)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!searching && total === 0 && (
        <p className="py-6 text-center text-sm text-black/55">
          Sin votos registrados.
        </p>
      )}

      {searching && rows.length === 0 && (
        <p className="py-6 text-center text-sm text-black/55">
          Ningún equipo con votos coincide con «{query.trim()}».
        </p>
      )}

      {!searching && total > INITIAL_ROWS && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mx-auto mt-4 flex h-11 cursor-pointer items-center gap-2 rounded-full border border-black/12 bg-white px-5 text-sm font-semibold text-black/80 transition-colors hover:bg-[#f4f7fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-results-blue"
        >
          {expanded ? "Ver solo los 20 primeros" : `Ver los ${total} equipos`}
          <ChevronDown
            aria-hidden="true"
            className={`size-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </section>
  );
}
