import supabase from "../../database/supabase";
import { Instructions } from "../../components/Instructions/Instructions";
import { SelectedSnapshot } from "../../components/SelectedSnapshot/SelectedSnapshot";
import { WeeklyQuickView } from "../../components/WeeklyQuickView/WeeklyQuickView";
import { CoursePlan } from "../../components/CoursePlan/CoursePlan";

export default async function PlanPage() {
  const { data } = await supabase.rpc("get_distinct_terms");

  const terms = data ?? [];

  return (
    <div className="relative flex flex-col gap-8 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full py-8">
      <Instructions />
      <SelectedSnapshot />
      <CoursePlan terms={terms} />
      <WeeklyQuickView />
    </div>
  );
}
