import { Suspense } from "react";
import type { Metadata } from "next";
import { UserHeader } from "@/components/layout/user-header";
import { ResultsHero } from "@/components/results/results-hero";
import { StatsSection } from "@/components/results/stats-section";
import { requireProfile } from "@/lib/auth/current-user";
import { clubOf } from "@/mocks/catalog-lookup";
import { NATIONAL_RANKING, PROVINCE_RESULTS } from "@/mocks/census-votes";

export const metadata: Metadata = {
  title: "Resultados · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

async function CurrentUserHeader() {
  const { fullName } = await requireProfile();
  return <UserHeader fullName={fullName} />;
}

/**
 * Página principal del usuario logueado (después de votar). Los votos todavía son
 * ficticios (src/mocks/census-votes.ts).
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
      <Suspense fallback={<div className="h-(--header-h)" />}>
        <CurrentUserHeader />
      </Suspense>
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
