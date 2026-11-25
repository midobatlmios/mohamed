import fs from "node:fs"
import path from "node:path"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, FileText, Mail, MapPin, Phone } from "lucide-react"
import { ShippedIndex, type ShippedGroup } from "@/components/shipped-index"
import { MotionRoot } from "@/components/motion-root"
import { HoverPreview } from "@/components/hover-preview"
import { PhotoGallery } from "@/components/photo-gallery"
import { getPhotos } from "@/lib/photos"

/* Screenshots live in public/work/<slug>.(jpg|png|webp). Missing files are simply skipped. */
function shot(slug: string): string | undefined {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "work", `${slug}.${ext}`))) return `/work/${slug}.${ext}`
  }
}

const contact = {
  email: "bouamlatm642@gmail.com",
  phone: "+212 7 63 80 46 74",
  phoneHref: "tel:+212763804674",
  location: "Casablanca, Morocco",
  linkedin: "https://www.linkedin.com/in/mohamed-bouamlat-1a8699248",
  github: "https://github.com/midobatlmios",
}

const skills = [
  { label: "Used in production", items: ["JavaScript", "TypeScript", "PHP", "React.js", "Next.js", "Laravel", "Inertia.js", "Strapi", "Tailwind CSS", "Shopify (Liquid)", "WordPress / Elementor Pro", "MySQL"], strong: true },
  { label: "Learning (degree)", items: ["Java 17", "Spring Boot 3", "Spring Security", "JPA / Hibernate", "Angular", "Redux", "Python", "MongoDB", "Docker", "Linux / Unix", "UML"] },
  { label: "Tools & infra", items: ["Git", "GitHub", "GitLab", "OVH Cloud", "Hostinger", "cPanel", "DNS", "SSL"] },
  { label: "Methods", items: ["Agile", "Scrum", "Jira", "Gantt", "PERT"] },
  { label: "Languages", items: ["Arabic (native)", "English (fluent)", "French (intermediate)"] },
]

const cases = [
  {
    slug: "gigalab",
    name: "Gigalab",
    kind: "Full website redesign",
    stack: "React / Next.js · Tailwind CSS",
    text: "Complete redesign of a diagnostic-test manufacturer’s website: two languages (FR/EN), responsive across three screen formats.",
    facts: [{ value: "93", label: "Lighthouse Performance on mobile" }, { value: "2", label: "languages, FR / EN" }, { value: "3", label: "screen formats" }],
    link: { label: "gigalab.ma/en", href: "https://gigalab.ma/en" },
  },
  {
    slug: "afg",
    name: "AFG Asset Management",
    kind: "Admin & public site on a live project",
    stack: "React.js · Laravel · Strapi",
    text: "Added 3 document-management sections to the existing admin (add, view, delete): asset inventories, statutory auditor reports, NAV & net-asset history, all updated by the client. Added 2 dynamic columns (performance, commissions) to the public site via Excel import, and a team page managed in Strapi.",
    facts: [{ value: "3", label: "document sections the client runs alone" }, { value: "2", label: "Excel-fed columns on the public site" }],
    link: { label: "afgassetmanagement.com", href: "https://www.afgassetmanagement.com/" },
  },
]

const getSiteGroups = (): ShippedGroup[] => [
  {
    stack: "Next.js",
    detail: "4 sites",
    text: "Responsive, performance-focused showcase sites for real-estate and distribution clients, built and deployed.",
    clients: [
      { name: "REA Partners", img: shot("rea-partners") },
      { name: "Ma Foncière", img: shot("ma-fonciere") },
      { name: "El Yazid Assilah", img: shot("el-yazid-assilah") },
      { name: "B-Concepts", href: "https://bconcepts.ma", img: shot("bconcepts") },
    ],
  },
  {
    stack: "Shopify",
    detail: "4 stores",
    text: "Each client’s first online store, launched and run independently in Liquid, JS and CSS: theme, catalogue and checkout defined together, opening a new sales channel.",
    clients: [
      { name: "Velario", href: "https://velario.ma", img: shot("velario") },
      { name: "Kambukka", href: "https://kambukka.ma", img: shot("kambukka") },
      { name: "Wonderwall", img: shot("wonderwall") },
      { name: "Braza", href: "https://braza.ma/", img: shot("braza") },
    ],
  },
  {
    stack: "WordPress",
    detail: "4 sites · 3 hosts",
    text: "Elementor Pro sites kept stable and available in production: DNS/SSL management and server optimisation.",
    clients: [
      { name: "CybernityOne", href: "https://www.cybernity.one/", note: "OVH", img: shot("cybernity") },
      { name: "Mille et un fils", note: "cPanel", img: shot("mille-et-un-fils") },
      { name: "ABS", note: "cPanel", img: shot("abs") },
      { name: "Shido Mind Yoga", note: "Hostinger", img: shot("shido-mind-yoga") },
    ],
  },
]

