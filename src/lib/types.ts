/** Project domain types shared across the data layer and UI. */

export const PROJECT_CATEGORIES = ["AI/ML", "Data", "GenAI", "Software"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectMetric {
  label: string;
  value: string;
}

/**
 * Optional `portfolio.json` that a repo can place at its root to control how
 * it appears on the site. Every field is optional — sensible fallbacks are
 * derived from the repo itself (see `mergeProject`).
 */
export interface PortfolioJson {
  title?: string;
  tagline?: string;
  category?: ProjectCategory;
  highlights?: string[];
  metrics?: ProjectMetric[];
  demo?: string | null;
  featured?: boolean;
  order?: number;
}

/** A fully-resolved project, ready to render. */
export interface Project {
  /** Repo name, used as the URL slug. */
  slug: string;
  /** Raw repo name. */
  name: string;
  /** Display title (portfolio.json.title ?? repo name). */
  title: string;
  tagline: string;
  category: ProjectCategory;
  description: string;
  highlights: string[];
  metrics: ProjectMetric[];
  /** Repo topics (excluding the controlling `portfolio` topic), used as badges + skill highlighting. */
  techTopics: string[];
  /** Top languages from the GitHub languages API. */
  languages: string[];
  stars: number;
  /** ISO date of the last push. */
  updatedAt: string;
  featured: boolean;
  order: number;
  repoUrl: string;
  homepage: string | null;
  demoUrl: string | null;
  defaultBranch: string;
  ownerAvatar: string | null;
  /** Rendered only on the detail page; null in list views. */
  readme: string | null;
}

/** Minimal GitHub REST repo shape we rely on. */
export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  topics?: string[];
  stargazers_count: number;
  pushed_at: string;
  homepage: string | null;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  owner: { avatar_url: string };
}
