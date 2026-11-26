import { Award, Trophy } from "lucide-react";

import { profile } from "../../../content/profile";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "./section-heading";

export function Timeline() {
  return (
    <section id="experience" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="05 / Experience"
          title="Experience & Leadership"
          description="Leadership roles and hackathon results."
        />

        <ol className="relative ml-3 border-l border-border">
          {profile.timeline.map((item, i) => {
            const Icon = item.kind === "hackathon" ? Trophy : Award;
            return (
              <Reveal as="li" key={`${item.role}-${i}`} delay={i * 0.05} className="mb-8 ml-6 last:mb-0">
                <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                  <Icon className="size-3 text-muted-foreground" aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-semibold tracking-tight">{item.role}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.org}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
