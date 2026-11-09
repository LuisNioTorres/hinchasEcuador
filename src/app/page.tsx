import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionDivider } from "@/components/layout/section-divider";
import { HeroSection } from "@/components/home/hero-section";
import { ResultsSection } from "@/components/home/results-section";
import { AboutSection } from "@/components/home/about-section";
import { getHomeResults } from "@/lib/results/load";

export default async function Home() {
  const { results, provinceLeaders } = await getHomeResults();

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
    </>
  );
}
