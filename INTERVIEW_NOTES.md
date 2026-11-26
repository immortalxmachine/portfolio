# Interview notes — portfolio architecture

Fifteen questions and answers about how this site is built, for talking through
the design confidently.

### 1. What's the high-level architecture?
Next.js 16 App Router on Vercel. Static content (about, skills, research) lives
in `content/profile.ts`. Projects are pulled **live** from the GitHub REST API
in a server-only data layer (`src/lib/github.ts`), cached with ISR, and rendered
by React Server Components. The CDN serves prerendered HTML; a webhook refreshes
data on demand. A committed JSON snapshot is the fallback if GitHub is down.

### 2. Why pull projects from GitHub instead of hardcoding them?
So the site updates itself. Adding the `portfolio` topic to a repo makes it
appear; removing it hides it. The source of truth is where the work already
lives, so the resume site never drifts from reality.

### 3. Server Components vs Client Components — how did you split them?
Default to Server Components for content and data fetching (no JS shipped).
Client Components (`"use client"`) are only where interaction needs them: the
command palette, theme toggle, filters/search, typewriter, contact form, and the
Mermaid renderer. The project README is rendered **on the server** (including
syntax highlighting), so only Mermaid hydrates on the client.

### 4. How does ISR work here, and why `revalidate = 3600`?
Pages export `revalidate = 3600`: the first request after an hour serves the
cached (stale) page instantly, then regenerates in the background. An hour is a
sane default for a portfolio; precision comes from on-demand revalidation rather
than a short interval (which would hammer the GitHub API).

### 5. How does on-demand revalidation work?
Every GitHub `fetch` is tagged `projects`. `POST /api/revalidate?secret=…`
verifies a shared secret and calls `revalidateTag("projects", "max")`. A GitHub
Actions workflow in each project repo pings that endpoint on push, so changes
appear within seconds. `"max"` gives stale-while-revalidate semantics.

### 6. Next 16 changed the caching model — what did you choose?
Next 16 ships opt-in **Cache Components** (`use cache` / `cacheLife` / `cacheTag`).
I deliberately kept the classic model (`export const revalidate` + `fetch` tags +
`revalidateTag`) because it maps 1:1 to the requirement and is the easiest to
reason about and explain. Both are fully supported.

### 7. How do you handle GitHub API rate limits?
Unauthenticated is 60 req/hour per IP; an optional fine-grained read-only
`GITHUB_TOKEN` lifts it to 5,000. ISR means most requests hit the cache, not
GitHub. CI authenticates with the Actions token. And if a request fails, the
committed `projects.fallback.json` snapshot is served — the page never breaks.

### 8. What's in `portfolio.json` and what's the fallback chain?
Optional per-repo: `title`, `tagline`, `category`, `highlights`, `metrics`,
`demo`, `featured`, `order`. Missing fields fall back to the repo description,
topics (as badges), languages, and `RESUME_BULLETS.md` bullets. Category is
inferred from topics/languages when not set. This logic is pure and unit-tested
in `src/lib/project-mapper.ts`.

### 9. How is the "hover a skill → highlight projects" feature built?
Each skill in `profile.ts` maps to GitHub topics. The Skills and Projects
sections live in one client component (`WorkExplorer`) sharing state. Hovering a
skill sets the active topics; project cards whose `techTopics` intersect are
highlighted, the rest dimmed. Clicking a skill promotes it to a filter.

### 10. How do you render each repo's README safely?
`react-markdown` with `remark-gfm`, `rehype-raw` (allow inline HTML),
`rehype-sanitize` (strip scripts/handlers — defence in depth even though it's my
own content), and `rehype-highlight` (server-side highlighting). Relative image
links are rewritten to `raw.githubusercontent.com`. README headings are shifted
down one level so each page keeps a single `<h1>`.

### 11. How are the OG images and favicons generated?
With `next/og`'s `ImageResponse` — JSX/CSS rendered to PNG at build time. There's
a home card, a per-project card (title + tagline + category), and an "AV"
monogram `icon`/`apple-icon`. No design tool or static assets needed.

### 12. What's the accessibility story?
Semantic landmarks (`header`/`main`/`footer`), a skip-to-content link, visible
focus rings (`:focus-visible`), ≥44px tap targets, `aria-current` on the active
nav item, labelled icon buttons, and `prefers-reduced-motion` that disables
smooth scroll and animations. Theme is class-based to avoid a flash.

### 13. How do you keep client JS and layout shift low?
Server Components by default, `next/font` self-hosting (no layout shift), README
highlighting on the server, Mermaid lazy-loaded only on pages that use it,
`next/image` for the photo, and static prerendering with ISR. Framer Motion is
used sparingly and never blocks content.

### 14. How does the contact form work without a backend server?
A Route Handler (`/api/contact`) validates with zod (shared client/server
schema), checks a honeypot field, and rate-limits per IP. With a `RESEND_API_KEY`
it sends email via Resend; without one it returns a `fallback` flag and the
client opens a prefilled `mailto:` — so it always works.

### 15. What does CI/CD look like?
GitHub Actions runs lint, type-check, Vitest unit tests, a production build, and
Playwright e2e (headless Chromium) on every push/PR. Vercel's Git integration
deploys `main` to production and gives every PR a preview URL. Commits are
authored solely by `immortalxmachine`.
