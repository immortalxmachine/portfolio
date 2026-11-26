import { revalidateTag } from "next/cache";

import { PROJECTS_TAG } from "@/lib/constants";
import { isValidSecret } from "@/lib/revalidate";

export const runtime = "nodejs";

/**
 * On-demand revalidation webhook.
 *
 *   POST /api/revalidate?secret=YOUR_SECRET
 *
 * Call this from a GitHub Actions workflow on push (see docs/auto-update.md) to
 * refresh project data within seconds instead of waiting for the hourly ISR.
 */
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");

  if (!isValidSecret(secret, process.env.REVALIDATE_SECRET)) {
    return Response.json(
      { revalidated: false, error: "Invalid or missing secret." },
      { status: 401 },
    );
  }

  // "max": serve stale content while fresh project data regenerates in the
  // background (recommended for webhook-triggered revalidation).
  revalidateTag(PROJECTS_TAG, "max");
  return Response.json({ revalidated: true, tag: PROJECTS_TAG, now: Date.now() });
}
