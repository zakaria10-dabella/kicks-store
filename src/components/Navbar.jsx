import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const links = [
  ['New in', '/?cat=All#new'],
  ['Running', '/?cat=Running#shop'],
  ['Lifestyle', '/?cat=Lifestyle#shop'],
  ['Basketball', '/?cat=Basketball#shop'],
  ['Skate', '/?cat=Skate#shop'],
]

export default function Navbar() {
  const { count, setOpen, bump, cartIconRef } = useCart()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 200)
  })
  useEffect(() => setMenu(false), [location])

  return (
    <motion.header
      animate={{ y: hidden && !menu ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <p className="flex h-8 items-center justify-center bg-ink px-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-canvas">
        <span className="hidden sm:inline">Free delivery across Morocco from 1&#8239;500 MAD&nbsp;&nbsp;·&nbsp;&nbsp;</span>Cash on delivery&nbsp;&nbsp;·&nbsp;&nbsp;Casablanca in 24 h
      </p>
      <div className="border-b border-ink/10 bg-canvas/95 backdrop-blur-md">
        <div className="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          <nav aria-label="Main" className="hidden items-center gap-7 text-[13px] font-medium lg:flex">
            {links.map(([label, to]) => (
              <Link key={label} to={to} className="relative py-2 text-soft transition-colors hover:text-ink">
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            className="-ml-3 grid h-11 w-11 place-items-center lg:hidden"
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" aria-label="KICKS, home" className="display text-[28px] leading-none tracking-[-0.04em]">
            Kicks<span className="text-accent">.</span>
          </Link>

          <div className="flex items-center justify-end gap-6">
            <Link to="/#store" className="hidden text-[13px] font-medium text-soft transition-colors hover:text-ink lg:inline">
              Store, Bd d’Anfa
            </Link>
            <motion.button
              ref={cartIconRef}
              key={bump}
              animate={bump ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.35 }}
              onClick={() => setOpen(true)}
              aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
              className="-mr-2 flex h-11 items-center gap-2 px-2 text-[13px] font-semibold"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span className="hidden sm:inline">Bag</span>
              <span className="tnum inline-grid h-5 min-w-5 place-items-center bg-ink px-1 text-[11px] text-canvas">{count}</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-ink/10 lg:hidden"
            >
              <ul className="wrap py-3">
                {[...links, ['Our store', '/#store']].map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="display flex min-h-[52px] items-center border-b border-ink/10 text-3xl last:border-0">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
