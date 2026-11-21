'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Menu, Moon, Sun } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/technique_resistances_red_transparent-RsEQeWdCdPAggH9ewPsRyVqrK1Jf7T.png'
const links = [
  ['Produits', '/produits'],
  ['Machines & équipements', '/machines'],
  ['Secteurs', '/secteurs'],
  ['Qui sommes-nous', '/qui-sommes-nous'],
  ['Contact', '/contact'],
]

export function SiteHeader() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedMode = window.localStorage.getItem('trm-theme')
    if (savedMode === 'dark') {
      document.documentElement.dataset.theme = 'dark'
      setDarkMode(true)
    }
  }, [])

  function toggleTheme() {
    const nextMode = darkMode ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextMode
    window.localStorage.setItem('trm-theme', nextMode)
    window.dispatchEvent(new CustomEvent('trm-theme-change', { detail: nextMode }))
    setDarkMode(nextMode === 'dark')
  }

  const activeLogo = darkMode ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/technique_resistances_white_transparent-IdaVFijLAdl0HsuUp6E6kjYJg5uSGY.png' : logo

  return <><div className="topline"><span>Fabricant marocain de solutions thermiques industrielles</span><span className="top-right"><span>Casablanca, Maroc</span><a href="tel:+212522000000">+212 522 00 00 00 <ArrowUpRight size={12}/></a></span></div><header className="nav-wrap"><Link className="brand" href="/" aria-label="Technique Résistances Maroc, accueil"><Image src={activeLogo} alt="Technique Résistances Maroc" width={54} height={44} priority/><span>TECHNIQUE RÉSISTANCES<small>MAROC</small></span></Link><nav aria-label="Navigation principale">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav><div className="nav-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'} title={darkMode ? 'Mode clair' : 'Mode sombre'}>{darkMode ? <Sun size={17}/> : <Moon size={17}/>}<span>{darkMode ? 'Clair' : 'Sombre'}</span></button><Link className="nav-cta" href="/contact">Demander un devis <ArrowUpRight size={15}/></Link><button className="mobile-menu" aria-label="Menu de navigation" onClick={() => document.querySelector('.nav-wrap nav')?.classList.toggle('nav-open')}><Menu/></button></div></header></>
}

export function SiteFooter() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const syncTheme = (event: Event) => {
      setDarkMode((event as CustomEvent<'light' | 'dark'>).detail === 'dark')
    }
    setDarkMode(window.localStorage.getItem('trm-theme') === 'dark')
    window.addEventListener('trm-theme-change', syncTheme)
    return () => window.removeEventListener('trm-theme-change', syncTheme)
  }, [])

  const footerLogo = darkMode ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/technique_resistances_white_transparent-IdaVFijLAdl0HsuUp6E6kjYJg5uSGY.png' : logo

  return <footer><div className="footer-top"><Link className="brand footer-brand" href="/"><Image src={footerLogo} alt="" width={48} height={40}/><span>TECHNIQUE RÉSISTANCES<small>MAROC</small></span></Link><p>La maîtrise thermique au service<br/>de l’industrie marocaine.</p><div className="footer-links">{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div><Link className="footer-toplink" href="/">Accueil ↑</Link></div><div className="footer-bottom"><span>© 2025 Technique Résistances Maroc. Tous droits réservés.</span><span>Conçu pour l’industrie. Fabriqué au Maroc.</span></div></footer>
}

export function PageIntro({ eyebrow, title, emphasis, description }: { eyebrow: string; title: string; emphasis: string; description: string }) {
  return <div className="page-intro"><div className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</div><h1>{title}<br/><em>{emphasis}</em></h1><p>{description}</p><Link className="button-red" href="/contact">Parlons de votre projet <ArrowRight size={16}/></Link></div>
}
