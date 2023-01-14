import supabase from "./supabase";
import { Semester } from "./types";

export const fetchDistinctDepts = async (semester: Semester, year: number) => {
  const { data, error } = await supabase.rpc("get_distinct_depts", {
    _semester: semester,
    _year: year,
  });
  if (error) console.log(error);
  return (
    data?.map((v) => ({ ...v, uid: `${semester}-${year}-${v.dept_abbr}` })) ??
    []
  );
};

export const fetchDistinctCourseIds = async (
  semester: Semester,
  year: number,
  dept: string
) => {
  if (dept === "") return []; // if department is empty dont even try to fetch anything

  const { data, error } = await supabase.rpc("get_distinct_course_ids", {
    _semester: semester,
    _year: year,
    _dept_abbr: dept,
  });
  if (error) console.log(error);

  return (
    data?.map((v) => ({
      ...v,
      uid: `${semester}-${year}-${dept}-${v.course_number}`,
    })) ?? []
  );
};

export const fetchSections = async (
  semester: Semester,
  year: number,
  dept: string,
  course_number: string
) => {
  if (dept === "") return []; // if department is empty dont even try to fetch anything

  const { data, error } = await supabase
    .from("class_sections")
    .select("*")
    .match({
      semester,
      year,
      dept_abbr: dept,
      course_number,
    });
  if (error) console.log(error);

  return data ?? [];
};
