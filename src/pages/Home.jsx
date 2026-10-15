import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { categories, formatMAD, lines, photo, products } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'

const ease = [0.22, 1, 0.36, 1]
const byId = (id) => products.find((p) => p.id === id)

function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.7, ease, delay }} className={className}>
      {children}
    </M>
  )
}

/* 1. Hero: oversized type layered over a full-bleed photograph that scales with scroll */
function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.02, 1.16])
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '10%'])
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -160])
  const tempo = byId('tempo-x')

  const line = (text, i, className = '') => (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span className={`block ${className}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.09 }}>
        {text}
      </motion.span>
    </span>
  )

  return (
    <section ref={ref} className="relative pt-24" aria-labelledby="hero-title">
      <div className="wrap relative z-10 pt-6 sm:pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="label">The Autumn Edit · 2026</p>
          <p className="label hidden sm:block">Selected on Boulevard d’Anfa, Casablanca</p>
        </div>
        <div className="relative">
          <h1 id="hero-title" className="display mt-4 text-[clamp(3.4rem,12.4vw,12.5rem)] sm:mt-6">
            {line('Built for', 0)}
            {line('the Boulevard.', 1)}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.5 }}
            className="absolute right-0 top-2 hidden w-[22rem] lg:block xl:top-6"
          >
            <p className="leading-relaxed text-soft">
              Ten pairs for the city this season: Corniche trainers, archive runners and box-fresh court lows. Delivered across Morocco, paid on arrival.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#shop" className="btn-ink">Shop the rack <ArrowRight size={16} /></a>
              <Link to="/product/tempo-x" className="btn-line">Tempo X</Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative -mt-[clamp(0.6rem,3.2vw,3.2rem)]">
        <div className="relative aspect-[4/3.4] overflow-hidden bg-tile sm:aspect-[16/9] lg:aspect-[16/8.4]">
          <motion.img
            src={photo('hero')}
            alt="Pair of grey knit sneakers on a white studio background"
            width={1280}
            height={926}
            fetchpriority="high"
            decoding="async"
            style={{ scale: imgScale, y: imgY, objectPosition: '50% 58%' }}
            initial={{ clipPath: 'inset(8% 6% 8% 6%)', opacity: 0.6 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ duration: 1.2, ease }}
            className="h-full w-full object-cover"
          />
        </div>

        <motion.div style={{ y: cardY }} className="absolute bottom-[-9rem] right-4 z-10 hidden w-[17rem] bg-canvas p-3 shadow-[0_30px_60px_-25px_rgba(18,18,17,.45)] lg:right-10 lg:block xl:w-[19rem]">
          <Link to={`/product/${tempo.id}`} className="group block">
            <div className="aspect-square overflow-hidden bg-tile">
              <ProductImage p={tempo} sizes="300px" className="transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-3 flex items-baseline justify-between text-sm">
              <span><span className="label block">Just landed</span><span className="font-semibold">{tempo.name}</span></span>
              <span className="tnum">{formatMAD(tempo.price)}</span>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="wrap mt-8 lg:hidden">
        <p className="max-w-md leading-relaxed text-soft">
          Ten pairs for the city this season: Corniche trainers, archive runners and box-fresh court lows. Delivered across Morocco, paid on arrival.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#shop" className="btn-ink">Shop the rack <ArrowRight size={16} /></a>
          <Link to="/product/tempo-x" className="btn-line">Tempo X</Link>
        </div>
      </div>
    </section>
  )
}

/* 2. Shop by line: asymmetric bento of photographs */
const bento = [
  { cat: 'Running', img: 'run-lab', w: 1280, h: 740, pos: '35% 50%', alt: 'Teal knit running shoe on a wooden shop shelf', cls: 'col-span-2 aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto' },
  { cat: 'Lifestyle', img: 'medina-low', w: 1280, h: 746, pos: '40% 50%', alt: 'Grey suede retro runner on a dark display table', cls: 'col-span-2 aspect-[16/10] lg:col-span-5 lg:aspect-auto' },
  { cat: 'Basketball', img: 'kasbah-hi', w: 1280, h: 960, pos: '62% 50%', alt: 'White leather court sneakers on outdoor asphalt under a basketball hoop', cls: 'aspect-[4/5] lg:col-span-3 lg:aspect-auto' },
  { cat: 'Skate', img: 'corniche-sk8', w: 1280, h: 930, pos: '55% 50%', alt: 'White and bordeaux leather sneaker on a dark red background', cls: 'aspect-[4/5] lg:col-span-2 lg:aspect-auto' },
]

function Lines({ onPick }) {
  return (
    <section className="wrap pt-28 sm:pt-44" aria-labelledby="lines-title">
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 id="lines-title" className="display text-[clamp(2.6rem,6vw,5.5rem)]">Four lines,<br />one city.</h2>
        </Reveal>
        <Reveal delay={0.1} className="self-end lg:col-span-4 lg:col-start-9">
          <p className="max-w-sm leading-relaxed text-soft">From the 6 a.m. runners on the Corniche to the evening games in the derb, every pair on the rack belongs to one of four lines.</p>
        </Reveal>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:grid-rows-[repeat(2,clamp(16rem,22vw,21rem))]">
        {bento.map((b, i) => {
          const count = products.filter((p) => p.category === b.cat).length
          return (
            <Reveal key={b.cat} delay={i * 0.06} className={`relative overflow-hidden bg-tile ${b.cls}`}>
              <Link to={`/?cat=${b.cat}#shop`} onClick={() => onPick(b.cat)} className="group block h-full w-full">
                <img src={photo(b.img)} alt={b.alt} width={b.w} height={b.h} loading="lazy" decoding="async" style={{ objectPosition: b.pos }} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                <span className="absolute bottom-2 left-2 flex items-center gap-4 bg-canvas py-2 pl-3 pr-2 sm:bottom-3 sm:left-3">
                  <span>
                    <span className="display block text-lg sm:text-2xl">{lines[b.cat].name}</span>
                    <span className="block text-[11px] text-soft">{b.cat} · {count} pairs</span>
                  </span>
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* 3. Just landed: horizontal gallery, pinned and scroll-driven on desktop, swipeable on touch */
const landed = ['tempo-x', 'atlas-runner', 'sahara-trail', 'kasbah-hi', 'rabat-retro', 'souk-slip'].map(byId)

function JustLanded() {
  const desktop = useMedia('(min-width: 1024px)')
  const section = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    if (!desktop) return
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [desktop])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  const heading = (
    <div className="wrap flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <h2 id="new-title" className="display text-[clamp(2.6rem,6vw,5.5rem)]">Just landed</h2>
      <p className="max-w-sm leading-relaxed text-soft">Six pairs from this week’s delivery to our Aïn Sebaâ warehouse. Sizes go fast; we restock on Thursdays.</p>
    </div>
  )

  if (!desktop)
    return (
      <section id="new" className="scroll-mt-24 pt-28 sm:pt-40" aria-labelledby="new-title">
        {heading}
        <ul className="scrollbar-none mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6">
          {landed.map((p) => (
            <li key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw]">
              <ProductCard p={p} as="div" sizes="72vw" />
            </li>
          ))}
        </ul>
      </section>
    )

  return (
    <section id="new" ref={section} className="relative mt-40 scroll-mt-0" style={{ height: `calc(100vh + ${dist}px)` }} aria-labelledby="new-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        {heading}
        <motion.ul ref={track} style={{ x }} className="mt-10 flex w-max gap-4 px-10">
          {landed.map((p) => (
            <li key={p.id} className="w-[min(25vw,24rem)] shrink-0">
              <ProductCard p={p} as="div" sizes="25vw" />
            </li>
          ))}
          <li className="flex w-[min(25vw,24rem)] shrink-0 items-center">
            <a href="#shop" className="group display flex aspect-square w-full flex-col justify-between bg-ink p-6 text-3xl text-canvas">
              See the full rack
              <ArrowRight size={36} className="transition-transform duration-300 group-hover:translate-x-2" />
            </a>
          </li>
        </motion.ul>
      </div>
    </section>
  )
}

