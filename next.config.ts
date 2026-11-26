import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * We deliberately use the *classic* ISR model (`export const revalidate` +
 * `revalidateTag`) instead of Next 16's opt-in Cache Components. It maps 1:1
 * to this project's requirements (hourly revalidation + on-demand webhook
 * revalidation of the `projects` tag) and is the easiest model to reason about
 * and explain. See `src/lib/github.ts` and `src/app/api/revalidate/route.ts`.
 */
const nextConfig: NextConfig = {
  // Don't leak the framework in response headers.
  poweredByHeader: false,

  // Fail the production build on type errors — we want green or nothing.
  typescript: { ignoreBuildErrors: false },

  images: {
    // Remote images we legitimately render with next/image.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "img.shields.io" },
    ],
  },

  // Tailwind v4 is compiled by its Turbopack plugin (see the scaffold default).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
