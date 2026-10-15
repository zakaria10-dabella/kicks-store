import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Check, ChevronDown, Star, Truck } from 'lucide-react'
import { formatMAD, lines, products } from '../data/products'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

const ease = [0.22, 1, 0.36, 1]
const ALL_SIZES = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

const views = [
  { id: 'crop', label: 'Detail' },
  { id: 'full', label: 'Full frame' },
  { id: 'close', label: 'Close-up' },
]

const details = [
  ['Fit', 'True to size. Between sizes? Go half a size up in Run Lab models, stay true in Heritage and Court. Free exchanges on size.'],
  ['Delivery and returns', 'Casablanca and Rabat in 24 h, two to four working days elsewhere in Morocco. Free from 1 500 MAD. Thirty days to return, in store or by courier.'],
  ['Payment', 'Cash or card on delivery, or bank transfer. Nothing is charged until the pair is in your hands.'],
]

export default function ProductRoute() {
  const { id } = useParams()
  const p = products.find((x) => x.id === id)
  if (!p) return <Navigate to="/" replace />
  return <Product key={p.id} p={p} />
}

function Gallery({ p, tileRef }) {
  const [view, setView] = useState('crop')
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const base = view === 'close' ? 1.9 : 1
  const scale = zoom ? Math.max(2.1, base * 1.25) : base

  return (
    <div>
      <motion.div
        ref={tileRef}
        layoutId={`photo-${p.id}`}
        transition={{ duration: 0.6, ease }}
        className="relative aspect-[5/4] cursor-zoom-in overflow-hidden bg-tile"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={onMove}
      >
        <ProductImage
          p={p}
          eager
          fit={view === 'full' ? 'contain' : 'cover'}
          sizes="(min-width: 1024px) 58vw, 100vw"
          style={{ transform: `scale(${scale})`, transformOrigin: zoom ? origin : view === 'close' ? '30% 55%' : '50% 50%' }}
          className="transition-transform duration-300 ease-out"
        />
        {p.tag && <span className={`pointer-events-none absolute left-4 top-4 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${p.tag === 'Limited' ? 'bg-accent text-white' : 'bg-canvas text-ink'}`}>{p.tag}</span>}
        <span className="pointer-events-none absolute bottom-4 right-4 hidden bg-canvas px-2 py-1 text-[11px] text-soft [@media(hover:hover)]:block">Hover to zoom</span>
      </motion.div>
      <div className="mt-2 grid grid-cols-3 gap-2" role="tablist" aria-label="Photo views">
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={`group relative aspect-[5/3] overflow-hidden bg-tile outline-offset-2 ${view === v.id ? '' : 'opacity-70 hover:opacity-100'}`}
          >
            <ProductImage
              p={p}
              fit={v.id === 'full' ? 'contain' : 'cover'}
              sizes="20vw"
              style={v.id === 'close' ? { transform: 'scale(1.9)', transformOrigin: '30% 55%' } : undefined}
            />
            <span className="absolute bottom-1.5 left-1.5 bg-canvas px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]">{v.label}</span>
            {view === v.id && <motion.span layoutId="view-line" className="absolute inset-x-0 bottom-0 h-[3px] bg-ink" transition={{ duration: 0.3, ease }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

function Product({ p }) {
  const [size, setSize] = useState(null)
  const [error, setError] = useState(false)
  const [openDetail, setOpenDetail] = useState(-1)
  const [added, setAdded] = useState(false)
  const tileRef = useRef(null)
  const sizesRef = useRef(null)
  const buyRef = useRef(null)
  const buyInView = useInView(buyRef, { margin: '0px 0px -40px 0px' })
  const { add, setOpen } = useCart()

  const related = products
    .filter((x) => x.category === p.category && x.id !== p.id)
    .concat(products.filter((x) => x.category !== p.category))
    .slice(0, 4)

  const onAdd = () => {
    if (!size) {
      setError(true)
      sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    add(p, size, tileRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cta = (extra = '') => (
    <button onClick={onAdd} className={`btn-accent relative w-full overflow-hidden ${extra}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={added ? 'done' : 'add'} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
          {added ? <><Check size={18} /> Added, EU {size}</> : size ? <>Add to bag · EU {size}</> : <>Add to bag</>}
        </motion.span>
      </AnimatePresence>
    </button>
  )

  return (
    <div className="pb-24 pt-24 lg:pb-0">
      <div className="wrap pt-4 sm:pt-6">
        <nav className="text-[12px] text-soft" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={`/?cat=${p.category}#shop`} className="hover:text-ink">{p.category}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{p.name}</li>
          </ol>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12 xl:gap-20">
          <Gallery p={p} tileRef={tileRef} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}>
              <motion.p variants={rise} className="label">{p.line} · {p.category}</motion.p>
              <motion.h1 variants={rise} className="display mt-3 text-[clamp(2.75rem,5vw,4.75rem)]">{p.name}</motion.h1>
              <motion.div variants={rise} className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                <p className="tnum text-xl font-semibold">{formatMAD(p.price)}</p>
                <a href="#reviews" className="flex items-center gap-1.5 text-sm text-soft hover:text-ink">
                  <Star size={14} className="fill-ink text-ink" /> {p.rating} <span className="underline underline-offset-2">({p.reviews} reviews)</span>
                </a>
              </motion.div>
              <motion.p variants={rise} className="mt-2 text-sm text-soft">Colour: <span className="text-ink">{p.colorway}</span></motion.p>

              <motion.div variants={rise} ref={sizesRef} className="mt-8 scroll-mt-32">
                <div className="flex items-baseline justify-between">
                  <p id="size-label" className="text-sm font-semibold">Size, EU</p>
                  <AnimatePresence mode="wait">
                    {error && !size ? (
                      <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium text-accent" role="alert">Choose a size first</motion.p>
                    ) : (
                      <motion.p key="fit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-soft">Fits true to size</motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  animate={error && !size ? { x: [0, -6, 6, -3, 3, 0] } : { x: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`mt-3 grid grid-cols-5 gap-px border bg-ink/10 ${error && !size ? 'border-accent' : 'border-ink/10'}`}
                  role="radiogroup"
                  aria-labelledby="size-label"
                >
                  {ALL_SIZES.map((s) => {
                    const available = p.sizes.includes(s)
                    const selected = size === s
                    return (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={selected}
                        aria-label={`EU ${s}${available ? '' : ', sold out'}`}
                        disabled={!available}
                        onClick={() => { setSize(s); setError(false) }}
                        className={`tnum relative h-12 text-sm font-medium transition-colors ${available ? (selected ? 'bg-ink text-canvas' : 'bg-canvas hover:bg-tile') : 'cursor-not-allowed bg-canvas text-soft/60 line-through'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </motion.div>
              </motion.div>

              <motion.div variants={rise} ref={buyRef} className="mt-4">
                {cta()}
                <button onClick={() => setOpen(true)} className="btn-line mt-2 w-full">View bag</button>
                <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-soft">
                  <Truck size={16} className="mt-0.5 shrink-0 text-ink" />
                  Order before 16:00 for next-day delivery in Casablanca. Cash or card on delivery.
                </p>
              </motion.div>

              <motion.p variants={rise} className="mt-8 leading-relaxed text-soft">{p.description}</motion.p>

              <motion.ul variants={rise} className="mt-6 border-t border-ink/10">
                {details.map(([title, body], i) => (
                  <li key={title} className="border-b border-ink/10">
                    <button onClick={() => setOpenDetail(openDetail === i ? -1 : i)} aria-expanded={openDetail === i} className="flex min-h-[52px] w-full items-center justify-between text-left text-sm font-semibold">
                      {title}
                      <ChevronDown size={18} className={`transition-transform duration-300 ${openDetail === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openDetail === i && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden pb-4 text-sm leading-relaxed text-soft">
                          {body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>

        <section id="reviews" className="mt-28 grid scroll-mt-28 gap-8 border-t border-ink/15 pt-10 lg:grid-cols-12" aria-labelledby="line-title">
          <div className="lg:col-span-5">
            <p className="label">The {p.line} line</p>
            <h2 id="line-title" className="display mt-3 text-[clamp(2.2rem,4.5vw,4rem)]">{lines[p.category].blurb}</h2>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="display tnum text-[clamp(3rem,6vw,5.5rem)]">{p.rating}</p>
              <p className="text-sm text-soft">Average from {p.reviews} verified buyers</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-soft">“Ordered on Monday, the courier called from Maarif on Tuesday morning. Paid cash at the door, fit was spot on.” Youssef, Casablanca</p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="related-title">
          <h2 id="related-title" className="display text-[clamp(2rem,4vw,3.5rem)]">Pairs well with</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-2 gap-y-10 sm:gap-x-3 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} shared sizes="(min-width: 1024px) 25vw, 50vw" />)}
          </ul>
        </section>
      </div>

      {/* sticky add-to-bag on small screens, shown once the main button scrolls away */}
      <AnimatePresence>
        {!buyInView && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-canvas/95 backdrop-blur-md lg:hidden"
          >
            <div className="wrap flex items-center gap-3 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden bg-tile"><ProductImage p={p} sizes="48px" /></div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="tnum text-soft">{formatMAD(p.price)}</p>
              </div>
              <div className="w-44 shrink-0">{cta('px-3')}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }
