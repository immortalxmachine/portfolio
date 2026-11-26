import { ImageResponse } from "next/og";

import { profile } from "../../content/profile";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Generated "AV" monogram apple-touch icon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        {profile.initials}
      </div>
    ),
    { ...size },
  );
}
