import { ImageResponse } from "next/og";

import { profile } from "../../content/profile";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated "AV" monogram favicon. */
export default function Icon() {
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
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -1,
          borderRadius: 7,
        }}
      >
        {profile.initials}
      </div>
    ),
    { ...size },
  );
}
