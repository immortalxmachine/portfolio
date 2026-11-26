import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Star } from "lucide-react";

import { getProject, getProjects } from "@/lib/github";
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

        {project.metrics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.metrics.map((m) => (
              <span key={m.label} className="rounded-md border border-border px-3 py-1.5 text-sm">
                <span className="font-semibold">{m.value}</span>{" "}
                <span className="text-muted-foreground">{m.label}</span>
              </span>
            ))}
          </div>
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

      {/* README */}
      <div className="mt-8">
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
