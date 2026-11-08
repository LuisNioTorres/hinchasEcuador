import { Crown } from "lucide-react";
import { ClubBadge } from "@/components/vote/club-badge";
import { inkOn } from "@/lib/color";
import {
  formatPercentage,
  formatVotes,
  type RankingEntry,
} from "@/lib/results/rankings";
import { clubOf } from "@/mocks/catalog-lookup";

/**
 * Top 5 de un ámbito: el líder en una tarjeta destacada con el color del club, y
 * del 2.º al 5.º en filas con una barra proporcional al líder.
 */
export function TopFive({
  entries,
  title,
}: {
  entries: readonly RankingEntry[];
  title: string;
}) {
  const [leader, ...rest] = entries.slice(0, 5);
  if (!leader) return null;
  const leaderClub = clubOf(leader.clubId);
  const max = leader.percentage || 1;

  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <article
        className="relative overflow-hidden rounded-[1.75rem] p-5 shadow-[0_1.25rem_2.5rem_rgba(15,30,60,0.18)] ring-1 ring-black/5 sm:p-6 lg:p-7"
        style={{
          backgroundColor: leaderClub.color,
          color: inkOn(leaderClub.color),
        }}
      >
        {/* Brillo diagonal sutil, como la tarjeta del hincha. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.08)_100%)]"
        />
        <div className="relative flex items-center gap-4">
          <ClubBadge
            club={leaderClub}
            className="size-16 shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2)] sm:size-20 lg:size-24"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-bold tracking-[0.14em] uppercase opacity-90">
              <Crown aria-hidden="true" className="size-3.5" />
              1.º · Líder
            </p>
            <p className="mt-1 text-xl leading-tight font-bold sm:text-2xl lg:text-[1.75rem]">
              {leaderClub.name}
            </p>
            {/* En teléfono, el porcentaje va debajo del nombre para que este no se parta. */}
            <p className="mt-1 text-sm font-semibold tabular-nums sm:hidden">
              {formatPercentage(leader.percentage)}
              <span className="font-medium opacity-80">
                {" "}
                · {formatVotes(leader.votes)} votos
              </span>
            </p>
          </div>
          <div className="text-right max-sm:hidden">
            <p className="text-2xl leading-none font-bold tabular-nums sm:text-3xl lg:text-4xl">
              {formatPercentage(leader.percentage)}
            </p>
            <p className="mt-1 text-xs font-medium opacity-85 tabular-nums">
              {formatVotes(leader.votes)} votos
            </p>
          </div>
        </div>
      </article>

      <ol className="flex flex-col gap-2" start={2}>
        {rest.map((entry) => {
          const club = clubOf(entry.clubId);
          return (
            <li
              key={entry.clubId}
              className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:gap-4 lg:px-5 lg:py-4"
            >
              <span className="w-5 shrink-0 text-center text-sm font-bold text-black/40 tabular-nums">
                {entry.position}
              </span>
              <ClubBadge club={club} className="size-9 lg:size-11" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-bold">{club.name}</p>
                  <p className="shrink-0 text-sm font-bold tabular-nums">
                    {formatPercentage(entry.percentage)}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/6">
                    <div
                      className="h-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                      style={{
                        width: `${(entry.percentage / max) * 100}%`,
                        backgroundColor: club.color,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-[0.6875rem] text-black/50 tabular-nums">
                    {formatVotes(entry.votes)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
