import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowRight, Move3d } from 'lucide-react'
import { categories, formatMAD, products } from '../data/products'
import ProductCard from '../components/ProductCard'
import ShoeArt from '../components/ShoeArt'
import Magnetic from '../components/Magnetic'
import { hasWebGL } from '../three/webgl'

const Shoe3D = lazy(() => import('../three/Shoe3D'))
const featured = ['tempo-x', 'kasbah-hi', 'medina-low'].map((id) => products.find((p) => p.id === id))

function Hero() {
  const ref = useRef(null)
  const [webgl] = useState(hasWebGL)
  const [active, setActive] = useState(0)
  const p = featured[active]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const leftX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const rightX = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  return (
    <section ref={ref} className="relative overflow-hidden pt-16">
      <motion.div className="absolute inset-0 -z-10" animate={{ backgroundColor: p.colors.bg }} transition={{ duration: 0.8 }} />
      <div className="wrap relative pb-10 pt-8 sm:pt-12">
        <div className="pointer-events-none select-none font-display uppercase leading-[0.82] tracking-tight">
          <motion.h1 style={{ x: leftX }} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-[22vw] sm:text-[16vw] lg:text-[13.5rem]">
            Step into
          </motion.h1>
          <motion.p style={{ x: rightX }} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-right text-[22vw] text-transparent [-webkit-text-stroke:2px_#0E0E0E] sm:text-[16vw] lg:text-[13.5rem]">
            Casa<span className="text-volt [-webkit-text-stroke:0]">.</span>
          </motion.p>
        </div>

        <motion.div style={{ y: stageY, scale: stageScale }} className="relative mx-auto -mt-[14vw] h-[340px] max-w-3xl sm:-mt-[10vw] sm:h-[460px] lg:-mt-40 lg:h-[520px]">
          {webgl ? (
            <Suspense fallback={<div className="grid h-full place-items-center"><ShoeArt colors={p.colors} className="w-2/3 -rotate-12" /></div>}>
              <div className="h-full cursor-grab active:cursor-grabbing">
                <Shoe3D colors={p.colors} />
              </div>
            </Suspense>
          ) : (
            <div className="grid h-full place-items-center"><ShoeArt colors={p.colors} className="w-2/3 -rotate-12" /></div>
          )}
          <span className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-paper/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            <Move3d size={14} /> Drag to rotate
          </span>
        </motion.div>

        <div className="relative mt-2 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">Featured drop</p>
            <AnimatePresence mode="wait">
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <p className="mt-1 font-display text-4xl uppercase sm:text-5xl">{p.name}</p>
                <p className="tnum text-sm text-jet/70">{p.line} · {formatMAD(p.price)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Featured colourway">
              {featured.map((f, i) => (
                <button key={f.id} role="radio" aria-checked={i === active} aria-label={f.name} onClick={() => setActive(i)} className="relative grid h-10 w-10 place-items-center rounded-full">
                  {i === active && <motion.span layoutId="swatch-ring" className="absolute inset-0 rounded-full border-2 border-jet" />}
                  <span className="h-7 w-7 rounded-full border border-jet/20" style={{ background: `linear-gradient(135deg, ${f.colors.upper} 50%, ${f.colors.accent} 50%)` }} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link to={`/product/${p.id}`} className="btn-dark group">
                Shop {p.name} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href="#shop" className="btn-line">Browse all <ArrowDownRight size={16} /></a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const words = ['Free delivery from 1 500 MAD', 'Cash on delivery', '30-day returns', 'Casablanca · Rabat · Marrakech · Tanger']
  return (
    <div ref={ref} className="-rotate-2 overflow-hidden bg-jet py-4 text-paper">
      <motion.div style={{ x }} className="flex w-max gap-10 whitespace-nowrap font-display text-3xl uppercase sm:text-4xl">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10">{w}<span className="text-volt">✦</span></span>
        ))}
      </motion.div>
    </div>
  )
}

function Shop() {
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('featured')
  const list = useMemo(() => {
    const l = products.filter((p) => cat === 'All' || p.category === cat)
    if (sort === 'low') return [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...l].sort((a, b) => b.price - a.price)
    if (sort === 'rating') return [...l].sort((a, b) => b.rating - a.rating)
    return l
  }, [cat, sort])

  return (
    <section id="shop" className="wrap scroll-mt-20 pt-24">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="font-display text-6xl uppercase leading-[0.9] sm:text-8xl">
          The <span className="text-volt">rack</span>
          <sup className="ml-2 align-top font-sans text-lg font-semibold text-jet/50">({list.length})</sup>
        </motion.h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <LayoutGroup id="cats">
            <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Category">
              {categories.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide ${cat === c ? 'text-paper' : 'text-jet/60 hover:text-jet'}`}>
                  {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-jet" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="field w-full py-2.5 sm:w-44">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      <motion.ul layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Shop />
    </>
  )
}
