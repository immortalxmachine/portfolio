"use client";

import * as React from "react";
import { ArrowDown, Download } from "lucide-react";
import { useReducedMotion } from "framer-motion";

import { profile } from "../../../content/profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

/** Rotating typewriter effect; degrades to a simple rotation under
 *  prefers-reduced-motion (no per-character typing). All state updates happen
 *  inside timers (never synchronously in the effect body). */
function useTypewriter(phrases: string[]) {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (reduce) {
      const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 2600);
      return () => clearInterval(id);
    }
    const current = phrases[index];
    const done = typed === current;
    const cleared = typed === "";

    let delay = deleting ? 45 : 85;
    if (done && !deleting) delay = 1500; // pause at full word
    if (cleared && deleting) delay = 250;

    const id = setTimeout(() => {
      if (!deleting && done) {
        setDeleting(true);
      } else if (deleting && cleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setTyped((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1),
        );
      }
    }, delay);
    return () => clearTimeout(id);
  }, [typed, deleting, index, phrases, reduce]);

  // Under reduced motion the full phrase is shown directly (derived, not state).
  const text = reduce ? phrases[index] : typed;
  return { text, reduce };
}

function Monogram() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <span className="font-mono text-6xl font-bold tracking-tight text-muted-foreground">
        {profile.initials}
      </span>
    </div>
  );
}

export function Hero() {
  const { text, reduce } = useTypewriter([...profile.typewriter]);

  return (
    <section
      id="home"
      className="relative scroll-mt-16 overflow-hidden border-b border-border"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-grid opacity-60" />
      <div className="container-page relative grid items-center gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:py-28">
        {/* Left: intro */}
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full bg-foreground opacity-60",
                  !reduce && "animate-ping",
                )}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
            </span>
            {profile.status}
          </span>

          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {profile.name}
            </h1>
            <p className="text-lg font-medium text-muted-foreground sm:text-xl">
              {profile.roleLine}
            </p>
          </div>

          {/* Typewriter line */}
          <p
            className="flex min-h-7 items-center font-mono text-base text-foreground sm:text-lg"
            aria-live="polite"
          >
            <span className="text-muted-foreground">$&nbsp;</span>
            <span>{text}</span>
            <span
              className={cn(
                "ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 bg-foreground",
                !reduce && "animate-pulse",
              )}
              aria-hidden
            />
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <a href="#projects">
                View Projects
                <ArrowDown className="size-4" aria-hidden />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={profile.resumePath} download>
                <Download className="size-4" aria-hidden />
                Download Résumé
              </a>
            </Button>
            <div className="flex items-center gap-1">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-5" aria-hidden />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <LinkedinIcon className="size-5" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Right: monogram mark */}
        <div className="mx-auto w-full max-w-xs md:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <Monogram />
          </div>
        </div>
      </div>
    </section>
  );
}
