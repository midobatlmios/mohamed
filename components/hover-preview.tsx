"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

type Img = { src: string; w: number; h: number; alt: string }

/**
 * Wraps a row; while the pointer is over it (fine pointers only), a screenshot trails
 * the cursor, the same way the client-site index previews work. Touch screens rely on
 * the inline screenshot the row renders itself.
 */
export function HoverPreview({ img, children, className, as: Tag = "div" }: { img: Img; children: React.ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const preview = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)
  const fine = useRef(false)
  const move = useRef<(x: number, y: number) => void>(() => {})

  useGSAP(() => {
    const el = preview.current
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    fine.current = true
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const d = still ? 0 : 0.6
    const xTo = gsap.quickTo(el, "x", { duration: d, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: d, ease: "power3" })
    move.current = (x, y) => { xTo(x + 24); yTo(Math.max(76, y - 250)) }
    let last = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { last = { x: e.clientX, y: e.clientY }; move.current(e.clientX, e.clientY) }
    // Scrolling can carry the row away from a still cursor without a pointerleave
    const onScroll = () => {
      const hit = document.elementFromPoint(last.x, last.y)
      setOn(!!(hit && row.current?.contains(hit)))
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("scroll", onScroll) }
  })

  return <Tag ref={row as never} className={on ? `${className ?? ""} hp-active` : className}
    onPointerEnter={(e) => { if (!fine.current) return; gsap.set(preview.current, { x: e.clientX + 24, y: Math.max(76, e.clientY - 250) }); setOn(true) }}
    onPointerLeave={() => setOn(false)}>
    {children}
    <div ref={preview} className={on ? "sx-preview is-on" : "sx-preview"} aria-hidden>
      <Image src={img.src} alt="" width={img.w} height={img.h} sizes="460px" className="is-shown" />
    </div>
  </Tag>
}
