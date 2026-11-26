"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type RevealTag = "div" | "section" | "li" | "article";

/**
 * Scroll-reveal wrapper using IntersectionObserver + CSS transitions (no
 * animation library). Fades/slides children in once on enter; honours
 * `prefers-reduced-motion` by showing content immediately with no transform.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: RevealTag;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);
  const reduce = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const visible = reduce || shown;
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={reduce ? undefined : { transitionDelay: `${delay}s` }}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out will-change-[opacity,transform]",
        visible ? "opacity-100" : "opacity-0 motion-safe:translate-y-4",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
