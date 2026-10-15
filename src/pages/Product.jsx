import { lazy, Suspense, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check, Rotate3d, Star, Truck } from 'lucide-react'
import { formatMAD, products } from '../data/products'
import ShoeArt from '../components/ShoeArt'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { hasWebGL } from '../three/webgl'

const Shoe3D = lazy(() => import('../three/Shoe3D'))

const views = [
  { id: 'side', label: 'Side', style: { rotate: -8, scale: 1, x: '0%', scaleX: 1 } },
  { id: 'medial', label: 'Medial', style: { rotate: 6, scale: 1, x: '0%', scaleX: -1 } },
  { id: 'toe', label: 'Toe detail', style: { rotate: -4, scale: 1.9, x: '-30%', scaleX: 1 } },
  { id: 'heel', label: 'Heel detail', style: { rotate: 4, scale: 2, x: '38%', scaleX: 1 } },
]

const details = [
  ['Materials', 'Engineered mesh upper, recycled-poly lining, rubber outsole with 30% recycled content.'],
  ['Fit', 'True to size. If you are between sizes, go half a size up for running models.'],
  ['Delivery & returns', 'Delivered in 24–48 h in Casablanca and Rabat, 2–4 days elsewhere in Morocco. Free returns within 30 days.'],
]

export default function Product() {
  const { id } = useParams()
  const p = products.find((x) => x.id === id)
  const [view, setView] = useState('side')
  const [size, setSize] = useState(null)
  const [error, setError] = useState(false)
  const [openDetail, setOpenDetail] = useState(0)
  const [added, setAdded] = useState(false)
  const [webgl] = useState(hasWebGL)
  const artRef = useRef(null)
  const { add } = useCart()

  if (!p) return <Navigate to="/" replace />
  const v = views.find((x) => x.id === view)
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).concat(products.filter((x) => x.category !== p.category)).slice(0, 3)

  const onAdd = () => {
    if (!size) {
      setError(true)
      return
    }
    add(p, size, artRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="wrap pt-24">
      <nav className="label mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-jet">Shop</Link> / {p.category} / <span className="text-jet">{p.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        {/* gallery */}
        <div>
          <div className="relative aspect-[4/3.2] overflow-hidden rounded-[2rem]" style={{ background: p.colors.bg }}>
            <span className="pointer-events-none absolute -bottom-6 left-4 select-none font-display text-[9rem] uppercase leading-none text-white/40 sm:text-[12rem]">{p.name.split(' ')[0]}</span>
            <AnimatePresence mode="wait">
              {view === '3d' ? (
                <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 cursor-grab active:cursor-grabbing">
                  <Suspense fallback={<p className="grid h-full place-items-center text-sm text-jet/50">Loading 3D view…</p>}>
                    <Shoe3D colors={p.colors} podium="#F2F0EA" distance={10} />
                  </Suspense>
                </motion.div>
              ) : (
                <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center">
                  <motion.div ref={artRef} animate={v.style} transition={{ type: 'spring', stiffness: 120, damping: 18 }} className="w-4/5">
                    <ShoeArt colors={p.colors} className="w-full" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {p.tag && <span className="absolute left-5 top-5 rounded-full bg-jet px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-paper">{p.tag}</span>}
          </div>
          <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product views">
            {views.map((x) => (
              <button key={x.id} role="tab" aria-selected={view === x.id} aria-label={x.label} onClick={() => setView(x.id)} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl sm:w-28" style={{ background: p.colors.bg }}>
                <motion.div animate={x.style} className="grid h-full place-items-center p-2" transition={{ duration: 0 }}>
                  <ShoeArt colors={p.colors} className="w-full" shadow={false} />
                </motion.div>
                {view === x.id && <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-2xl border-[3px] border-jet" />}
              </button>
            ))}
            {webgl && (
              <button role="tab" aria-selected={view === '3d'} onClick={() => setView('3d')} className="relative grid h-20 w-24 shrink-0 place-items-center rounded-2xl bg-jet text-paper sm:w-28">
                <span className="flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider"><Rotate3d size={20} /> 360° view</span>
                {view === '3d' && <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-2xl border-[3px] border-volt" />}
              </button>
            )}
          </div>
        </div>

        {/* info */}
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }} className="lg:pt-4">
          <motion.p variants={rise} className="label">{p.line} · {p.category}</motion.p>
          <motion.h1 variants={rise} className="mt-2 font-display text-6xl uppercase leading-[0.9] sm:text-7xl">{p.name}</motion.h1>
          <motion.div variants={rise} className="mt-4 flex items-center gap-4">
            <p className="tnum text-2xl font-semibold">{formatMAD(p.price)}</p>
            <span className="flex items-center gap-1 text-sm text-jet/60"><Star size={14} className="fill-volt text-volt" /> {p.rating} · {p.reviews} reviews</span>
          </motion.div>
          <motion.p variants={rise} className="mt-5 leading-relaxed text-jet/70">{p.description}</motion.p>

          <motion.div variants={rise} className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider">Select size (EU)</p>
              <AnimatePresence>
                {error && !size && <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm font-medium text-volt" role="alert">Please pick a size</motion.p>}
              </AnimatePresence>
            </div>
            <motion.div animate={error && !size ? { x: [0, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.4 }} className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Size">
              {[37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => {
                const available = p.sizes.includes(s)
                const selected = size === s
                return (
                  <motion.button
                    key={s}
                    role="radio"
                    aria-checked={selected}
                    disabled={!available}
                    whileTap={available ? { scale: 0.9 } : {}}
                    onClick={() => { setSize(s); setError(false) }}
                    className={`relative h-12 rounded-xl border text-sm font-semibold transition-colors ${available ? (selected ? 'border-jet text-paper' : 'border-jet/15 hover:border-jet') : 'cursor-not-allowed border-jet/5 text-jet/25 line-through'}`}
                  >
                    {selected && <motion.span layoutId="size-pill" className="absolute inset-0 rounded-[10px] bg-jet" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
                    <span className="relative">{s}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>

          <motion.div variants={rise} className="mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onAdd} className="btn-volt relative w-full overflow-hidden py-4 text-base">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? 'done' : 'add'} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} className="flex items-center gap-2">
                  {added ? (<><Check size={18} /> Added to bag</>) : (<>Add to bag · {formatMAD(p.price)}</>)}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <p className="mt-3 flex items-center gap-2 text-sm text-jet/60"><Truck size={16} /> Free delivery from 1 500 MAD · Cash on delivery available</p>
          </motion.div>

          <motion.ul variants={rise} className="mt-8 divide-y divide-jet/10 border-y border-jet/10">
            {details.map(([title, body], i) => (
              <li key={title}>
                <button onClick={() => setOpenDetail(openDetail === i ? -1 : i)} aria-expanded={openDetail === i} className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  {title}
                  <motion.span animate={{ rotate: openDetail === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openDetail === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-4 text-sm leading-relaxed text-jet/70">
                      {body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <section className="mt-24">
        <h2 className="font-display text-5xl uppercase">You may also like</h2>
        <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => <ProductCard key={r.id} p={r} />)}
        </ul>
      </section>
    </div>
  )
}

const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
