"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/** Sonner toaster that follows the active theme. */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as "light" | "dark") ?? "system"}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-md !border !border-border !bg-background !text-foreground !font-sans",
        },
      }}
    />
  );
}
