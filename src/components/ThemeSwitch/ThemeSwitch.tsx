"use client";

import { IconMoon, IconSun } from "@tabler/icons";
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
      <div className="w-10 aspect-square rounded-xl bg-slate-100 dark:bg-neutral-700" />
    );

  return (
    <button
      type="button"
      className="w-10 aspect-square rounded-xl text-xs grid place-items-center hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-primary-900 dark:hover:text-primary-100"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <IconMoon /> : <IconSun />}
    </button>
  );
};
