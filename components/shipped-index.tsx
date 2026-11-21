"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export type ShippedClient = { name: string; href?: string; note?: string; img?: string }
export type ShippedGroup = { stack: string; detail: string; text: string; clients: ShippedClient[] }

/**
 * The client roster as a large typographic index. On devices with a fine pointer,
 * hovering a row reveals a screenshot of that site that trails the cursor.
 */
export function ShippedIndex({ groups }: { groups: ShippedGroup[] }) {
  const [active, setActive] = useState<string | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const all = groups.flatMap((g) => g.clients)
  const activeImg = all.find((c) => c.name === active)?.img

  useGSAP(() => {
    const el = preview.current
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const d = still ? 0 : 0.6
    // One reusable tween per property instead of a new tween per pointer event
    const xTo = gsap.quickTo(el, "x", { duration: d, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: d, ease: "power3" })
    const rTo = gsap.quickTo(el, "rotation", { duration: still ? 0 : 0.8, ease: "power3" })
    let lastX = 0
    // Level the tilt shortly after the cursor stops
    const settle = gsap.delayedCall(0.12, () => rTo(0)).pause()
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      xTo(e.clientX + 24)
      yTo(Math.max(76, e.clientY - 250))
      if (!still) { rTo(gsap.utils.clamp(-5, 5, (e.clientX - lastX) * 0.3)); settle.restart(true) }
      lastX = e.clientX
    }
    // Scrolling moves rows out from under a still cursor without firing pointerleave
    const onScroll = () => {
      const hit = document.elementFromPoint(target.current.x, target.current.y)
      const row = hit?.closest<HTMLElement>(".sx-list li")
      setActive(row ? row.querySelector(".sx-name")?.textContent ?? null : null)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("scroll", onScroll) }
  })

  return <div className={active ? "sx sx-hovering" : "sx"} onPointerLeave={() => setActive(null)}>
    {groups.map((g) => <div className="sx-group" key={g.stack}>
      <div className="sx-group-head">
        <h3>{g.stack} <span>{g.detail}</span></h3>
        <p>{g.text}</p>
      </div>
      <ul className="sx-list">
        {g.clients.map((c) => {
          const inner = <>
            <span className="sx-mask"><span className="sx-name">{c.name}</span></span>
            <span className="sx-meta">
              {c.note && <small>{c.note}</small>}
              {c.href ? <ArrowUpRight className="sx-arrow" size={22} aria-hidden /> : <span className="sx-arrow-gap" />}
            </span>
            {c.img && <span className="sx-thumb"><Image src={c.img} alt={`Homepage of ${c.name}`} width={1917} height={913} sizes="(max-width: 700px) 100vw, 1px" /></span>}
          </>
          return <li key={c.name} className={active === c.name ? "is-active" : undefined}
            onPointerEnter={() => setActive(c.name)} onFocus={() => setActive(c.name)} onBlur={() => setActive(null)}>
            {c.href
              ? <a className="sx-row" href={c.href} target="_blank" rel="noreferrer" aria-label={`${c.name}, open live site`}>{inner}</a>
              : <div className="sx-row" tabIndex={c.img ? 0 : undefined}>{inner}</div>}
          </li>
        })}
      </ul>
    </div>)}

    <div ref={preview} className={activeImg ? "sx-preview is-on" : "sx-preview"} aria-hidden>
      {all.filter((c) => c.img).map((c) => <Image key={c.name} src={c.img!} alt="" width={1917} height={913} sizes="420px"
        className={c.name === active ? "is-shown" : undefined} />)}
    </div>
  </div>
}
