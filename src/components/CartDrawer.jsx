import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatMAD } from '../data/products'
import ProductImage from './ProductImage'

const FREE_FROM = 1500

export default function CartDrawer() {
  const { open, setOpen, items, setQty, remove, subtotal, shipping, total, count } = useCart()
  const navigate = useNavigate()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, setOpen])

  const toFree = Math.max(0, FREE_FROM - subtotal)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-ink/45" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-canvas shadow-[-30px_0_60px_-30px_rgba(0,0,0,.35)]"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
              <h2 className="display text-2xl">
                Bag <span className="tnum font-sans text-sm font-medium tracking-normal text-soft">({count})</span>
              </h2>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close bag" className="-mr-2 grid h-11 w-11 place-items-center hover:text-accent">
                <X size={20} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="border-b border-ink/10 px-5 py-3">
                <p className="text-[13px]">
                  {toFree > 0 ? (
                    <>Add <strong className="tnum">{formatMAD(toFree)}</strong> for free delivery across Morocco.</>
                  ) : (
                    <>Free delivery unlocked.</>
                  )}
                </p>
                <div className="mt-2 h-[3px] bg-tile">
                  <motion.div className="h-full origin-left bg-accent" initial={false} animate={{ scaleX: Math.min(1, subtotal / FREE_FROM) }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-start justify-center">
                  <p className="display text-4xl">Your bag is empty.</p>
                  <p className="mt-3 max-w-xs text-sm text-soft">Ten pairs on the rack this week, from Corniche trainers to box-fresh court lows.</p>
                  <button onClick={() => { setOpen(false); navigate('/?cat=All#shop') }} className="btn-ink mt-8">
                    Shop the rack <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 overflow-hidden py-5">
                        <Link to={`/product/${i.product.id}`} onClick={() => setOpen(false)} className="h-24 w-24 shrink-0 overflow-hidden bg-tile">
                          <ProductImage p={i.product} sizes="96px" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col text-sm">
                          <div className="flex justify-between gap-3">
                            <p className="truncate font-semibold">{i.product.name}</p>
                            <p className="tnum shrink-0 font-medium">{formatMAD(i.qty * i.product.price)}</p>
                          </div>
                          <p className="text-soft">{i.product.colorway} · EU {i.size}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-ink/20">
                              <button onClick={() => setQty(i.key, i.qty - 1)} aria-label={`Decrease quantity of ${i.product.name}`} className="grid h-9 w-9 place-items-center hover:bg-tile"><Minus size={14} /></button>
                              <span className="tnum w-6 text-center font-medium" aria-live="polite">{i.qty}</span>
                              <button onClick={() => setQty(i.key, i.qty + 1)} aria-label={`Increase quantity of ${i.product.name}`} className="grid h-9 w-9 place-items-center hover:bg-tile"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => remove(i.key)} className="min-h-[36px] text-[13px] text-soft underline underline-offset-2 hover:text-ink">Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-2 border-t border-ink/10 p-5 text-sm">
                <Row label="Subtotal" value={formatMAD(subtotal)} />
                <Row label="Delivery" value={shipping === 0 ? 'Free' : formatMAD(shipping)} />
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="tnum text-xl font-semibold">{formatMAD(total)}</span>
                </div>
                <button onClick={() => { setOpen(false); navigate('/checkout') }} className="btn-accent mt-3 w-full">
                  Checkout <ArrowRight size={16} />
                </button>
                <p className="pt-1 text-center text-xs text-soft">Pay cash or by card when your pair arrives.</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-soft">
      <span>{label}</span>
      <span className="tnum text-ink">{value}</span>
    </div>
  )
}
