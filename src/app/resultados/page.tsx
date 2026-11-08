import type { Metadata } from "next";
import { UserHeader } from "@/components/layout/user-header";
import { ResultsHero } from "@/components/results/results-hero";
import { StatsSection } from "@/components/results/stats-section";
import { clubOf } from "@/mocks/catalog-lookup";
import { NATIONAL_RANKING, PROVINCE_RESULTS } from "@/mocks/census-votes";
import { CURRENT_USER } from "@/mocks/current-user";

export const metadata: Metadata = {
  title: "Resultados · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

/**
 * Página principal del usuario logueado (después de votar). SIMULACIÓN: el usuario
 * y los votos son ficticios (src/mocks/current-user.ts y src/mocks/census-votes.ts).
 */
export default function ResultadosPage() {
  const provinceColors = new Map(
    [...PROVINCE_RESULTS].flatMap(([provinceId, r]) => {
      const lead = r.ranking.entries[0];
      return lead ? [[provinceId, clubOf(lead.clubId).color] as const] : [];
    }),
  );

  return (
    <>
      <UserHeader fullName={CURRENT_USER.fullName} />
      <main>
        <ResultsHero
          podium={NATIONAL_RANKING.entries.slice(0, 3)}
          totalVotes={NATIONAL_RANKING.total}
          clubsWithVotes={NATIONAL_RANKING.entries.length}
          provinceColors={provinceColors}
        />
        <StatsSection />
      </main>
    </>
  );
}