const internship: { name: string; stack: string; text: string; img?: { src: string; w: number; h: number; alt: string }; repo?: string }[] = [
  { name: "Oumnitrade", stack: "React / TypeScript · Laravel · Inertia.js", text: "Leave-management application replacing a manual process: employee requests and approvals are now handled online.",
    img: { src: "/projects/oumnitrade.webp", w: 1917, h: 915, alt: "Oumnitrade leave platform welcome screen by Xerus Media" }, repo: "https://github.com/midobatlmios/conge_4" },
  { name: "Sunlux Maroc", stack: "WordPress · Elementor", text: "Built a veterinary platform, integrating specialist business plugins." },
]

const projects = [
  {
    name: "Library Management System",
    text: "Full-stack web app covering catalogue, loans, reservations, memberships, payments and administration.",
    backend: "Java 17 · Spring Boot · Spring Security (JWT, Google OAuth) · JPA / Hibernate · MySQL · JUnit",
    frontend: "React 19 · Redux Toolkit · React Router · Material UI · Tailwind CSS · Vite",
    img: { src: "/projects/library.png", w: 1916, h: 912, alt: "Library Al Azhar catalogue home with search and genre filters" },
    repo: "https://github.com/midobatlmios/library-management-system",
  },
  {
    name: "Intelligent Task Manager",
    text: "Full-stack web app with a Kanban board, filterable task list, analytics dashboard and AI-generated priority suggestions.",
    backend: "Java 17 · Spring Boot · Spring Security (JWT) · JPA / Hibernate · MySQL · Kimi AI API (Moonshot) · Swagger · JUnit / Mockito · Docker",
    frontend: "Angular 21 · Angular Material · Angular CDK (drag & drop) · Chart.js · RxJS · SSR",
    img: { src: "/projects/task-manager.png", w: 1917, h: 908, alt: "Smart Task Manager sign-in screen" },
    repo: "https://github.com/midobatlmios/smart-task-manager",
  },
]

type Doc = { src: string; w: number; h: number; alt: string }
const education: { date: string; title: string; place: string; text: string; diploma?: Doc }[] = [
  {
    date: "2025 – 2026",
    title: "Licence Pro, Full Stack Web Development & DevOps",
    place: "Supemir, École Supérieure d’Ingénierie et de Management",
    text: "Web & mobile development (Java, JEE, Angular, React), databases (Oracle, MySQL), DevOps, Agile project management, UML, Unix/Linux.",
  },
  {
    date: "2023 – 2025",
    title: "Specialised Technician in Digital Development",
    place: "ISGI, Centre Philips",
    text: "HTML/CSS, JavaScript, OOP, static and dynamic websites, SQL, frameworks (React, Laravel), Agile methods, cloud.",
    // Personal identifiers (date of birth, CNI, matricule, serial, barcode) are covered in this copy
    diploma: { src: "/documents/diplome-technicien-specialise-ofppt.webp", w: 1600, h: 1200, alt: "OFPPT Diplôme de Technicien Spécialisé, Développement Digital option Web Full Stack, June 2025, with personal identifiers hidden" },
  },
]

function Ext({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14} aria-hidden /></a>
}

