"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";

import { profile } from "../../../content/profile";
import { type Project, type ProjectCategory, PROJECT_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProjectCard, type CardState } from "./project-card";

type CategoryFilter = "All" | ProjectCategory;

const intersects = (a: string[], b: string[]) => a.some((x) => b.includes(x));

/**
 * Combined Skills + Projects experience. They share state so that hovering a
 * skill highlights every project using it, and clicking a skill filters the
 * grid by that skill's topics.
 */
export function WorkExplorer({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [hoveredTopics, setHoveredTopics] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState<CategoryFilter>("All");
  const [query, setQuery] = React.useState("");
  const [techFilters, setTechFilters] = React.useState<Set<string>>(new Set());

  // Categories that actually have projects, in canonical order.
  const categories = React.useMemo<CategoryFilter[]>(() => {
    const present = new Set(projects.map((p) => p.category));
    return ["All", ...PROJECT_CATEGORIES.filter((c) => present.has(c))];
  }, [projects]);

  // Most common topics → tech filter chips.
  const topTopics = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const t of p.techTopics) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .map(([t]) => t);
  }, [projects]);

  // How many projects each skill maps to (for a subtle live count).
  const skillMatchCount = React.useCallback(
    (topics: string[]) => projects.filter((p) => intersects(p.techTopics, topics)).length,
    [projects],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (techFilters.size > 0 && !p.techTopics.some((t) => techFilters.has(t))) return false;
      if (q) {
        const haystack = [p.title, p.tagline, ...p.techTopics, ...p.languages]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [projects, category, techFilters, query]);

  const hasFilters = category !== "All" || query.trim() !== "" || techFilters.size > 0;

  const toggleTech = (topic: string) =>
    setTechFilters((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });

  const onSkillActivate = (topics: string[]) => {
    setCategory("All");
    setTechFilters((prev) => {
      const next = new Set(prev);
      const active = topics.some((t) => prev.has(t));
      topics.forEach((t) => (active ? next.delete(t) : next.add(t)));
      return next;
    });
    setHoveredTopics([]);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => {
    setCategory("All");
    setQuery("");
    setTechFilters(new Set());
  };

  const cardState = (p: Project): CardState => {
    if (hoveredTopics.length === 0) return "normal";
    return intersects(p.techTopics, hoveredTopics) ? "highlight" : "dim";
  };

  return (
    <>
      {/* -------------------------------- Skills -------------------------------- */}
      <section id="skills" className="scroll-mt-16 border-b border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="02 / Skills"
            title="Skills"
            description="Hover a skill to spotlight the projects that use it — or click to filter the work below."
          />
          <div className="space-y-6">
            {profile.skillGroups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const count = skillMatchCount(skill.topics);
                    const active = skill.topics.some((t) => techFilters.has(t));
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onMouseEnter={() => setHoveredTopics(skill.topics)}
                        onMouseLeave={() => setHoveredTopics([])}
                        onFocus={() => setHoveredTopics(skill.topics)}
                        onBlur={() => setHoveredTopics([])}
                        onClick={() => onSkillActivate(skill.topics)}
                        aria-pressed={active}
                        disabled={count === 0}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground/40 hover:bg-accent",
                          count === 0 && "cursor-default opacity-50",
                        )}
                        title={count > 0 ? `${count} project${count > 1 ? "s" : ""}` : "No linked projects yet"}
                      >
                        {skill.name}
                        {count > 0 && (
                          <span
                            className={cn(
                              "font-mono text-[0.65rem]",
                              active ? "text-background/70" : "text-muted-foreground",
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- Projects ------------------------------- */}
      <section id="projects" className="scroll-mt-16 border-b border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="03 / Projects"
            title="Projects"
            description="Pulled live from GitHub — any repo tagged “portfolio” appears here automatically."
          />

          {/* Toolbar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={category === c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      category === c
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative ml-auto w-full sm:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects…"
                  aria-label="Search projects"
                  className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
                />
              </div>
            </div>

            {topTopics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {topTopics.map((t) => {
                  const active = techFilters.has(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-xs transition-colors",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/40",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" aria-hidden />
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Grid / empty state */}
          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">No projects match this filter.</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-sm underline underline-offset-4 hover:text-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((p) => (
                  <motion.div
                    key={p.slug}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProjectCard project={p} state={cardState(p)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
