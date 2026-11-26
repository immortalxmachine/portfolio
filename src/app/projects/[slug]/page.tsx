import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Star } from "lucide-react";

import { getProject, getProjects } from "@/lib/github";
import { firstReadmeImage } from "@/lib/project-mapper";
import { formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { Markdown } from "@/components/projects/markdown";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  const description = project.tagline || project.description || `${project.title} — a project by Adhithyaa V P.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const heroImage = firstReadmeImage(project.readme);

  return (
    <article className="container-page py-12 md:py-16">
      {/* Back link */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All projects
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="muted">{project.category}</Badge>
          {project.languages.length > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              {project.languages.slice(0, 4).join(" · ")}
            </span>
          )}
          {project.updatedAt && (
            <span className="font-mono text-xs text-muted-foreground">
              Updated {formatRelative(project.updatedAt)}
            </span>
          )}
          {project.stars > 0 && (
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Star className="size-3" aria-hidden />
              {project.stars}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        {project.tagline && (
          <p className="mt-2 max-w-2xl text-pretty text-lg text-muted-foreground">
            {project.tagline}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" aria-hidden />
              View on GitHub
            </a>
          </Button>
          {project.demoUrl && (
            <Button asChild variant="outline">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                Live demo
              </a>
            </Button>
          )}
        </div>

        {project.techTopics.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.techTopics.map((t) => (
              <Badge key={t} size="sm">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Metrics as stat cards */}
      {project.metrics.length > 0 && (
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-4">
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Hero screenshot pulled from the README */}
      {heroImage && (
        <figure className="mt-8 flex justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={`${project.title} — preview`}
            className="max-h-[460px] w-auto max-w-full rounded-lg object-contain"
            loading="lazy"
          />
        </figure>
      )}

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-sm leading-relaxed text-muted-foreground">{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech stack */}
      {(project.languages.length > 0 || project.techTopics.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Tech stack</h2>
          {project.languages.length > 0 && (
            <div className="mt-4">
              <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Languages
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.languages.map((l) => (
                  <Badge key={l}>{l}</Badge>
                ))}
              </div>
            </div>
          )}
          {project.techTopics.length > 0 && (
            <div className="mt-4">
              <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Tools &amp; frameworks
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.techTopics.map((t) => (
                  <Badge key={t} size="sm">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Full write-up (README) */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-xl font-semibold tracking-tight">Project details</h2>
        <div className="mt-4">
          {project.readme ? (
            <Markdown>{project.readme}</Markdown>
          ) : (
            <p className="text-muted-foreground">
              No README available.{" "}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                View the repository on GitHub
              </a>
              .
            </p>
          )}
        </div>
      </section>

      {/* Prev / next */}
      {(prev || next) && (
        <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <ArrowLeft className="size-3" aria-hidden />
                Previous
              </span>
              <span className="mt-1 block font-semibold">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-xl border border-border p-4 text-right transition-colors hover:bg-accent sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                Next
                <ArrowRight className="size-3" aria-hidden />
              </span>
              <span className="mt-1 block font-semibold">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
