import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { ResultsSection } from "@/components/home/results-section";
import { SectionDivider } from "@/components/layout/section-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SimulationBar } from "@/components/simulation/simulation-bar";
import { homeDataFor, SCENARIOS } from "@/mocks/simulation";

export const metadata: Metadata = {
  title: "Simulación · Página principal",
  robots: { index: false, follow: false },
};

/** TEMPORAL: la página principal con un escenario de pocos votos. No existe en producción. */
export default function SimulacionInicioPage({
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
  const { results, provinceLeaders } = homeDataFor(scenario);

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SectionDivider />
        <ResultsSection results={results} provinceLeaders={provinceLeaders} />
        <SectionDivider />
        <AboutSection />
      </main>
      <SectionDivider />
      <SiteFooter />
      <SimulationBar scenarioId={scenario.id} page="inicio" />
    </>
  );
}
