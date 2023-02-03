import { HeroSection } from "../components/HeroSection/HeroSection";
import { Instructions } from "../components/Instructions/Instructions";
import { PlanPageHeroSection } from "../components/PlanPageHeroSection/PlanPageHeroSection";

export default async function HomePage() {
  return (
    <div className="relative flex flex-col gap-8 min-h-full pb-8">
      <PlanPageHeroSection />
      {/* <Instructions /> */}
    </div>
  );
}
