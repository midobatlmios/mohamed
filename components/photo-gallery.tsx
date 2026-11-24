"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { Photo } from "@/lib/photos"

gsap.registerPlugin(useGSAP)

const SELECTED = 12
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * The darkroom. A "Selected" strip of the first 12 photos (native swipe; pinned, scrubbed
 * sideways with inner parallax by MotionRoot on wide screens). Any photo zooms from where it
 * sits into a full-screen viewer that walks every photo in the folder, not only the strip.
 */
export function PhotoGallery({ photos, head }: { photos: Photo[]; head?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const flipFrom = useRef<DOMRect | null>(null)
  const [index, setIndex] = useState<number | null>(null)
  const selected = photos.slice(0, SELECTED)

  const open = (i: number, from: HTMLElement) => {
    flipFrom.current = from.querySelector("img")?.getBoundingClientRect() ?? null
    setIndex(i)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  const step = useCallback((d: number) => {
    flipFrom.current = null
    setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length))
  }, [photos.length])

  // FLIP: the photo grows from its thumbnail's position into the viewer
  useLayoutEffect(() => {
    const from = flipFrom.current
    const img = dialog.current?.querySelector<HTMLImageElement>("figure img")
    if (!from || !img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const to = img.getBoundingClientRect()
    if (!to.width) return
    gsap.fromTo(img,
      { x: from.left - to.left, y: from.top - to.top, scale: from.width / to.width, transformOrigin: "0 0", borderRadius: 14 },
      { x: 0, y: 0, scale: 1, borderRadius: 10, duration: 0.8, ease: "expo.out", clearProps: "transform" })
    flipFrom.current = null
  }, [index])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    // Swipe left/right on touch screens
    let startX = 0, startY = 0
    const onDown = (e: PointerEvent) => { startX = e.clientX; startY = e.clientY }
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return
      const dx = e.clientX - startX, dy = e.clientY - startY
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1)
    }
    const onClose = () => setIndex(null)
    el.addEventListener("keydown", onKey)
    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("close", onClose)
    return () => {
      el.removeEventListener("keydown", onKey); el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointerup", onUp); el.removeEventListener("close", onClose)
    }
  }, [step])

  // A "View" disc follows the pointer over photos (fine pointers only)
  useGSAP(() => {
    const disc = cursor.current
    if (!disc || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const xTo = gsap.quickTo(disc, "x", { duration: still ? 0 : 0.45, ease: "power3" })
    const yTo = gsap.quickTo(disc, "y", { duration: still ? 0 : 0.45, ease: "power3" })
    root.current?.classList.add("has-cursor")
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY)
      const over = (e.target as Element | null)?.closest?.(".ph-open")
      disc.classList.toggle("is-on", !!over)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, { scope: root })

  const label = (p: Photo, i: number) => `Open photo ${i + 1} of ${photos.length}: ${p.alt}`
  const current = index === null ? null : photos[index]

  return <div ref={root} className="ph-root">
    <div className="ph-stage">
      {head}
      <div className="ph-viewport">
        <ul className="ph-track">
          {selected.map((p, i) => <li key={p.src} className="ph-item">
            <button type="button" className="ph-open" style={{ aspectRatio: `${p.width} / ${p.height}` }}
              onClick={(e) => open(i, e.currentTarget)} aria-label={label(p, i)}>
              <span className="ph-inner">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 80vw, 45vw" loading={i < 3 ? "eager" : "lazy"} />
              </span>
            </button>
            <p className="ph-cap"><span>{pad(i + 1)}</span>{p.caption}</p>
          </li>)}
        </ul>
      </div>
      <div className="cv-wrap ph-progress" aria-hidden>
        <span className="ph-count"><b>01</b> / {pad(selected.length)}</span>
        <span className="ph-bar"><i /></span>
        <span className="ph-hint">Scroll</span>
      </div>
    </div>

    <div ref={cursor} className="ph-cursor" aria-hidden><span>View</span></div>

    <dialog ref={dialog} className="ph-dialog" aria-label="Photo viewer" onClick={(e) => { if (e.target === dialog.current) close() }}>
      {current && <figure>
        {/* The original file, so the zoom lands on a sharp image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={current.src} src={current.src} alt={current.alt} width={current.width} height={current.height} />
        <figcaption><span>{pad(index! + 1)} / {pad(photos.length)}</span>{current.caption}</figcaption>
      </figure>}
      <button type="button" className="ph-btn ph-close" onClick={close} aria-label="Close viewer"><X size={20} /></button>
      {photos.length > 1 && <>
        <button type="button" className="ph-btn ph-prev" onClick={() => step(-1)} aria-label="Previous photo"><ArrowLeft size={20} /></button>
        <button type="button" className="ph-btn ph-next" onClick={() => step(1)} aria-label="Next photo"><ArrowRight size={20} /></button>
      </>}
    </dialog>
  </div>
}
