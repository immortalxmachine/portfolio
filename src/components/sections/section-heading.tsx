import { Reveal } from "@/components/site/reveal";

/** Consistent section header: a mono eyebrow index + large title + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
