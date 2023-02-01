import supabase from "../../database/supabase";
import { SelectedSnapshot } from "../../components/SelectedSnapshot/SelectedSnapshot";
import { WeeklyQuickView } from "../../components/WeeklyQuickView/WeeklyQuickView";
import { CoursePlan } from "../../components/CoursePlan/CoursePlan";
import { PlanPageHeroSection } from "../../components/PlanPageHeroSection/PlanPageHeroSection";

export default async function PlanPage() {
  const { data } = await supabase.rpc("get_distinct_terms");

  const terms = data ?? [];

  return (
    <div className="relative flex flex-col gap-8 min-h-full py-8">
      <PlanPageHeroSection />
      <SelectedSnapshot />
      <CoursePlan terms={terms} />
      <WeeklyQuickView />
    </div>
  );
}
