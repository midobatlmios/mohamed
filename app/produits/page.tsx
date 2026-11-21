import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-shell'
const items = [
  ['Résistances tubulaires','SUR MESURE','photo-1621905251189-08b45d6a269e','La solution polyvalente pour vos applications industrielles.'],
  ['Résistances à ailettes','HAUTE PERFORMANCE','photo-1581092160562-40aa08e78837','Une diffusion thermique optimisée pour l’air et les gaz.'],
  ['Thermoplongeurs','IMMERSION','photo-1581092580497-e0d23cbdf1dc','Chauffage direct des liquides, conçu pour durer.'],
  ['Colliers & cartouches','PRÉCISION','photo-1581092921461-eab62e97a780','La maîtrise de la température au cœur de vos process.'],
]
export default function ProductsPage(){return <><SiteHeader/><main className="inner-page"><PageIntro eyebrow="NOS SOLUTIONS" title="La bonne résistance." emphasis="Pour chaque application." description="Du besoin spécifique à la série, nous développons des éléments chauffants performants, fiables et parfaitement intégrés à votre process."/><section className="section products-section"><div className="product-grid">{items.map(([title,tag,image,text],i)=><article className="product-card" key={title}><div className="product-image" style={{backgroundImage:`url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=85)`}}><span className="product-num">0{i+1}</span><span className="product-tag">{tag}</span><Link href="/contact" className="product-arrow" aria-label={`Demander un devis pour ${title}`}><ArrowUpRight size={19}/></Link></div><div className="product-info"><h3>{title}</h3><p>{text}</p><p className="product-spec">Fabrication selon vos dimensions, puissance et conditions d’utilisation. Caractéristiques techniques disponibles sur demande.</p></div></article>)}</div></section></main><SiteFooter/></>}
