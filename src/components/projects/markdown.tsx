import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

import { Mermaid } from "./mermaid";

/**
 * Sanitisation schema: the GitHub default (strips scripts/handlers) plus
 * `className` on `span`/`code` so syntax-highlight tokens and language hints
 * survive. README content comes from the owner's own repos, but we sanitise
 * anyway as defence-in-depth.
 */
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span ?? []), "className"],
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
  },
};

/** Server-rendered README. Syntax highlighting runs at render time (no client
 *  JS); only Mermaid diagrams hydrate on the client. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, schema],
          [rehypeHighlight, { ignoreMissing: true, detect: false }],
        ]}
        components={{
          // Shift README headings down one level so the page keeps a single
          // <h1> (the project title). Keeps the document outline accessible.
          /* eslint-disable @typescript-eslint/no-unused-vars -- drop `node` from react-markdown props */
          h1: ({ node, ...p }) => <h2 {...p} />,
          h2: ({ node, ...p }) => <h3 {...p} />,
          h3: ({ node, ...p }) => <h4 {...p} />,
          h4: ({ node, ...p }) => <h5 {...p} />,
          h5: ({ node, ...p }) => <h6 {...p} />,
          /* eslint-enable @typescript-eslint/no-unused-vars */
          a({ href, children, ...props }) {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ ...props }) {
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            return <img loading="lazy" {...props} />;
          },
          code({ className, children, ...props }) {
            const lang = /language-(\w+)/.exec(className ?? "")?.[1];
            if (lang === "mermaid") {
              return <Mermaid chart={String(children).trim()} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
