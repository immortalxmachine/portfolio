import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, FileText, FlaskConical } from "lucide-react";

import { profile } from "../../../../content/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** All research entries (currently one). Keyed by slug for the dynamic route. */
const researchItems = [profile.research];

function getResearch(slug: string) {
  return researchItems.find((r) => r.slug === slug) ?? null;
}

export function generateStaticParams() {
  return researchItems.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getResearch(slug);
  if (!r) return { title: "Research not found" };
  return {
    title: r.title,
    description: r.summary,
    alternates: { canonical: `/research/${r.slug}` },
    openGraph: {
      type: "article",
      title: r.title,
      description: r.summary,
      url: `/research/${r.slug}`,
    },
    twitter: { card: "summary_large_image", title: r.title, description: r.summary },
  };
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getResearch(slug);
  if (!r) notFound();

  return (
    <article className="container-page py-12 md:py-16">
      {/* Back link */}
      <Link
        href="/#research"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to research
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-border pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
          <FlaskConical className="size-3.5" aria-hidden />
          {r.field}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{r.title}</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {r.venue} · {r.date}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={r.paperUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="size-4" aria-hidden />
              Read paper
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={r.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              Live demo
            </a>
          </Button>
        </div>
      </header>

      {/* Abstract */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Abstract</h2>
        <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
          {r.abstract}
        </p>
      </section>

      {/* Highlights */}
      {r.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {r.highlights.map((h) => (
              <li key={h} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-sm leading-relaxed text-muted-foreground">{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech stack */}
      {r.stack.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Tech stack</h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {r.stack.map((t) => (
              <Badge key={t} size="sm">
                {t}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Embedded live demo */}
      {r.embedUrl && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-tight">Try the live demo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Running on Hugging Face Spaces — upload a leaf image and environmental inputs to
            classify the disease.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
            <iframe
              src={r.embedUrl}
              title={`${r.title} — live demo`}
              className="h-[600px] w-full"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </section>
      )}
    </article>
  );
}
