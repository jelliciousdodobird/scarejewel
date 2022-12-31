import { SchedulePage } from "../../client-pages/SchedulePage/SchedulePage";

export default async function Page() {
  // Fetch data directly in a Server Component
  // const recentPosts = await getPosts();
  // Forward fetched data to your Client Component
  return <SchedulePage />;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      classsections: {
        Row: {
          uid: string;
          semester: string;
          year: number;
          dept_abbr: string;
          dept_title: string;
          course_number: string;
          course_title: string;
          units: string;
          group_id: string;
          section_type: string;
          section_number: string;
          class_number: string;
          instructor_fn: string;
          instructor_ln: string;
          days: string;
          time_start: number;
          time_end: number;
          location: string;
          comment: string | null;
        };
        Insert: {
          uid?: string;
          semester: string;
          year: number;
          dept_abbr: string;
          dept_title: string;
          course_number: string;
          course_title: string;
          units: string;
          group_id: string;
          section_type: string;
          section_number: string;
          class_number: string;
          instructor_fn: string;
          instructor_ln: string;
          days: string;
          time_start: number;
          time_end: number;
          location: string;
          comment?: string | null;
        };
        Update: {
          uid?: string;
          semester?: string;
          year?: number;
          dept_abbr?: string;
          dept_title?: string;
          course_number?: string;
          course_title?: string;
          units?: string;
          group_id?: string;
          section_type?: string;
          section_number?: string;
          class_number?: string;
          instructor_fn?: string;
          instructor_ln?: string;
          days?: string;
          time_start?: number;
          time_end?: number;
          location?: string;
          comment?: string | null;
        };
      };
      test: {
        Row: {
          test: string;
        };
        Insert: {
          test: string;
        };
        Update: {
          test?: string;
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
