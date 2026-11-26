"use client";

import * as React from "react";
import Link from "next/link";
import { Command as CommandIcon, Menu, X } from "lucide-react";

import { profile, sections } from "../../../content/profile";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useCommandPalette } from "./command-palette";

function hrefFor(id: string) {
  return id === "home" ? "/" : `/#${id}`;
}

export function SiteNav() {
  const { open: openPalette } = useCommandPalette();
  const [active, setActive] = React.useState<string>("home");
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Highlight the section currently in view (home page only; harmless elsewhere).
  React.useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav
        className="container-page flex h-16 items-center justify-between gap-4"
        aria-label="Primary"
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${profile.name} — home`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground font-mono text-sm font-bold text-background">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            {profile.name}
          </span>
        </Link>

        {/* Desktop section links */}
        <ul className="hidden items-center gap-1 md:flex">
          {sections
            .filter((s) => s.id !== "home")
            .map((s) => (
              <li key={s.id}>
                <a
                  href={hrefFor(s.id)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active === s.id && "text-foreground",
                  )}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.label}
                </a>
              </li>
            ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open command menu (K)"
            className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <CommandIcon className="size-3.5" aria-hidden />
            <span className="font-mono">K</span>
          </button>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="hidden h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            <GithubIcon className="size-4" aria-hidden />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="hidden h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            <LinkedinIcon className="size-4" aria-hidden />
          </a>

          <ThemeToggle />

          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <a href="/resume">Résumé</a>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </nav>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="container-page flex flex-col py-2">
            {sections
              .filter((s) => s.id !== "home")
              .map((s) => (
                <li key={s.id}>
                  <a
                    href={hrefFor(s.id)}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-3 text-base text-foreground hover:bg-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            <li className="mt-1 flex items-center gap-2 px-2 py-2">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-border"
              >
                <GithubIcon className="size-4" aria-hidden />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-border"
              >
                <LinkedinIcon className="size-4" aria-hidden />
              </a>
              <Button asChild size="sm" variant="outline" className="ml-auto">
                <a href="/resume" onClick={() => setMenuOpen(false)}>
                  Résumé
                </a>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
