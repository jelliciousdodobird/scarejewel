import { CallToAction } from "../components/HomePageSections/CallToAction/CallToAction.component";
import { Catalog } from "../components/HomePageSections/Catalog/Catalog.component";
import { HeroSection } from "../components/HomePageSections/HeroSection/HeroSection";
import { SmartDays } from "../components/HomePageSections/SmartDays/SmartDays.component";
import { TimeConflict } from "../components/HomePageSections/TimeConflict/TimeConflict.component";

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-full">
      <HeroSection />
      <Catalog />
      <SmartDays />
      <TimeConflict />
      <CallToAction />
    </div>
  );
}
