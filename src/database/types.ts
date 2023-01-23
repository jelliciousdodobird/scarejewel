export const validSemesters = ["Fall", "Spring", "Winter", "Summer"] as const;
export const validSectionTypes = [
  "lab",
  "lec",
  "sem",
  "sup",
  "act",
  "add",
] as const;
export const validClassDays = [
  "su",
  "m",
  "tu",
  "w",
  "th",
  "f",
  "sa",
  "na",
  "tba",
] as const;
export const validSectionKeys = [
  "section_number",
  "class_number",
  "section_type",
  "days",
  "time",
  "location",
  "instructor",
  "comment",
] as const;

export type Semester = typeof validSemesters[number];
export type SectionType = typeof validSectionTypes[number];
export type ClassDay = typeof validClassDays[number];
export type ValidSectionKey = typeof validSectionKeys[number];
export type Term = { semester: Semester; year: number };

export const isSemester = (str: string): str is Semester =>
  validSemesters.some((sem) => sem === str);

export const isSectionType = (str: string): str is SectionType =>
  validSectionTypes.some((classType) => classType === str);

export const isClassDays = (str: string): str is ClassDay =>
  validClassDays.some((day) => day === str);

export const isValidSectionKey = (str: string): str is ValidSectionKey =>
  validSectionKeys.some((key) => key === str);

export type ClassSection =
  Database["public"]["Tables"]["class_sections"]["Row"];

export interface Database {
  public: {
    Tables: {
      class_sections: {
        Row: {
          uid: string;
          semester: Semester;
          year: number;
          dept_abbr: string;
          dept_title: string;
          course_number: string;
          course_title: string;
          units: string;
          group_id: string;
          section_type: SectionType;
          section_number: string;
          class_number: string;
          instructor_fn: string;
          instructor_ln: string;
          days: string;
          time_start: number;
          time_end: number;
          location: string;
          comment: string;
        };
        Insert: {
          uid?: string;
          semester: Semester;
          year: number;
          dept_abbr: string;
          dept_title: string;
          course_number: string;
          course_title: string;
          units: string;
          group_id: string;
          section_type: SectionType;
          section_number: string;
          class_number: string;
          instructor_fn: string;
          instructor_ln: string;
          days: string;
          time_start: number;
          time_end: number;
          location: string;
          comment: string;
        };
        Update: {
          uid?: string;
          semester?: Semester;
          year?: number;
          dept_abbr?: string;
          dept_title?: string;
          course_number?: string;
          course_title?: string;
          units?: string;
          group_id?: string;
          section_type?: SectionType;
          section_number?: string;
          class_number?: string;
          instructor_fn?: string;
          instructor_ln?: string;
          days?: string;
          time_start?: number;
          time_end?: number;
          location?: string;
          comment?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_distinct_course_ids: {
        Args: { _semester: string; _year: number; _dept_abbr: string };
        Returns: { uid: string; course_number: string; course_title: string };
      };
      get_distinct_depts: {
        Args: { _semester: string; _year: number };
        Returns: { uid: string; dept_abbr: string; dept_title: string };
      };
      get_distinct_terms: {
        Args: Record<PropertyKey, never>;
        Returns: { semester: Semester; year: number };
      };
      get_distinct_semesters: {
        Args: Record<PropertyKey, never>;
        Returns: { semester: Semester };
      };
      get_distinct_years: {
        Args: Record<PropertyKey, never>;
        Returns: { year: number };
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
