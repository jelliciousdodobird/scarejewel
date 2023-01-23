import { ClassDay } from "../../database/types";

export const day_bg_color: Record<ClassDay, string> = {
  su: "bg-cyan-200",
  m: "bg-rose-200",
  tu: "bg-emerald-200",
  w: "bg-amber-200",
  th: "bg-sky-200",
  f: "bg-fuchsia-200",
  sa: "bg-indigo-200",
  na: "bg-indigo-200",
  tba: "bg-indigo-200",
  // async: "bg-neutral-200",
};

export const day_text_color: Record<ClassDay, string> = {
  su: "text-cyan-700",
  m: "text-rose-700",
  tu: "text-emerald-700",
  w: "text-amber-700",
  th: "text-sky-700",
  f: "text-fuchsia-700",
  sa: "text-indigo-700",
  na: "text-indigo-700",
  tba: "text-indigo-700",
  // async: "text-neutral-700",
};