/* Eight-point star (khatam), a motif from Moroccan zellige, used as the monogram */
function Star({ size = 18 }: { size?: number }) {
  return <svg className="cv-star" width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <rect x="5" y="5" width="14" height="14" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
  </svg>
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="cv-wrap cv-section" id={id} aria-labelledby={`${id}-title`}>
    <h2 className="cv-h2" id={`${id}-title`}>{title}</h2>
    <div className="cv-body">{children}</div>
  </section>
}

export function Portfolio() {
  const photos = getPhotos()
  return <MotionRoot><div className="cv">
    <a className="cv-skip" href="#work">Skip to work</a>
    <header className="cv-header">
      <div className="cv-wrap cv-header-inner">
        <a href="#top" className="cv-mark" aria-label="Mohamed Bouamlat, back to top"><Star /> <span>Mohamed Bouamlat</span></a>
        <nav className="cv-nav" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          {photos.length > 0 && <a href="#photography">Photography</a>}
          <a href="#contact" className="cv-nav-cta">Contact</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section className="cv-wrap cv-hero" aria-labelledby="name">
        <div className="cv-hero-main">
          <h1 id="name" className="cv-name">Mohamed<br />Bouamlat</h1>
          <p className="cv-role">Full-stack developer in Casablanca, shipping client sites to production since 2025.</p>
          <div className="cv-actions">
            <a className="cv-btn cv-btn-primary" href={`mailto:${contact.email}`}><Mail size={17} aria-hidden /> Email me</a>
            <a className="cv-btn" href="#work">See my work <ArrowDown size={16} aria-hidden /></a>
          </div>
        </div>

        <figure className="cv-portrait">
          <div className="cv-portrait-frame">
            <Image src="/me.jpg" alt="Portrait of Mohamed Bouamlat in a graduation cap and gown" width={844} height={1500} priority sizes="(max-width: 900px) 90vw, 420px" />
          </div>
          <a className="cv-badge" href="#contact" aria-label="Available in 2026 for a permanent junior role. Go to contact">
            <svg className="cv-badge-ring" viewBox="0 0 120 120" aria-hidden>
              <defs><path id="badge-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text><textPath href="#badge-ring">Available for a junior role · 2026 · </textPath></text>
            </svg>
            <Star size={26} />
          </a>
        </figure>

        <dl className="cv-hero-band">
          <div className="cv-band-profile">
            <dt>Profile</dt>
            <dd>One year of agency experience. I deliver complete websites and applications (e-commerce, document management, HR tools),
              from the front end to the API, then deploy and maintain them in production. My Licence Pro in Full Stack &amp; DevOps
              is strengthening my back-end foundations.</dd>
          </div>
          <div className="cv-band-stack">
            <dt>Stack</dt>
            <dd><span className="cv-band-k">Ships with</span> React · Next.js · Laravel</dd>
            <dd><span className="cv-band-k">Training in</span> Java · Spring Boot · Angular</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd><MapPin size={15} aria-hidden /> {contact.location}</dd>
            <dd><Phone size={15} aria-hidden /> <a href={contact.phoneHref}>{contact.phone}</a></dd>
            <dd className="cv-band-links"><Ext href={contact.linkedin}>LinkedIn</Ext><Ext href={contact.github}>GitHub</Ext></dd>
          </div>
        </dl>
      </section>

      <section className="cv-wrap cv-work" id="work" aria-labelledby="work-title">
        <div className="cv-work-head">
          <h2 id="work-title" className="cv-display">Shipped,</h2>
          <p>12+ client sites delivered or maintained at Xerus Group between November 2025 and November 2026: 4 Next.js, 4 Shopify, 4 WordPress.</p>
        </div>
        <ShippedIndex groups={getSiteGroups()} />
      </section>

      <section className="cv-wrap cv-cases" aria-label="Case studies">
        {cases.map((c) => {
          const main = shot(c.slug)
          const second = shot(`${c.slug}-2`)
          const body = <>
            {main && <div className={second ? "cv-case-media cv-case-media-two" : "cv-case-media"}>
              <Image src={main} alt={`${c.name} website`} width={1917} height={913} sizes="(max-width: 900px) 100vw, 1120px" />
              {second && <Image src={second} alt={`${c.name}, inner page`} width={1917} height={913} sizes="(max-width: 900px) 100vw, 560px" />}
            </div>}
            <div className="cv-case-info">
              <div className="cv-case-title">
                <h3>{c.name}</h3>
                <p>{c.kind}</p>
                <Ext className="cv-link" href={c.link.href}>{c.link.label}</Ext>
              </div>
              <div className="cv-case-text">
                <p>{c.text}</p>
                <span className="cv-mono">{c.stack}</span>
              </div>
              <dl className="cv-case-facts">
                {c.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
            </div>
          </>
          return main
            ? <HoverPreview as="article" className="cv-case hp-row" key={c.slug} img={{ src: main, w: 1917, h: 913, alt: `${c.name} website` }}>{body}</HoverPreview>
            : <article className="cv-case" key={c.slug}>{body}</article>
        })}
      </section>

      <Section id="experience" title="Experience">
        <div className="cv-company">
          <h3>Xerus Group <span>Casablanca</span></h3>
          <span className="cv-date">Apr 2025 – Nov 2026</span>
        </div>
        <div className="cv-role-block">
          <div className="cv-role-head"><h4>Web Developer</h4><span className="cv-date">Nov 2025 – Nov 2026</span></div>
          <p className="cv-lead">12+ client sites across Next.js, Shopify and WordPress, plus the Gigalab redesign and the AFG Asset Management admin. <a className="cv-inline" href="#work">See the work</a></p>
          <figure className="cv-reco">
            <blockquote lang="fr">« Je retiens de lui sa fiabilité et son honnêteté dans le compte rendu. »</blockquote>
            <p className="cv-reco-en">“What I remember most is his reliability and his honesty in reporting.”</p>
            <figcaption>
              <span><b>El Andaloussi Ben Brahim Othman</b>Co-manager, Xerus Group</span>
              <a className="cv-reco-doc" href="/documents/xerus-group-lettre-de-recommandation.pdf" target="_blank" rel="noreferrer">
                <FileText size={18} aria-hidden /> Read the recommendation letter <small>PDF · French</small>
              </a>
            </figcaption>
          </figure>
        </div>
        <div className="cv-role-block">
          <div className="cv-role-head"><h4>Full-Stack Developer Intern</h4><span className="cv-date">Apr – May 2025</span></div>
          <ul className="cv-list">
            {internship.map((i) => {
              const body = <>
                <strong>{i.name}</strong> {i.text} <span className="cv-mono">{i.stack}</span>
                {i.repo && <Ext className="cv-repo" href={i.repo}>Code on GitHub</Ext>}
                {i.img && <figure className="cv-shot"><Image src={i.img.src} alt={i.img.alt} width={i.img.w} height={i.img.h} sizes="100vw" /></figure>}
              </>
              return i.img
                ? <HoverPreview as="li" key={i.name} img={i.img} className="hp-row">{body}</HoverPreview>
                : <li key={i.name}>{body}</li>
            })}
          </ul>
        </div>
      </Section>

      <Section id="projects" title="Personal projects">
        <div className="cv-features">
          {projects.map((p) => <HoverPreview as="article" className="cv-feature hp-row" key={p.name} img={p.img}>
            <div className="cv-feature-head">
              <h5>{p.name}</h5>
              <p className="cv-small">Full-stack application</p>
              <Ext className="cv-repo" href={p.repo}>Code on GitHub</Ext>
            </div>
            <div className="cv-feature-body">
              <figure className="cv-shot"><Image src={p.img.src} alt={p.img.alt} width={p.img.w} height={p.img.h} sizes="100vw" /></figure>
              <p>{p.text}</p>
              <dl className="cv-stack-dl">
                <div><dt>Backend</dt><dd>{p.backend}</dd></div>
                <div><dt>Frontend</dt><dd>{p.frontend}</dd></div>
              </dl>
            </div>
          </HoverPreview>)}
        </div>
      </Section>

      <Section id="skills" title="Skills">
        {skills.map((g) => <div className="cv-skill" key={g.label}>
          <h3>{g.label}</h3>
          <ul className={g.strong ? "cv-tags cv-tags-strong" : "cv-tags"}>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>)}
      </Section>

      <Section id="education" title="Education">
        {education.map((e) => {
          const body = <>
            <div className="cv-role-head"><h4>{e.title}</h4><span className="cv-date">{e.date}</span></div>
            <p className="cv-place">{e.place}</p>
            <p className="cv-edu-text">{e.text}</p>
            {e.diploma && <>
              <a className="cv-reco-doc cv-edu-doc" href={e.diploma.src} target="_blank" rel="noreferrer">
                <FileText size={18} aria-hidden /> View diploma <small>OFPPT · June 2025</small>
              </a>
              <figure className="cv-shot cv-shot-doc"><Image src={e.diploma.src} alt={e.diploma.alt} width={e.diploma.w} height={e.diploma.h} sizes="100vw" /></figure>
            </>}
          </>
          return e.diploma
            ? <HoverPreview key={e.title} className="cv-edu hp-row" img={e.diploma}>{body}</HoverPreview>
            : <div className="cv-edu" key={e.title}>{body}</div>
        })}
      </Section>

      <Section id="interests" title="Interests">
        <ul className="cv-likes">
          <li><span>Kickboxing</span><Star size={22} /></li>
          <li><a href="#shelf">Reading</a><Star size={22} /></li>
          <li><span>Film</span><Star size={22} /></li>
          <li>{photos.length > 0 ? <a href="#photography">Photography<ArrowDown size={28} aria-hidden /></a> : <span>Photography</span>}</li>
        </ul>
        <div className="cv-shelf" id="shelf">
          <div className="cv-shelf-text">
            <h3>On my shelf</h3>
            <p>Novels, philosophy and essays in Arabic, French and English: Camus, Maupassant, Balzac, Dostoevsky, Shakespeare,
              Naguib Mahfouz, Borges, Nietzsche, Amin Maalouf, Mohammed Abed al-Jabri, Abdelkrim Jouiti and more.</p>
          </div>
          <div className="cv-shelf-photos">
            <figure><Image src="/shelf-1.jpg" alt="Bookshelf with French and English classics by Camus, Maupassant, Balzac, Dostoevsky and Shakespeare" width={1600} height={900} sizes="(max-width: 900px) 100vw, 440px" /></figure>
            <figure><Image src="/shelf-2.jpg" alt="Bookshelf with Arabic books by Naguib Mahfouz, Abdelkrim Jouiti, Mohammed Abed al-Jabri and translations of Nietzsche and Borges" width={1600} height={900} sizes="(max-width: 900px) 100vw, 440px" /></figure>
          </div>
        </div>
      </Section>

      {photos.length > 0 && <section className="cv-photos" id="photography" aria-labelledby="photography-title">
        <PhotoGallery photos={photos} head={
          <div className="cv-wrap cv-photos-head">
            <h2 id="photography-title" className="cv-display">Photography</h2>
            <p>{photos.length} photograph{photos.length > 1 ? "s" : ""}, taken by me. Select any one to see it full size.</p>
          </div>
        } />
      </section>}

      <section className="cv-wrap cv-contact" id="contact" aria-labelledby="contact-title">
        <Star size={28} />
        <h2 id="contact-title">Let’s build something together.</h2>
        <p>I’m looking for a permanent junior full-stack developer position, available on completing my Licence Pro in 2026, to help improve the quality and performance of your web products.</p>
        <div className="cv-actions">
          <a className="cv-btn cv-btn-primary" href={`mailto:${contact.email}`}><Mail size={17} aria-hidden /> {contact.email}</a>
          <a className="cv-btn" href={contact.phoneHref}><Phone size={17} aria-hidden /> {contact.phone}</a>
        </div>
        <div className="cv-contact-links">
          <Ext href={contact.linkedin}>LinkedIn</Ext>
          <Ext href={contact.github}>GitHub</Ext>
        </div>
      </section>
    </main>

    <footer className="cv-wrap cv-footer"><span>© 2026 Mohamed Bouamlat</span><span>{contact.location}</span></footer>
  </div></MotionRoot>
}
