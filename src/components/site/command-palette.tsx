"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import type { ProjectIndexItem } from "./command-menu";

// cmdk (and the dialog) only load once the palette is first opened.
const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), {
  ssr: false,
});

interface CommandPaletteContextValue {
  open: () => void;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue>({
  open: () => {},
});

/** Open the command palette from anywhere (e.g. the nav button). */
export function useCommandPalette() {
  return React.useContext(CommandPaletteContext);
}

/**
 * ⌘K / Ctrl+K command palette provider. Keeps a tiny footprint in the initial
 * bundle — the heavy cmdk dialog is code-split and loaded on first open.
 */
export function CommandPalette({
  projects,
  children,
}: {
  projects: ProjectIndexItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const ctx = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}
      {open && <CommandMenu open={open} onOpenChange={setOpen} projects={projects} />}
    </CommandPaletteContext.Provider>
  );
}
