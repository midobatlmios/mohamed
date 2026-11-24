import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/* Home-screen icon: the same eight-point star as the favicon, as a PNG for iOS */
export default function AppleIcon() {
  const square = { position: "absolute" as const, width: 68, height: 68, background: "#ffffff" }
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2f45d6", position: "relative" }}>
      <div style={square} />
      <div style={{ ...square, transform: "rotate(45deg)" }} />
    </div>,
    size,
  )
}
