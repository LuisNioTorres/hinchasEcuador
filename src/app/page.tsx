import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionDivider } from "@/components/layout/section-divider";
import { HeroSection } from "@/components/home/hero-section";
import { ResultsSection } from "@/components/home/results-section";
import { AboutSection } from "@/components/home/about-section";
import { mockNationalResults } from "@/mocks/national-results";
import { mockProvinceLeaders } from "@/mocks/provincial-results";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SectionDivider />
        <ResultsSection
          results={mockNationalResults}
          provinceLeaders={mockProvinceLeaders}
        />
        <SectionDivider />
        <AboutSection />
      </main>
      <SectionDivider />
      <SiteFooter />
    </>
  );
}
