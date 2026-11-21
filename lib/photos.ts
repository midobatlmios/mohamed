import fs from "node:fs"
import path from "node:path"

export type Photo = { src: string; width: number; height: number; caption?: string; alt: string }

const DIR = path.join(process.cwd(), "public", "photos")
const EXT = /\.(jpe?g|png|webp)$/i

/** Reads pixel size from the file header (JPEG, PNG, WebP) so next/image can reserve space. */
function size(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file)
  // PNG: IHDR
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16)
    if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) }
    if (kind === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
    if (kind === "VP8L") { const v = b.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 } }
  }
  // JPEG: walk segments to the first SOFn marker
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      const len = b.readUInt16BE(i + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) }
      }
      i += 2 + len
    }
  }
  return null
}

/**
 * Every image in public/photos, sorted by file name (prefix with 01-, 02- … to set the order).
 * Optional captions: public/photos/captions.json → { "01-medina.jpg": "Old medina, Casablanca" }.
 * Note: JPEG EXIF rotation is not applied; export portrait shots already rotated.
 */
export function getPhotos(): Photo[] {
  if (!fs.existsSync(DIR)) return []
  let captions: Record<string, string> = {}
  const capFile = path.join(DIR, "captions.json")
  if (fs.existsSync(capFile)) {
    try { captions = JSON.parse(fs.readFileSync(capFile, "utf8")) } catch { captions = {} }
  }
  return fs.readdirSync(DIR)
    .filter((f) => EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .flatMap((f) => {
      const dim = size(path.join(DIR, f))
      // "07-street-lamp-at-night.jpg" → "Street lamp at night"
      const words = f.replace(/\.[^.]+$/, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim()
      const alt = captions[f] ?? (words ? words[0].toUpperCase() + words.slice(1) : "Photograph by Mohamed Bouamlat")
      return dim ? [{ src: `/photos/${encodeURIComponent(f)}`, ...dim, caption: captions[f], alt }] : []
    })
}
