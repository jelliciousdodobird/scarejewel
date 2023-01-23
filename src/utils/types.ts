import { ClassDay } from "../database/types";
import { PrettyColor } from "./colors";

export interface HasId {
  id: string;
}

export type PrettyColorMap = Record<PrettyColor, string>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type DayName = {
  short: ClassDay;
  medium: string;
  long: string;
};

export const dayNameMap: Record<ClassDay, DayName> = {
  m: { short: "m", medium: "mon", long: "monday" },
  tu: { short: "tu", medium: "tue", long: "tuesday" },
  w: { short: "w", medium: "wed", long: "wednesday" },
  th: { short: "th", medium: "thu", long: "thursday" },
  f: { short: "f", medium: "fri", long: "friday" },
  sa: { short: "sa", medium: "sat", long: "saturday" },
  su: { short: "su", medium: "sun", long: "sunday" },
  na: { short: "na", medium: "n/a", long: "not applicable" },
  tba: { short: "tba", medium: "tba", long: "to be announced" },
  // async: { short: "async", medium: "async", long: "asynchronous" },
};
