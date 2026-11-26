/**
 * Pure, network-free project mapping logic.
 *
 * Kept separate from `github.ts` (which is `server-only`) so these functions
 * can be unit-tested with Vitest and reused by the build-time fallback
 * generator (`scripts/generate-fallback.ts`).
 */
import {
  type GitHubRepo,
  type PortfolioJson,
  type Project,
  type ProjectCategory,
  PROJECT_CATEGORIES,
} from "./types";

export const PORTFOLIO_TOPIC = "portfolio";

/** A repo is shown only if it has the controlling `portfolio` topic. */
export function hasPortfolioTopic(topics: string[] | undefined): boolean {
  return (topics ?? []).includes(PORTFOLIO_TOPIC);
}

/** Topics shown as tech badges: the `portfolio` control topic is removed. */
export function topicsToTech(topics: string[] | undefined): string[] {
  return (topics ?? []).filter((t) => t !== PORTFOLIO_TOPIC);
}

/** Safely parse a repo's `portfolio.json`; invalid/missing → null. */
export function parsePortfolioJson(text: string | null): PortfolioJson | null {
  if (!text) return null;
  try {
    const data = JSON.parse(text) as unknown;
    if (typeof data !== "object" || data === null) return null;
    return data as PortfolioJson;
  } catch {
    return null;
  }
}

/** Extract bullet lines from a RESUME_BULLETS.md as highlight fallbacks. */
export function bulletsFromResume(md: string | null): string[] {
  if (!md) return [];
  return md
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

/** Infer a category when `portfolio.json` doesn't specify one. */
export function deriveCategory(
  pj: PortfolioJson | null,
  topics: string[],
  languages: string[],
): ProjectCategory {
  if (pj?.category && PROJECT_CATEGORIES.includes(pj.category)) {
    return pj.category;
  }
  const t = new Set(topics.map((x) => x.toLowerCase()));
  const hasAny = (...keys: string[]) => keys.some((k) => t.has(k));

  if (hasAny("rag", "retrieval-augmented-generation", "langchain", "llm", "gemini", "genai")) {
    return "GenAI";
  }
  if (hasAny("pytorch", "cnn", "deep-learning", "machine-learning", "scikit-learn", "transfer-learning")) {
    return "AI/ML";
  }
  if (hasAny("etl", "elt", "data-engineering", "forecasting", "sarima", "streamlit", "power-bi")) {
    return "Data";
  }
  const langs = languages.map((l) => l.toLowerCase());
  if (langs.includes("python")) return "AI/ML";
  return "Software";
}

/**
 * Rewrite relative image/link references in a README to absolute raw GitHub
 * URLs so images render on the detail page. Handles markdown `![](path)` and
 * HTML `<img src="path">`. Absolute URLs and anchors are left untouched.
 */
export function rewriteReadmeImages(
  md: string,
  user: string,
  repo: string,
  branch: string,
): string {
  const base = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/`;
  const isAbsolute = (p: string) =>
    /^(https?:)?\/\//i.test(p) ||
    p.startsWith("#") ||
    p.startsWith("data:") ||
    p.startsWith("mailto:");
  const normalize = (p: string) => base + p.replace(/^\.?\//, "");

  let out = md.replace(
    /(!\[[^\]]*\]\()([^)\s]+)(\s+"[^"]*")?(\))/g,
    (_m, pre, path, title = "", post) =>
      isAbsolute(path) ? `${pre}${path}${title}${post}` : `${pre}${normalize(path)}${title}${post}`,
  );

  out = out.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi,
    (_m, pre, path, post) =>
      isAbsolute(path) ? `${pre}${path}${post}` : `${pre}${normalize(path)}${post}`,
  );

  return out;
}

/**
 * Pull the first image URL out of a (already absolute-rewritten) README so the
 * detail page can show it as a hero preview. Looks at markdown `![](url)` and
 * HTML `<img src="url">`, skips tiny shield/badge images, returns null if none.
 */
export function firstReadmeImage(md: string | null): string | null {
  if (!md) return null;
  const urls: string[] = [];
  const mdImg = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlImg = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;
  for (const re of [mdImg, htmlImg]) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(md)) !== null) urls.push(m[1]);
  }
  const isBadge = (u: string) =>
    /shields\.io|badge|\.svg($|\?)|githubusercontent\.com\/.*\/actions\//i.test(u);
  return urls.find((u) => /^https?:\/\//i.test(u) && !isBadge(u)) ?? null;
}

/** Deterministic sort: featured first, then explicit order, then recency. */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * Merge a repo + its portfolio.json + supporting files into a Project.
 * Pure and fully unit-testable — all network I/O happens in the callers.
 */
export function mergeProject(input: {
  repo: GitHubRepo;
  portfolioJson: PortfolioJson | null;
  languages: string[];
  resumeBullets: string[];
  readme?: string | null;
}): Project {
  const { repo, portfolioJson: pj, languages, resumeBullets, readme = null } = input;
  const techTopics = topicsToTech(repo.topics);
  const highlights =
    pj?.highlights && pj.highlights.length > 0
      ? pj.highlights
      : resumeBullets.slice(0, 3);
  const demoUrl =
    pj?.demo ?? (repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : null);

  return {
    slug: repo.name,
    name: repo.name,
    title: pj?.title?.trim() || repo.name,
    tagline: pj?.tagline?.trim() || repo.description?.trim() || "",
    category: deriveCategory(pj, techTopics, languages),
    description: repo.description?.trim() || pj?.tagline?.trim() || "",
    highlights,
    metrics: Array.isArray(pj?.metrics) ? pj!.metrics! : [],
    techTopics,
    languages,
    stars: repo.stargazers_count ?? 0,
    updatedAt: repo.pushed_at,
    featured: Boolean(pj?.featured),
    order: typeof pj?.order === "number" ? pj.order : 999,
    repoUrl: repo.html_url,
    homepage: repo.homepage,
    demoUrl,
    defaultBranch: repo.default_branch,
    ownerAvatar: repo.owner?.avatar_url ?? null,
    readme,
  };
}
