import supabase from "../../database/supabase";
import { SelectedSnapshot } from "../../components/SelectedSnapshot/SelectedSnapshot";
import { WeeklyQuickView } from "../../components/WeeklyQuickView/WeeklyQuickView";
import { CoursePlan } from "../../components/CoursePlan/CoursePlan";

export default async function PlanPage() {
  const { data } = await supabase.rpc("get_distinct_terms");
  const terms = data ?? [];

  return (
    <div className="relative flex flex-col gap-8 min-h-full pb-8">
      <SelectedSnapshot />
      <CoursePlan terms={terms} />
      <WeeklyQuickView />
    </div>
  );
}
