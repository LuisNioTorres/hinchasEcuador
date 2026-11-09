import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { UserHeader } from "@/components/layout/user-header";
import { ResultsDataProvider } from "@/components/results/results-data";
import { ResultsHero } from "@/components/results/results-hero";
import { StatsSection } from "@/components/results/stats-section";
import { requireProfile } from "@/lib/auth/current-user";
import { buildResultsData } from "@/lib/results/build";
import { getResultRows } from "@/lib/results/load";
import { clubOf } from "@/mocks/catalog-lookup";

export const metadata: Metadata = {
  title: "Resultados · Censo Único del Ecuador",
  robots: { index: false, follow: false },
};

async function CurrentUserHeader() {
  const { fullName } = await requireProfile();
  return <UserHeader fullName={fullName} />;
}

/** Página principal del usuario logueado (después de votar). */
async function Results() {
  // Se lee al visitar la página: una caída de la base no debe romper una publicación.
  await connection();
  const data = buildResultsData(await getResultRows());
  const provinceColors = new Map(
    [...data.provinceResults].flatMap(([provinceId, r]) => {
      const lead = r.ranking.entries[0];
      return lead ? [[provinceId, clubOf(lead.clubId).color] as const] : [];
    }),
  );

  return (
    <main>
      <ResultsHero
        podium={data.nationalRanking.entries.slice(0, 3)}
        totalVotes={
          data.nationalRanking.total + data.internationalRanking.total
        }
        clubsWithVotes={data.nationalRanking.entries.length}
        provinceColors={provinceColors}
      />
      <ResultsDataProvider value={data}>
        <StatsSection />
      </ResultsDataProvider>
    </main>
  );
}

export default function ResultadosPage() {
  return (
    <>
      <Suspense fallback={<div className="h-(--header-h)" />}>
        <CurrentUserHeader />
      </Suspense>
      <Suspense fallback={<div className="min-h-svh" />}>
        <Results />
      </Suspense>
    </>
  );
}
