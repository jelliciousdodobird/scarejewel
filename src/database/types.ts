export const validSemesters = ["Fall", "Spring", "Winter", "Summer"] as const;
export const validSectionTypes = [
  "lab",
  "lec",
  "sem",
  "sup",
  "act",
  "add",
] as const;
export const validClassDays = ["m", "tu", "w", "th", "f", "sa"] as const;
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

export const isSemester = (str: string): str is Semester =>
  validSemesters.some((sem) => sem === str);

export const isSectionType = (str: string): str is SectionType =>
  validSectionTypes.some((classType) => classType === str);

export const isClassDays = (str: string): str is ClassDay =>
  validClassDays.some((day) => day === str);

export const isValidSectionKey = (str: string): str is ValidSectionKey =>
  validSectionKeys.some((key) => key === str);

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
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
