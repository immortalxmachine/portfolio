import "server-only";

import fallbackData from "../../content/projects.fallback.json";
import { profile } from "../../content/profile";
import {
  bulletsFromResume,
  hasPortfolioTopic,
  mergeProject,
  parsePortfolioJson,
  rewriteReadmeImages,
  sortProjects,
} from "./project-mapper";
import { type GitHubRepo, type Project } from "./types";

/**
 * GitHub-backed project data layer (server-only).
 *
 * A repo appears on the site ONLY if it carries the `portfolio` topic, so the
 * owner controls visibility by adding/removing one topic.
 *
 * Caching: fetches are tagged with PROJECTS_TAG and revalidate hourly (ISR).
 * `POST /api/revalidate` calls `revalidateTag(PROJECTS_TAG)` for instant
 * updates. If GitHub is unreachable we fall back to the committed snapshot in
 * `content/projects.fallback.json` so the site never breaks.
 */
export const PROJECTS_TAG = "projects";
const GH_USER = profile.links.githubUser;
const REVALIDATE_SECONDS = 3600;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
  });
  if (!res.ok) throw new Error(`GitHub request failed ${res.status} for ${url}`);
  return (await res.json()) as T;
}

async function fetchRawFile(
  repo: string,
  branch: string,
  path: string,
): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${GH_USER}/${repo}/${branch}/${path}`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
  });
  if (!res.ok) return null;
  return res.text();
}

async function fetchLanguages(repo: string): Promise<string[]> {
  try {
    const langs = await ghFetch<Record<string, number>>(
      `https://api.github.com/repos/${GH_USER}/${repo}/languages`,
    );
    return Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 4);
  } catch {
    return [];
  }
}

function fallbackProjects(): Project[] {
  return sortProjects(fallbackData as unknown as Project[]);
}

/**
 * All portfolio projects, sorted. Falls back to the committed snapshot if the
 * GitHub API is unreachable. README is NOT fetched here (see `getProject`).
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const repos = await ghFetch<GitHubRepo[]>(
      `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
    );
    const visible = repos.filter(
      (r) => !r.fork && !r.archived && hasPortfolioTopic(r.topics),
    );

    const projects = await Promise.all(
      visible.map(async (repo) => {
        const [pjText, bulletsText, languages] = await Promise.all([
          fetchRawFile(repo.name, repo.default_branch, "portfolio.json"),
          fetchRawFile(repo.name, repo.default_branch, "RESUME_BULLETS.md"),
          fetchLanguages(repo.name),
        ]);
        return mergeProject({
          repo,
          portfolioJson: parsePortfolioJson(pjText),
          languages,
          resumeBullets: bulletsFromResume(bulletsText),
        });
      }),
    );

    if (projects.length === 0 && fallbackProjects().length > 0) {
      return fallbackProjects();
    }
    return sortProjects(projects);
  } catch (err) {
    console.error("[github] getProjects failed, using fallback snapshot:", err);
    return fallbackProjects();
  }
}

/** A single project (by slug) WITH its rendered-ready README. */
export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  const base = projects.find((p) => p.slug === slug);
  if (!base) return null;

  const raw = await fetchRawFile(base.slug, base.defaultBranch, "README.md");
  const readme = raw
    ? rewriteReadmeImages(raw, GH_USER, base.slug, base.defaultBranch)
    : null;
  return { ...base, readme };
}
