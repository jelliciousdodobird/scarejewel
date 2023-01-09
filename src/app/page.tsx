import HomePage from "../client-pages/HomePage/HomePage";
import supabase from "../database/supabase";
import { Semester } from "../database/types";

// use these if the database fails:
const sems: { semester: Semester }[] = [
  { semester: "Fall" },
  { semester: "Spring" },
  { semester: "Summer" },
];
const yrs = [...Array(2023 - 2008 + 1).keys()].map((y) => ({ year: y + 2008 }));

export default async function Page() {
  // const { data: sems } = await supabase.rpc("get_distinct_semesters");
  // const { data: yrs } = await supabase.rpc("get_distinct_years");

  const semesters = sems ? sems.map(({ semester }) => semester) : [];
  const years = yrs ? yrs.map(({ year }) => year) : [];

  return <HomePage semesters={semesters} years={years} />;
}
