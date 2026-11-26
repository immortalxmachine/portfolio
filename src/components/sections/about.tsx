import { profile } from "../../../content/profile";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "./section-heading";

export function About() {
  return (
    <section id="about" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="01 / About" title="About" />

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <Reveal className="space-y-5">
            <p className="text-pretty text-xl font-medium leading-relaxed tracking-tight sm:text-2xl">
              {profile.about.headline}
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {profile.about.body}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
              {profile.quickFacts.map((fact) => (
                <div key={fact.label} className="bg-background p-4">
                  <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
