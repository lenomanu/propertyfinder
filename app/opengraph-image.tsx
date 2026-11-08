import { ImageResponse } from "next/og";

export const alt = "Property Team — find your place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #102a25 0%, #174d40 58%, #d9a441 150%)",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "80px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 22 }}>
            <div
              style={{
                alignItems: "center",
                background: "#ffffff",
                borderRadius: 24,
                color: "#174d40",
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                height: 88,
                justifyContent: "center",
                width: 88,
              }}
            >
              PT
            </div>
            <div style={{ display: "flex", fontSize: 62, fontWeight: 700 }}>
              Property Team
            </div>
          </div>
          <div style={{ color: "#e4eee9", fontSize: 32 }}>
            Find your place.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
