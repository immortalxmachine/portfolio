"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ArrowRight,
  Copy,
  Download,
  FileText,
  FolderGit2,
  Moon,
  Sun,
} from "lucide-react";

import { profile, sections } from "../../../content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

type ProjectIndexItem = { slug: string; title: string; category: string };

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
 * ⌘K / Ctrl+K command palette. Provides a context so the nav button can open
 * it, and wraps the app so consumers are inside the provider.
 */
export function CommandPalette({
  projects,
  children,
}: {
  projects: ProjectIndexItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

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

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    // Defer so the dialog closes before navigation/scroll.
    requestAnimationFrame(fn);
  }, []);

  const go = (url: string) => run(() => (window.location.href = url));

  const ctx = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <CommandPaletteContext.Provider value={ctx}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        className="cmdk-root"
      >
        <Command.Input placeholder="Jump to a section, project, or action…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Sections">
            {sections.map((s) => (
              <Command.Item
                key={s.id}
                value={`section ${s.label}`}
                onSelect={() => go(s.id === "home" ? "/" : `/#${s.id}`)}
              >
                <ArrowRight className="size-4" aria-hidden />
                {s.label}
              </Command.Item>
            ))}
          </Command.Group>

          {projects.length > 0 && (
            <Command.Group heading="Projects">
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`project ${p.title} ${p.category}`}
                  onSelect={() => go(`/projects/${p.slug}`)}
                >
                  <FolderGit2 className="size-4" aria-hidden />
                  {p.title}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {p.category}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Actions">
            <Command.Item
              value="download resume cv"
              onSelect={() => run(() => window.open(profile.resumePath, "_blank"))}
            >
              <Download className="size-4" aria-hidden />
              Download résumé
            </Command.Item>
            <Command.Item
              value="view resume page"
              onSelect={() => go("/resume")}
            >
              <FileText className="size-4" aria-hidden />
              View résumé page
            </Command.Item>
            <Command.Item
              value="copy email address"
              onSelect={() =>
                run(async () => {
                  await navigator.clipboard.writeText(profile.email);
                  toast.success("Email copied to clipboard");
                })
              }
            >
              <Copy className="size-4" aria-hidden />
              Copy email
            </Command.Item>
            <Command.Item
              value="toggle theme dark light"
              onSelect={() =>
                run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
              Toggle theme
            </Command.Item>
            <Command.Item
              value="open github profile"
              onSelect={() => run(() => window.open(profile.links.github, "_blank"))}
            >
              <GithubIcon className="size-4" aria-hidden />
              GitHub profile
            </Command.Item>
            <Command.Item
              value="open linkedin profile"
              onSelect={() => run(() => window.open(profile.links.linkedin, "_blank"))}
            >
              <LinkedinIcon className="size-4" aria-hidden />
              LinkedIn profile
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </CommandPaletteContext.Provider>
  );
}
