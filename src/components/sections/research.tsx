import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, FlaskConical } from "lucide-react";

import { profile } from "../../../content/profile";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";

export function Research() {
  const r = profile.research;
  return (
    <section id="research" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="04 / Research" title="Research" />
        <Reveal>
          <article className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
              <FlaskConical className="size-3.5" aria-hidden />
              {r.field}
            </div>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
              <Link href={`/research/${r.slug}`} className="transition-colors hover:text-primary">
                {r.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {r.venue} · {r.date}
            </p>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              {r.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/research/${r.slug}`}>
                  View details
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={r.paperUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="size-4" aria-hidden />
                  Read Paper
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={r.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" aria-hidden />
                  Live Demo
                </a>
              </Button>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
