import { ImageResponse } from "next/og";

import { profile } from "../../../../content/profile";
import { getProject } from "@/lib/github";

export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-project Open Graph / Twitter card image. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  const title = project?.title ?? slug;
  const tagline = project?.tagline ?? "";
  const category = project?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fafafa",
              color: "#0a0a0a",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          {category && (
            <div
              style={{
                fontSize: 24,
                color: "#a3a3a3",
                border: "1px solid #262626",
                borderRadius: 999,
                padding: "8px 20px",
              }}
            >
              {category}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{title}</div>
          <div
            style={{
              fontSize: 34,
              color: "#a3a3a3",
              display: "flex",
              maxWidth: 1000,
              lineHeight: 1.3,
            }}
          >
            {tagline.slice(0, 120)}
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#a3a3a3" }}>{profile.name} · @{profile.links.githubUser}</div>
      </div>
    ),
    { ...size },
  );
}
