import tailwind_colors from "tailwindcss/colors";

export const pretty_colors = [
  "rose",
  "orange",
  "emerald",
  "sky",
  "indigo",
  "fuchsia",
  "yellow",
  "lime",
  "cyan",
  "violet",

  // "black",
  // "blue",
  // "blueGray",
  // "coolGray",
  // "current",
  // "gray",
  // "green",
  // "inherit",
  // "lightBlue",
  // "neutral",
  // "pink",
  // "purple",
  // "red",
  // "slate",
  // "stone",
  // "teal",
  // "transparent",
  // "trueGray",
  // "warmGray",
  // "white",
  // "amber",
  // "zinc",
] as const;

export const shades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

// export const prefixes = ["bg", "text", "border"] as const;

export type PrettyColor = typeof pretty_colors[number];
export type Shade = typeof shades[number];
export type ColorShade = Record<Shade, string>;

export const prettyTailwindColors: Record<PrettyColor, ColorShade> = {
  // amber: tailwind_colors["amber"],
  // "black": tailwind_colors["black"],
  // blue: tailwind_colors["blue"],
  // "blueGray": tailwind_colors["blueGray"],
  // "coolGray": tailwind_colors["coolGray"],
  // "current": tailwind_colors["current"],
  cyan: tailwind_colors["cyan"],
  emerald: tailwind_colors["emerald"],
  fuchsia: tailwind_colors["fuchsia"],
  // gray: tailwind_colors["gray"],
  // green: tailwind_colors["green"],
  indigo: tailwind_colors["indigo"],
  // "inherit": tailwind_colors["inherit"],
  // "lightBlue": tailwind_colors["lightBlue"],
  lime: tailwind_colors["lime"],
  // "neutral": tailwind_colors["neutral"],
  orange: tailwind_colors["orange"],
  // pink: tailwind_colors["pink"],
  // purple: tailwind_colors["purple"],
  // red: tailwind_colors["red"],
  rose: tailwind_colors["rose"],
  sky: tailwind_colors["sky"],
  // slate: tailwind_colors["slate"],
  // stone: tailwind_colors["stone"],
  // teal: tailwind_colors["teal"],
  // "transparent": tailwind_colors["transparent"],
  // "trueGray": tailwind_colors["trueGray"],
  violet: tailwind_colors["violet"],
  // "warmGray": tailwind_colors["warmGray"],
  // "white": tailwind_colors["white"],
  yellow: tailwind_colors["yellow"],
  // zinc: tailwind_colors["zinc"],
};
