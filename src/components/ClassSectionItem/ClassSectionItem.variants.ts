import { ClassDay } from "../../database/types";

export const day_bg_color: Record<ClassDay, string> = {
  su: "bg-cyan-200 dark:bg-cyan-500",
  m: "bg-rose-200 dark:bg-rose-500",
  tu: "bg-emerald-200 dark:bg-emerald-500",
  w: "bg-amber-200 dark:bg-amber-500",
  th: "bg-sky-200 dark:bg-sky-500",
  f: "bg-fuchsia-200 dark:bg-fuchsia-500",
  sa: "bg-indigo-200 dark:bg-indigo-500",
  na: "bg-indigo-200 dark:bg-indigo-500",
  tba: "bg-indigo-200 dark:bg-indigo-500",
  // async: "bg-neutral-200",
};

export const day_text_color: Record<ClassDay, string> = {
  su: "text-cyan-700 dark:text-cyan-900",
  m: "text-rose-700 dark:text-rose-900",
  tu: "text-emerald-700 dark:text-emerald-900",
  w: "text-amber-700 dark:text-amber-900",
  th: "text-sky-700 dark:text-sky-900",
  f: "text-fuchsia-700 dark:text-fuchsia-900",
  sa: "text-indigo-700 dark:text-indigo-900",
  na: "text-indigo-700 dark:text-indigo-900",
  tba: "text-indigo-700 dark:text-indigo-900",
  // async: "text-neutral-700",
};