/* 4. The rack: filterable grid with layout animations */
function Shop({ cat, setCat }) {
  const [sort, setSort] = useState('featured')
  const list = useMemo(() => {
    const l = products.filter((p) => cat === 'All' || p.category === cat)
    if (sort === 'low') return [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...l].sort((a, b) => b.price - a.price)
    if (sort === 'rating') return [...l].sort((a, b) => b.rating - a.rating)
    return l
  }, [cat, sort])

  return (
    <section id="shop" className="wrap scroll-mt-24 pt-28 sm:pt-40" aria-labelledby="shop-title">
      <div className="flex items-end justify-between gap-6">
        <h2 id="shop-title" className="display text-[clamp(2.6rem,6vw,5.5rem)]">
          The rack <sup className="tnum align-top font-sans text-base font-medium tracking-normal text-soft">{list.length}</sup>
        </h2>
        <label className="flex items-center gap-2 text-[13px] text-soft">
          <span className="hidden sm:inline">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="min-h-[44px] border-b border-ink/30 bg-transparent pr-2 text-ink focus:border-ink focus:outline-none">
            <option value="featured">Featured</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div className="mt-6 border-y border-ink/10">
        <LayoutGroup id="cats">
          <div className="scrollbar-none -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`relative min-h-[48px] whitespace-nowrap px-3 text-[13px] font-medium transition-colors first:pl-0 sm:px-4 ${cat === c ? 'text-ink' : 'text-soft hover:text-ink'}`}
              >
                {c === 'All' ? 'All pairs' : c}
                {cat === c && <motion.span layoutId="cat-line" className="absolute inset-x-3 bottom-0 h-[2px] bg-accent first:left-0 sm:inset-x-4" transition={{ duration: 0.35, ease }} />}
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <motion.ul layout className="mt-8 grid grid-cols-2 gap-x-2 gap-y-10 sm:gap-x-3 lg:grid-cols-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <ProductCard key={p.id} p={p} shared sizes="(min-width: 1024px) 20vw, 50vw" />
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}

/* 5. Full-bleed band with an editorial quote */
function RunLabStory() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])
  const tempo = byId('tempo-x')
  return (
    <section ref={ref} className="on-dark relative mt-28 overflow-hidden bg-ink text-canvas sm:mt-40" aria-labelledby="story-title">
      <div className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[64%] lg:[mask-image:linear-gradient(to_right,#000_70%,transparent)]">
        <motion.img
          src={photo('tempo-x')}
          alt="Black and red Tempo X running shoe floating over dark carbon fibre"
          width={tempo.w}
          height={tempo.h}
          loading="lazy"
          decoding="async"
          style={{ y, scale: 1.12 }}
          className="h-full w-full object-cover object-[35%_60%] lg:object-[40%_55%]"
        />
      </div>
      <div className="wrap relative grid py-14 lg:min-h-[86vh] lg:grid-cols-12 lg:items-center lg:py-24">
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">Run Lab notes</p>
          <blockquote id="story-title" className="display mt-5 text-[clamp(2rem,3.2vw,3.1rem)] leading-[0.98]">
            “Six weeks, 412 kilometres, every one of them on the Corniche between Aïn Diab and the El Hank lighthouse.”
          </blockquote>
          <p className="mt-6 text-sm leading-relaxed text-mute">Salma R., Run Lab tester, on the Tempo X. She ran the 2025 Casablanca Marathon in 3:12 wearing the prototype.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link to="/product/tempo-x" className="btn bg-canvas text-ink hover:bg-accent-hi">Shop Tempo X <ArrowRight size={16} /></Link>
            <span className="tnum text-sm text-mute">{formatMAD(tempo.price)} · EU 39 to 44</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 6. Service strip: big numbers */
const stats = [
  ['24 h', 'Delivery in Casablanca and Rabat, two to four days everywhere else.'],
  ['1 500', 'MAD and up ships free to any city in Morocco.'],
  ['30', 'days to return, in store or by courier, no questions.'],
  ['0 MAD', 'upfront. Pay cash or by card when the courier arrives.'],
]

function Stats() {
  return (
    <section className="wrap pt-28 sm:pt-40" aria-label="Delivery and returns">
      <ul className="grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
        {stats.map(([n, t], i) => (
          <Reveal as="li" key={n} delay={i * 0.08} className={`border-b border-ink/15 py-8 pr-4 lg:border-b-0 lg:py-10 ${i > 0 ? 'lg:border-l lg:pl-6' : ''} ${i % 2 ? 'border-l pl-4 lg:pl-6' : ''}`}>
            <p className="display tnum text-[clamp(2.75rem,6vw,5.5rem)]">{n}</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-soft">{t}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

/* 7. The store: sticky photo, scrolling list */
const services = [
  ['Fitting on the bench', 'Bring your running shoes; our staff look at the wear on the outsole and fit you on a treadmill at the back of the shop.'],
  ['Reserve online, try in store', 'Pick a pair at checkout and we hold it at the counter for 48 hours. No deposit.'],
  ['Clean and re-lace', 'Suede brushed, leather conditioned and new laces fitted while you have a coffee next door. 90 MAD.'],
  ['Hours', 'Saturday to Thursday, 10:00 to 21:00. Friday, 15:00 to 21:00. 112 Boulevard d’Anfa, Casablanca.'],
]

function Store() {
  const anfa = byId('anfa-court')
  return (
    <section id="store" className="wrap scroll-mt-24 pt-28 sm:pt-40" aria-labelledby="store-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="aspect-[4/5] overflow-hidden bg-tile">
              <ProductImage p={anfa} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
            <p className="mt-3 text-xs text-soft">Anfa Court in Sand / White, photographed on the shop floor.</p>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="label">Visit</p>
            <h2 id="store-title" className="display mt-4 text-[clamp(2.6rem,6vw,5.5rem)]">112 Boulevard d’Anfa.</h2>
            <p className="mt-6 max-w-md leading-relaxed text-soft">A narrow shop between a pharmacy and a café, with every pair on the wall in every size we stock. Come in to try, stay for the fitting.</p>
          </Reveal>
          <ul className="mt-14 border-t border-ink/15">
            {services.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.05} className="grid gap-2 border-b border-ink/15 py-8 sm:grid-cols-[14rem_1fr] sm:gap-8 lg:py-12">
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="leading-relaxed text-soft">{d}</p>
              </Reveal>
            ))}
          </ul>
          <a href="https://maps.google.com/?q=Boulevard+d'Anfa+Casablanca" target="_blank" rel="noreferrer" className="btn-line mt-10">
            Directions <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const location = useLocation()
  const [params] = useSearchParams()
  const [cat, setCat] = useState(() => (categories.includes(params.get('cat')) ? params.get('cat') : 'All'))

  // Nav links like /?cat=Running#shop update the filter and scroll to the target section.
  useEffect(() => {
    const c = params.get('cat')
    if (categories.includes(c)) setCat(c)
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  return (
    <>
      <Hero />
      <Lines onPick={setCat} />
      <JustLanded />
      <Shop cat={cat} setCat={setCat} />
      <RunLabStory />
      <Stats />
      <Store />
    </>
  )
}
