import Link from "next/link";
import { ArrowUpRight, ExternalLink, Star } from "lucide-react";

import { type Project } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons";

export type CardState = "normal" | "highlight" | "dim";

const MAX_BADGES = 6;

/** Presentational project card. Whole card links to the detail page; the
 *  GitHub/Demo links sit above it and stop propagation. */
export function ProjectCard({
  project,
  state = "normal",
}: {
  project: Project;
  state?: CardState;
}) {
  const extraBadges = Math.max(0, project.techTopics.length - MAX_BADGES);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        state === "highlight" && "ring-2 ring-foreground",
        state === "dim" && "opacity-40",
      )}
    >
      {/* Full-card link to detail page */}
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 rounded-xl"
        aria-label={`${project.title} — view details`}
      />

      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge variant="muted">{project.category}</Badge>
        <div className="flex items-center gap-3 font-mono text-[0.68rem] text-muted-foreground">
          {project.stars > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3" aria-hidden />
              {project.stars}
            </span>
          )}
          {project.updatedAt && <span>{formatRelative(project.updatedAt)}</span>}
        </div>
      </div>

      <h3 className="flex items-center gap-1 text-lg font-semibold tracking-tight">
        {project.title}
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </h3>

      {project.tagline && (
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {project.tagline}
        </p>
      )}

      {project.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {project.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex gap-2 text-sm leading-snug">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
              <span className="line-clamp-2 text-muted-foreground">{h}</span>
            </li>
          ))}
        </ul>
      )}

      {project.metrics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.metrics.slice(0, 3).map((m) => (
            <span
              key={m.label}
              className="rounded-md border border-border px-2 py-1 text-xs"
            >
              <span className="font-semibold">{m.value}</span>{" "}
              <span className="text-muted-foreground">{m.label}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.techTopics.slice(0, MAX_BADGES).map((t) => (
          <Badge key={t} size="sm">
            {t}
          </Badge>
        ))}
        {extraBadges > 0 && (
          <Badge size="sm" variant="muted">
            +{extraBadges}
          </Badge>
        )}
      </div>

      {/* Footer links (above the full-card link) */}
      <div className="relative z-10 mt-5 flex items-center gap-4 border-t border-border pt-4 text-sm">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <GithubIcon className="size-4" aria-hidden />
          Code
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-4" aria-hidden />
            Live demo
          </a>
        )}
        {project.languages.length > 0 && (
          <span className="ml-auto truncate font-mono text-[0.68rem] text-muted-foreground">
            {project.languages.slice(0, 3).join(" · ")}
          </span>
        )}
      </div>
    </article>
  );
}
