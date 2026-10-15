import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatMAD } from '../data/products'
import ShoeArt from './ShoeArt'

export default function CartDrawer() {
  const { open, setOpen, items, setQty, remove, subtotal, shipping, total } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-jet/40 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper"
          >
            <div className="flex items-center justify-between border-b border-jet/10 p-5">
              <h2 className="font-display text-3xl uppercase">Your bag</h2>
              <motion.button whileHover={{ rotate: 90 }} onClick={() => setOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full border border-jet/15">
                <X size={18} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} className="grid h-20 w-20 place-items-center rounded-full bg-bone">
                    <ShoppingBag size={30} />
                  </motion.div>
                  <p className="mt-5 font-display text-2xl uppercase">Your bag is empty</p>
                  <p className="mt-1 text-sm text-jet/60">Fresh pairs are waiting on the shelf.</p>
                  <button onClick={() => { setOpen(false); navigate('/') }} className="btn-dark mt-6">Start shopping</button>
                </motion.div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }} className="flex gap-4 overflow-hidden">
                        <div className="grid h-24 w-28 shrink-0 place-items-center rounded-2xl" style={{ background: i.product.colors.bg }}>
                          <ShoeArt colors={i.product.colors} className="w-24" shadow={false} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="truncate font-semibold">{i.product.name}</p>
                            <button onClick={() => remove(i.key)} aria-label={`Remove ${i.product.name}`} className="text-jet/40 hover:text-volt"><Trash2 size={16} /></button>
                          </div>
                          <p className="text-xs text-jet/55">EU {i.size} · {i.product.category}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-jet/15">
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center"><Minus size={14} /></motion.button>
                              <span className="relative h-5 w-6 overflow-hidden text-center text-sm font-semibold">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span key={i.qty} initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }} className="tnum absolute inset-0">{i.qty}</motion.span>
                                </AnimatePresence>
                              </span>
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center"><Plus size={14} /></motion.button>
                            </div>
                            <p className="tnum font-semibold">{formatMAD(i.qty * i.product.price)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <motion.div layout className="space-y-2 border-t border-jet/10 p-5 text-sm">
                <Row label="Subtotal" value={formatMAD(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : formatMAD(shipping)} />
                {shipping > 0 && <p className="text-xs text-jet/50">Free delivery across Morocco from 1 500 MAD.</p>}
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-semibold uppercase tracking-wider">Total</span>
                  <motion.span key={total} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="tnum font-display text-3xl">{formatMAD(total)}</motion.span>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setOpen(false); navigate('/checkout') }} className="btn-volt mt-3 w-full">
                  Checkout
                </motion.button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-jet/70">
      <span>{label}</span>
      <span className="tnum font-medium text-jet">{value}</span>
    </div>
  )
}
