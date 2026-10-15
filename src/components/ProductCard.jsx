import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import ShoeArt from './ShoeArt'
import { formatMAD } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductCard({ p }) {
  const { add } = useCart()
  const art = useRef(null)
  const defaultSize = p.sizes[Math.floor(p.sizes.length / 2)]
  return (
    <motion.li layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }} className="group">
      <Link to={`/product/${p.id}`} className="block">
        <motion.div whileHover="hover" initial="rest" animate="rest" className="relative aspect-[4/3.4] overflow-hidden rounded-3xl" style={{ background: p.colors.bg }}>
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[7rem] uppercase leading-none text-white/40 sm:text-[8rem]">{p.category.slice(0, 3)}</span>
          {p.tag && <span className="absolute left-4 top-4 rounded-full bg-jet px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-paper">{p.tag}</span>}
          <motion.div ref={art} variants={{ rest: { rotate: -8, y: 0, scale: 1 }, hover: { rotate: -18, y: -14, scale: 1.06 } }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="absolute inset-x-6 top-1/2 -mt-[30%]">
            <ShoeArt colors={p.colors} className="w-full" />
          </motion.div>
        </motion.div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="label">{p.line} · {p.category}</p>
          <Link to={`/product/${p.id}`} className="mt-1 block text-lg font-semibold hover:underline">{p.name}</Link>
          <p className="tnum text-sm text-jet/70">{formatMAD(p.price)}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => add(p, defaultSize, art.current)}
          aria-label={`Quick add ${p.name}, size ${defaultSize}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-jet text-paper hover:bg-volt"
        >
          <Plus size={18} />
        </motion.button>
      </div>
    </motion.li>
  )
}
