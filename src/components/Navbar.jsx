import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count, setOpen, bump, cartIconRef } = useCart()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-jet/10 bg-paper/80 backdrop-blur-xl"
    >
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-3xl tracking-tight" aria-label="KICKS home">
          KICKS<span className="text-volt">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wider md:flex">
          {[
            ['/', 'Shop'],
            ['/product/tempo-x', 'Drop: Tempo X'],
            ['/checkout', 'Checkout'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `relative py-1 ${isActive ? 'text-jet' : 'text-jet/55 hover:text-jet'}`}>
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-volt" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <motion.button
          ref={cartIconRef}
          key={bump}
          animate={bump ? { scale: [1, 1.3, 0.9, 1], rotate: [0, -10, 8, 0] } : {}}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${count} items`}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-jet text-paper"
        >
          <ShoppingBag size={18} />
          <AnimatePresence>
            {count > 0 && (
              <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="tnum absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[10px] font-bold text-white">
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.header>
  )
}
