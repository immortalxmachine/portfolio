/** Canonical site metadata + URL resolution, shared across metadata, OG,
 *  sitemap and JSON-LD. */

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // Vercel system env vars (set automatically in deployments).
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Adhithyaa V P",
  title: "Adhithyaa V P — AI, Data & Software Engineering",
  description:
    "Final-year B.Tech CSE (AI & ML) student building machine-learning models, data pipelines and full-stack apps. Explore projects pulled live from GitHub, research and resume.",
  url: getSiteUrl(),
} as const;
