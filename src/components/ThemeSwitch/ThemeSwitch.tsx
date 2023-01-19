"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useHasMounted } from "../../hooks/useHasMounted";
// import { useTheme } from "@wits/next-themes";

export const ThemeSwitch = () => {
  const mounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};
