import { Header } from "@/components/navigation/Header";
import { HeroExperience } from "@/components/hero/HeroExperience";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#ffffff]">
        <HeroExperience />
      </main>
    </>
  );
}
