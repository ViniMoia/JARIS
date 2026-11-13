import { HeroExperience } from "@/components/hero/HeroExperience";
import { OperationalPainsSection } from "@/components/sections/OperationalPainsSection";
import { ModularEcosystemSection } from "@/components/sections/ModularEcosystemSection";
import { PdcaSection } from "@/components/sections/PdcaSection";
import { AiHighlightsSection } from "@/components/sections/AiHighlightsSection";
import { DataIntelligenceSection } from "@/components/sections/DataIntelligenceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="w-full bg-[#ffffff]">
      <HeroExperience />
      <OperationalPainsSection />
      <ModularEcosystemSection />
      <PdcaSection />
      <AiHighlightsSection />
      <DataIntelligenceSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
