import { ImageResponse } from "next/og";

import { profile } from "../../content/profile";
import { SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Home Open Graph / Twitter card image. */
export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#fafafa",
              color: "#0a0a0a",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 26, color: "#a3a3a3" }}>{profile.status}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, textTransform: "uppercase" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 40, color: "#a3a3a3" }}>{profile.roleLine}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a3a3a3" }}>
          <span>Machine Learning · Data · Full-stack</span>
          <span>@{profile.links.githubUser}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
