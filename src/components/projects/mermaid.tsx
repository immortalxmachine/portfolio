"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/** Renders a Mermaid diagram from fenced ```mermaid code. Mermaid is loaded
 *  lazily (client-only) so it never bloats pages without diagrams. */
export function Mermaid({ chart }: { chart: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "neutral",
          fontFamily: "var(--font-sans)",
        });
        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart);
        if (active && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [chart, resolvedTheme]);

  if (failed) {
    return (
      <pre>
        <code>{chart}</code>
      </pre>
    );
  }
  return <div ref={ref} className="my-5 flex justify-center overflow-x-auto" aria-hidden />;
}
