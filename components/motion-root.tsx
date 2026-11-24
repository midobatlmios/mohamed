"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * Page-level motion. Everything is created inside one matchMedia context scoped to this
 * root, so it is reverted on unmount and skipped entirely for prefers-reduced-motion.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const q0 = (s: string) => root.current?.querySelector(s)
    const mm = gsap.matchMedia()

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 901px)" }, (ctx) => {
      const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean }
      if (!motion) return
      let cancelled = false

      // Wait for the web font so SplitText measures the real glyphs
      document.fonts.ready.then(() => ctx.add(() => {
        if (cancelled) return
        const q = gsap.utils.selector(root)

        /* 1. Hero: the name rises letter by letter, the portrait opens, the seal rolls in, the band settles */
        gsap.set(q(".cv-hero-main > *, .cv-portrait, .cv-hero-band"), { visibility: "visible" })
        const name = SplitText.create(q(".cv-name"), { type: "words, chars", mask: "chars" })
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .from(name.chars, { yPercent: 110, duration: 1.3, stagger: 0.03 })
          .fromTo(q(".cv-portrait-frame"), { clipPath: "inset(100% 0% 0% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, ease: "expo.inOut" }, 0.1)
          .from(q(".cv-portrait-frame img"), { scale: 1.35, duration: 1.9 }, 0.25)
          .from(q(".cv-badge"), { scale: 0, rotation: -140, duration: 1.2, clearProps: "transform" }, 0.9)
          .from(q(".cv-role, .cv-hero .cv-actions"), { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.45)
          .from(q(".cv-hero-band > div"), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.7)

        // Leaving the hero, the portrait drifts up a touch slower than the page
        gsap.to(q(".cv-portrait-frame"), {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: q(".cv-hero")[0], start: "top top", end: "bottom top", scrub: true },
        })

        /* 2. "Shipped," is drawn up by the scroll */
        const shipped = SplitText.create(q(".cv-work .cv-display"), { type: "chars", mask: "chars" })
        gsap.from(shipped.chars, {
          yPercent: 100, stagger: 0.04, ease: "none",
          scrollTrigger: { trigger: q(".cv-work")[0], start: "top 85%", end: "top 35%", scrub: 0.6 },
        })

        /* 3. Client names slide up out of their row as each batch enters */
        // Trigger on the rows (untransformed) so the shifted names don't delay their own start
        gsap.set(q(".sx-name"), { yPercent: 105 })
        ScrollTrigger.batch(q(".sx-list li"), {
          start: "top 92%",
          once: true,
          onEnter: (rows) => gsap.to(rows.map((r) => r.querySelector(".sx-name")), {
            yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.07, overwrite: true,
            clearProps: "transform", // hand transform back to the CSS hover state
          }),
        })

        /* 4. Case studies: the frame opens and the screenshot settles as you scroll */
        q(".cv-case-media").forEach((media) => {
          gsap.fromTo(media,
            { clipPath: "inset(10% 7% 10% 7% round 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none",
              scrollTrigger: { trigger: media, start: "top 95%", end: "top 45%", scrub: 0.5 } })
          gsap.fromTo(media.querySelectorAll("img"), { scale: 1.14 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
          })
        })

        /* 4b. Shelf photos rise in, the second trailing the first, then drift apart a little on scroll */
        const shelf = q(".cv-shelf-photos")[0]
        if (shelf) {
          const figs = shelf.querySelectorAll("figure")
          gsap.from(figs, {
            clipPath: "inset(100% 0% 0% 0% round 16px)", y: 40, duration: 1.2, ease: "expo.out", stagger: 0.15,
            scrollTrigger: { trigger: shelf, start: "top 85%", once: true },
          })
          if (wide) gsap.fromTo(figs[1], { yPercent: 8 }, {
            yPercent: -8, ease: "none",
            scrollTrigger: { trigger: shelf, start: "top bottom", end: "bottom top", scrub: true },
          })
        }

        /* 4c. Project screenshots open from the bottom edge as they scroll in */
        const shots = q(".cv-shot")
        if (shots.length) {
          gsap.set(shots, { clipPath: "inset(100% 0% 0% 0% round 14px)" })
          ScrollTrigger.batch(shots, {
            start: "top 88%", once: true,
            onEnter: (batch) => gsap.to(batch, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.2, ease: "expo.out", stagger: 0.12, overwrite: true }),
          })
        }

        /* 5. Case facts count up once */
        q(".cv-case-facts dd").forEach((dd) => {
          const end = Number(dd.textContent)
          if (!Number.isFinite(end)) return
          gsap.from(dd, {
            textContent: 0, snap: { textContent: 1 }, duration: 1.4, ease: "power2.out",
            scrollTrigger: { trigger: dd, start: "top 90%", once: true },
          })
        })

        /* 5b. Photography: the title rises, then on wide screens the strip is pinned and scrubbed sideways */
        const photos = q(".cv-photos")[0]
        if (photos) {
          const title = SplitText.create(photos.querySelector(".cv-display"), { type: "chars", mask: "chars" })
          gsap.from(title.chars, {
            yPercent: 100, duration: 1.1, ease: "expo.out", stagger: 0.03,
            scrollTrigger: { trigger: photos, start: "top 75%", once: true },
          })
          const viewport = photos.querySelector<HTMLElement>(".ph-viewport")!
          const track = photos.querySelector<HTMLElement>(".ph-track")!
          const frames = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".ph-open"))

          // Curtain: the darkroom opens from an inset card to full bleed as it arrives
          gsap.fromTo(photos,
            { clipPath: "inset(0% 3.5% 0% 3.5% round 36px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
              scrollTrigger: { trigger: photos, start: "top bottom", end: "top 15%", scrub: true } })

          // Frames are unveiled from the bottom edge, one after another
          gsap.from(frames, {
            clipPath: "inset(100% 0% 0% 0% round 14px)", duration: 1.3, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: track, start: "top 85%", once: true },
          })

          if (wide) {
            photos.classList.add("is-scrubbed")
            const pad = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0
            const distance = () => Math.max(0, track.scrollWidth + pad() * 2 - window.innerWidth)
            const bar = photos.querySelector<HTMLElement>(".ph-bar i")
            const count = photos.querySelector<HTMLElement>(".ph-count b")
            const n = frames.length
            const strip = gsap.to(track, {
              x: () => -distance(), ease: "none",
              scrollTrigger: {
                trigger: photos.querySelector(".ph-stage"), start: "bottom bottom", end: () => `+=${distance()}`,
                pin: true, scrub: 1, invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (bar) bar.style.transform = `scaleX(${self.progress})`
                  if (count) count.textContent = String(Math.min(n, Math.floor(self.progress * n) + 1)).padStart(2, "0")
                },
              },
            })
            // Each image drifts inside its frame as the strip carries it across
            frames.forEach((frame) => {
              gsap.fromTo(frame.querySelector(".ph-inner"), { xPercent: 6 }, {
                xPercent: -6, ease: "none",
                scrollTrigger: { trigger: frame, containerAnimation: strip, start: "left right", end: "right left", scrub: true },
              })
            })
          }
        }

        /* 6. Contact heading rises word by word */
        const contact = SplitText.create(q(".cv-contact h2"), { type: "words", mask: "words" })
        gsap.from(contact.words, {
          yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06,
          scrollTrigger: { trigger: q(".cv-contact")[0], start: "top 75%", once: true },
        })

        /* 7. Header steps aside while reading down, returns on the way up */
        const header = q(".cv-header")[0]
        const hide = gsap.to(header, { yPercent: -100, duration: 0.35, ease: "power2.out", paused: true })
        ScrollTrigger.create({
          start: 240, end: "max",
          onUpdate: (self) => (self.direction === 1 ? hide.play() : hide.reverse()),
          onLeaveBack: () => hide.reverse(),
        })

        ScrollTrigger.refresh()
        // Screenshots below the fold change layout as they load
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true })
      }))

      return () => { cancelled = true; q0(".cv-photos")?.classList.remove("is-scrubbed") }
    })
  }, { scope: root })

  return <div ref={root}>{children}</div>
}
