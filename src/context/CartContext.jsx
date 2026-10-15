import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { products } from '../data/products'
import ShoeArt from '../components/ShoeArt'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const STORAGE = 'kicks-cart'
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [flights, setFlights] = useState([])
  const cartIconRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const commit = useCallback((id, size) => {
    setItems((list) => {
      const key = `${id}-${size}`
      const found = list.find((i) => i.key === key)
      return found ? list.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)) : [...list, { key, id, size, qty: 1 }]
    })
    setBump((b) => b + 1)
  }, [])

  const add = useCallback(
    (product, size, fromEl) => {
      const from = fromEl?.getBoundingClientRect()
      const to = cartIconRef.current?.getBoundingClientRect()
      if (!from || !to || reduce) return commit(product.id, size)
      setFlights((f) => [...f, { key: `${Date.now()}-${Math.random()}`, from, to, product, size }])
    },
    [commit, reduce],
  )

  const setQty = (key, qty) => setItems((list) => (qty <= 0 ? list.filter((i) => i.key !== key) : list.map((i) => (i.key === key ? { ...i, qty } : i))))
  const remove = (key) => setItems((list) => list.filter((i) => i.key !== key))
  const clear = () => setItems([])

  const detailed = useMemo(() => items.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((i) => i.product), [items])
  const count = detailed.reduce((s, i) => s + i.qty, 0)
  const subtotal = detailed.reduce((s, i) => s + i.qty * i.product.price, 0)
  const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 49
  const total = subtotal + shipping

  const value = { items: detailed, count, subtotal, shipping, total, add, setQty, remove, clear, open, setOpen, bump, cartIconRef }

  return (
    <CartContext.Provider value={value}>
      {children}
      {createPortal(
        <AnimatePresence>
          {flights.map((f) => {
            const dx = f.to.left + f.to.width / 2 - (f.from.left + f.from.width / 2)
            const dy = f.to.top + f.to.height / 2 - (f.from.top + f.from.height / 2)
            return (
              <motion.div
                key={f.key}
                className="pointer-events-none fixed z-[100]"
                style={{ left: f.from.left, top: f.from.top, width: f.from.width, height: f.from.height }}
                initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                animate={{ x: [0, dx * 0.35, dx], y: [0, dy * 0.2 - 120, dy], scale: [1, 0.7, 0.08], rotate: [0, -12, -40], opacity: [1, 1, 0.4] }}
                transition={{ duration: 0.85, times: [0, 0.45, 1], ease: [0.6, 0, 0.4, 1] }}
                onAnimationComplete={() => {
                  setFlights((list) => list.filter((x) => x.key !== f.key))
                  commit(f.product.id, f.size)
                }}
              >
                <ShoeArt colors={f.product.colors} className="h-full w-full drop-shadow-2xl" shadow={false} />
              </motion.div>
            )
          })}
        </AnimatePresence>,
        document.body,
      )}
    </CartContext.Provider>
  )
}
