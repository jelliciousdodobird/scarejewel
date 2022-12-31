"use client";

import { ThemeProvider } from "next-themes";

type ProvidersProps = {
  children: React.ReactNode;
};

export function ThemeProviders({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
