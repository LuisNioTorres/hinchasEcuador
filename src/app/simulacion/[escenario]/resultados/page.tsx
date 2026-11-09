import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserHeader } from "@/components/layout/user-header";
import { ResultsDataProvider } from "@/components/results/results-data";
import { ResultsHero } from "@/components/results/results-hero";
import { StatsSection } from "@/components/results/stats-section";
import { SimulationBar } from "@/components/simulation/simulation-bar";
import { clubOf } from "@/mocks/catalog-lookup";
import { CURRENT_USER } from "@/mocks/current-user";
import { resultsDataFor, SCENARIOS } from "@/mocks/simulation";

export const metadata: Metadata = {
  title: "Simulación · Usuario logueado",
  robots: { index: false, follow: false },
};

/** TEMPORAL: /resultados con un escenario de pocos votos. No existe en producción. */
export default function SimulacionResultadosPage({
  params,
}: {
  params: Promise<{ escenario: string }>;
}) {
  return (
    <Suspense>
      <Simulation params={params} />
    </Suspense>
  );
}

async function Simulation({
  params,
}: {
  params: Promise<{ escenario: string }>;
}) {
  const { escenario } = await params;
  if (process.env.NODE_ENV === "production") notFound();
  const scenario = SCENARIOS.find((s) => s.id === escenario);
  if (!scenario) notFound();
  const data = resultsDataFor(scenario);
  const provinceColors = new Map(
    [...data.provinceResults].flatMap(([provinceId, r]) => {
      const lead = r.ranking.entries[0];
      return lead ? [[provinceId, clubOf(lead.clubId).color] as const] : [];
    }),
  );

  return (
    <>
      <UserHeader fullName={CURRENT_USER.fullName} />
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
      <SimulationBar scenarioId={scenario.id} page="resultados" />
    </>
  );
}
