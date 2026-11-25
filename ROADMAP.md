# Portfolio roadmap

Personal portfolio of **Mohamed Bouamlat**, full-stack developer in Casablanca.
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · GSAP 3 (`@gsap/react`, ScrollTrigger, SplitText) · pnpm.
Repo: `github.com/midobatlmios/mohamed` · Dev server: `pnpm dev` → http://localhost:3000

Work through the phases in order. Each task lists what "done" means.

---

## Phase 1 — Ready to publish (do first)

### 1.1 Delete the leftover pages from another site
The project began from a template for "Technique Résistances Maroc" (an industrial company). These are unrelated to the portfolio, broken, and would be public once deployed.
- Delete: `app/contact/`, `app/machines/`, `app/produits/`, `app/qui-sommes-nous/`, `app/secteurs/`, `components/site-shell.tsx`.
- Delete unused template images: `public/placeholder*.{jpg,png,svg}`.
- Check nothing else imports them (`grep -r "site-shell\|placeholder" app components lib`).
- **Done when:** only `/` exists, and visiting `/machines` etc. returns 404.

### 1.2 Production build
Everything so far was tested only with the dev server.
- Stop the dev server first (both write to `.next/`), then run `pnpm build` and `pnpm start`.
- Fix any build, type or lint errors.
- Click through the whole page on the production server: hero intro, Shipped index hover, case studies, the Photography strip (pinned sideways scroll) and the full-screen viewer.
- **Done when:** `pnpm build` passes with no errors and the production site behaves like dev.

### 1.3 Commit and deploy
- Commit the current work; `public/documents/` is new and not committed yet.
- Deploy to **Vercel**: import the GitHub repo, framework Next.js, default settings. `@vercel/analytics` is already wired in `app/layout.tsx` (production only).
- Set `metadataBase` in `app/layout.tsx` to the live URL.
- **Done when:** the site is live on a public URL.

---

## Phase 2 — What recruiters look for

### 2.1 Downloadable CV
- Add an English CV PDF (matching the site's content) at `public/documents/` and a **"Download CV"** button in the hero actions and in the Contact section.
- The original CV is French (`Mohamed_Bouamlat_CV.docx`); facts on the site come from it.
- **Done when:** the button downloads the PDF on desktop and phone.

### 2.2 Social share preview
- Add `app/opengraph-image.tsx` (Next `ImageResponse`, 1200×630): name, role, the eight-point star, Majorelle blue. Optionally `twitter-image`.
- **Done when:** sharing the link on LinkedIn/WhatsApp shows the card (check with LinkedIn Post Inspector).

### 2.3 French version (largest task)
- Most Moroccan employers read French. Add an FR/EN switch, ideally with routes `/` and `/fr`.
- Move all copy out of `components/portfolio.tsx` into per-language dictionaries.
- **Done when:** every section reads correctly in both languages and the switch keeps your place on the page.

### 2.4 SEO basics
- Add `app/sitemap.ts`, `app/robots.ts` and an `app/not-found.tsx` styled like the site.

---

## Phase 3 — Content

- **AFG Asset Management:** add a screenshot as `public/work/afg.webp`. It gets the hover preview automatically. Optional `afg-2.webp`/`gigalab-2.webp` for a second image.
- **Client sites without screenshots or links:** REA Partners, Ma Foncière, El Yazid Assilah, Wonderwall, ABS, Shido Mind Yoga. Drop screenshots in `public/work/<slug>.webp` (slugs are in `getSiteGroups()` in `portfolio.tsx`) and add `href` where a live URL exists.
- **Smart Task Manager:** replace the login screenshot (`public/projects/task-manager.png`) with the Kanban board or analytics dashboard.
- **Case studies (Gigalab, AFG):** add one or two lines each on the problem, the approach and the result.
- **Photos:** replace the WhatsApp copies in `public/photos/` with originals exported at about 2400px long edge, JPG quality around 80, keeping the same file names.

---

## Phase 4 — Quality pass
- Lighthouse on the production URL. Target 90+ for performance and accessibility on mobile; the Gigalab case cites 93.
- Keyboard-only walk-through: skip link, visible focus, the photo viewer (Esc, arrows), the hover-preview rows.
- Test `prefers-reduced-motion` in DevTools (Rendering panel). All GSAP motion should switch off and content stay visible.

---

## Decisions already made (keep them)

- **Privacy.** Never publish ID numbers.
  - The **Xerus Group work certificate** (attestation de travail) stays **off the site**: it prints the co-manager's CIN. Send it privately on request.
  - The **OFPPT diploma** is published only as the covered copy `public/documents/diplome-technicien-specialise-ofppt.webp`, with date of birth, CNI, matricule, serial number and barcode hidden. Never publish the original photo.
- **Employer facts match the official documents:** **Xerus Group**, Web Developer **Nov 2025 – Nov 2026** (ended); overall **Apr 2025 – Nov 2026**, including the internship. The Oumnitrade screenshot's description says "Xerus Media" because that is what the screen shows.
- **Language:** the site is English for now (see 2.3).
- **Photography:** no Archive. The strip shows photos `01`–`12` (file-name order). The full-screen viewer browses all photos in `public/photos/`. Rename the numbers to change the selection. Descriptions come from file names (`07-street-lamp-at-night.jpg` → "Street lamp at night").
- **Screenshots** of sites and projects are hover previews on desktop (`HoverPreview`, `ShippedIndex`) and inline images on touch screens. Don't put them back inline on desktop.

## Project map

| File | What it does |
|---|---|
| `components/portfolio.tsx` | The whole page: content data at the top, then sections (hero, Shipped, cases, Experience, Projects, Skills, Education, Interests, Photography, Contact). Server component; reads `public/work` and `public/photos` at render. |
| `components/motion-root.tsx` | All page-level GSAP: hero intro, scroll reveals, case-study frames, counters, header hide/show, the photo strip pin and parallax. Wrapped in `gsap.matchMedia` with a reduced-motion guard. |
| `components/shipped-index.tsx` | Client-site list with the cursor-following screenshot preview. |
| `components/hover-preview.tsx` | Same preview behaviour for any row (projects, Gigalab, diploma). |
| `components/photo-gallery.tsx` | Photography strip, "View" cursor and full-screen viewer (FLIP zoom, arrows, swipe). |
| `lib/photos.ts` | Reads `public/photos`, image sizes from headers, optional `captions.json`. |
| `app/globals.css` | Design tokens (`--cv-*`; light, dark and high-contrast) and all styles. Section styles are grouped with comments. |
| `app/layout.tsx` · `app/apple-icon.tsx` · `public/icon.svg` | Fonts (Geist, Geist Mono), metadata, icons (eight-point star on Majorelle blue). |

**Design rules in use:** Majorelle blue (`--cv-accent`) only for links, actions and status; Geist plus Geist Mono for dates and stacks; the khatam (eight-point star) is the brand mark; the Photography section is a dark "darkroom" with its own tokens.

**Gotchas**
- GSAP pinning wraps `.ph-stage` in a `pin-spacer`. Hot reloads can leave the page frozen; a hard refresh (Ctrl+F5) fixes it. It is dev-only.
- Text split with SplitText needs enough `line-height` or descenders get clipped (see `.cv-display`).
- Check visual changes at 375px (phone) and a wide desktop. There must be no horizontal page scroll.
