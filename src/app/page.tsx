import { Header } from "@/components/navigation/Header";
import { HeroExperience } from "@/components/hero/HeroExperience";
import { OperationalPainsSection } from "@/components/sections/OperationalPainsSection";
import { ModularEcosystemSection } from "@/components/sections/ModularEcosystemSection";
import { PdcaSection } from "@/components/sections/PdcaSection";
import { AiHighlightsSection } from "@/components/sections/AiHighlightsSection";
import { DiferenciaisSection } from "@/components/sections/DiferenciaisSection";
import { DataIntelligenceSection } from "@/components/sections/DataIntelligenceSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#ffffff]">
        <HeroExperience />
        <OperationalPainsSection />
        <ModularEcosystemSection />
        <PdcaSection />
        <AiHighlightsSection />
        <DiferenciaisSection />
        <DataIntelligenceSection />
        <RoadmapSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
