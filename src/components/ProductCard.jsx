import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import ProductImage from './ProductImage'
import { formatMAD } from '../data/products'
import { useCart } from '../context/CartContext'

/**
 * shared: give the photo a layoutId so it morphs into the product page hero.
 * Only one card per product on screen may be shared.
 */
export default function ProductCard({ p, shared = false, as = 'li', sizes, className = '' }) {
  const { add } = useCart()
  const tile = useRef(null)
  const Tag = as === 'li' ? motion.li : motion.div
  const defaultSize = p.sizes[Math.floor(p.sizes.length / 2)]

  return (
    <Tag
      layout={as === 'li' ? 'position' : undefined}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${className}`}
    >
      <div ref={tile} className="relative">
        <Link to={`/product/${p.id}`} className="block" aria-label={`${p.name}, ${formatMAD(p.price)}`}>
          <motion.div
            layoutId={shared ? `photo-${p.id}` : undefined}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square overflow-hidden bg-tile"
          >
            <ProductImage p={p} sizes={sizes} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          </motion.div>
        </Link>
        {p.tag && (
          <span className={`pointer-events-none absolute left-3 top-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${p.tag === 'Limited' ? 'bg-accent text-white' : 'bg-canvas text-ink'}`}>
            {p.tag}
          </span>
        )}

        {/* quick add: sizes on hover / keyboard focus (pointer devices), plus button on touch */}
        <div className="absolute inset-x-2 bottom-2 hidden translate-y-2 bg-canvas p-2 opacity-0 transition duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:block">
          <p className="px-1 text-[10px] font-medium uppercase tracking-[0.14em] text-soft">Quick add, EU size</p>
          <div className="mt-1 flex flex-wrap gap-0.5">
            {p.sizes.map((s) => (
              <button
                key={s}
                onClick={() => add(p, s, tile.current)}
                aria-label={`Add ${p.name} in EU ${s} to bag`}
                className="tnum h-9 min-w-[2.5rem] flex-1 text-[13px] font-medium hover:bg-ink hover:text-canvas"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => add(p, defaultSize, tile.current)}
          aria-label={`Add ${p.name}, EU ${defaultSize}, to bag`}
          className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center bg-canvas text-ink [@media(hover:hover)]:hidden"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 text-[13px] sm:text-sm">
        <div className="min-w-0">
          <Link to={`/product/${p.id}`} className="font-semibold hover:underline" tabIndex={-1} aria-hidden="true">
            {p.name}
          </Link>
          <p className="truncate text-soft">{p.colorway}</p>
        </div>
        <p className="tnum shrink-0 font-medium">{formatMAD(p.price)}</p>
      </div>
    </Tag>
  )
}
