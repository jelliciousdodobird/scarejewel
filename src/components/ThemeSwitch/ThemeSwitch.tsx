"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useHasMounted } from "../../hooks/useHasMounted";
// import { useTheme } from "@wits/next-themes";

export const ThemeSwitch = () => {
  const mounted = useHasMounted();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // render a skeleton is not mounted to prevent layout shifts:
  if (!mounted)
    return (
      <button
        type="button"
        className="w-16 h-8 rounded-full bg-slate-100 text-xs grid place-items-center text-black"
      ></button>
    );

  return (
    <button
      type="button"
      className="w-16 h-8 rounded-full bg-slate-100 text-xs grid place-items-center text-black"
      onClick={toggleTheme}
    >
      {theme}
    </button>
  );
};
