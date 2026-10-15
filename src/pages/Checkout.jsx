import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Banknote, Building2, Check, CreditCard, Rocket, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatMAD } from '../data/products'
import ProductImage from '../components/ProductImage'

const steps = ['Shipping', 'Delivery', 'Payment', 'Review']
const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda']
const deliveries = [
  { id: 'standard', label: 'Standard', note: '2–4 working days', price: 0, icon: Truck },
  { id: 'express', label: 'Express', note: 'Next day in Casablanca & Rabat', price: 79, icon: Rocket },
]
const payments = [
  { id: 'cod', label: 'Cash on delivery', note: 'Pay the courier in cash', icon: Banknote },
  { id: 'tpe', label: 'Card on delivery', note: 'The courier brings a card terminal', icon: CreditCard },
  { id: 'transfer', label: 'Bank transfer', note: 'We send our RIB after ordering', icon: Building2 },
]

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}

function validate(f) {
  const e = {}
  if (f.name.trim().length < 3) e.name = 'Enter your full name'
  if (!/^(\+212|0)[5-7]\d{8}$/.test(f.phone.replace(/[\s.-]/g, ''))) e.phone = 'Use a Moroccan number, e.g. 06 12 34 56 78'
  if (f.address.trim().length < 6) e.address = 'Enter your street address'
  return e
}

export default function Checkout() {
  const cart = useCart()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', city: 'Casablanca', address: '' })
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [tried, setTried] = useState(false)
  const [order, setOrder] = useState(null)

  const errors = validate(form)
  const deliveryCost = deliveries.find((d) => d.id === delivery).price
  const total = cart.subtotal + cart.shipping + deliveryCost

  const go = (to) => {
    if (to > step && step === 0 && Object.keys(errors).length) {
      setTried(true)
      return
    }
    setDir(to > step ? 1 : -1)
    setStep(to)
    if (window.scrollY > 120) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const place = () => {
    setOrder({ number: `KX-${Math.floor(100000 + Math.random() * 899999)}`, total, items: cart.count, name: form.name.split(' ')[0], city: form.city })
    cart.clear()
    window.scrollTo(0, 0)
  }

  if (order) return <Confirmation order={order} />

  if (cart.items.length === 0)
    return (
      <div className="wrap flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
        <p className="display text-[clamp(2.5rem,6vw,4.5rem)]">Nothing to check out</p>
        <p className="mt-2 text-soft">Add a pair to your bag first.</p>
        <Link to="/" className="btn-ink mt-6">Back to the rack</Link>
      </div>
    )

  return (
    <div className="wrap pt-28 sm:pt-32">
      <p className="label">Secure checkout · No payment taken online</p>
      <h1 className="display text-[clamp(3rem,7vw,6rem)]">Checkout</h1>

      {/* stepper */}
      <ol className="relative mt-8 grid grid-cols-4">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-ink/10" />
        <motion.div className="absolute left-[12.5%] top-4 h-0.5 origin-left bg-ink" style={{ width: '75%' }} animate={{ scaleX: step / (steps.length - 1) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        {steps.map((s, i) => (
          <li key={s} className="relative flex flex-col items-center gap-2">
            <motion.button
              onClick={() => i < step && go(i)}
              disabled={i > step}
              animate={{ backgroundColor: i <= step ? '#121211' : '#F1F0EC', color: i <= step ? '#F1F0EC' : '#121211', scale: i === step ? 1.15 : 1 }}
              className="relative z-10 grid h-8 w-8 place-items-center border-2 border-ink text-xs font-bold"
              aria-current={i === step ? 'step' : undefined}
              aria-label={`Step ${i + 1}: ${s}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {i < step ? (
                  <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} /></motion.span>
                ) : (
                  <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }}>{i + 1}</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <span className={`hidden text-[11px] font-semibold uppercase tracking-wider sm:block ${i === step ? 'text-ink' : 'text-soft'}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[360px] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={tried && errors.name}>
                    <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Amine Bouzidi" autoComplete="name" />
                  </Field>
                  <Field label="Phone" error={tried && errors.phone}>
                    <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 12 34 56 78" inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="City">
                    <select className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Address" error={tried && errors.address}>
                    <input className="field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="12 Rue Ibnou Mounir, Maarif" autoComplete="street-address" />
                  </Field>
                </div>
              )}
              {step === 1 && <Options options={deliveries} value={delivery} onChange={setDelivery} group="delivery" price />}
              {step === 2 && (
                <>
                  <Options options={payments} value={payment} onChange={setPayment} group="payment" />
                  <p className="mt-4 text-xs text-soft">This is a portfolio demo: no payment is collected and no order is shipped.</p>
                </>
              )}
              {step === 3 && (
                <dl className="divide-y divide-ink/10 border border-ink/10 bg-white text-sm">
                  {[
                    ['Ship to', `${form.name}, ${form.address}, ${form.city}`],
                    ['Phone', form.phone],
                    ['Delivery', deliveries.find((d) => d.id === delivery).label],
                    ['Payment', payments.find((p) => p.id === payment).label],
                  ].map(([k, v], i) => (
                    <motion.div key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex justify-between gap-6 p-4">
                      <dt className="text-soft">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </motion.div>
                  ))}
                </dl>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between gap-3">
            {step > 0 ? (
              <button onClick={() => go(step - 1)} className="btn-line"><ArrowLeft size={16} /> Back</button>
            ) : (
              <Link to="/" className="btn-line"><ArrowLeft size={16} /> Shop</Link>
            )}
            {step < steps.length - 1 ? (
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => go(step + 1)} className="btn-ink">Continue <ArrowRight size={16} /></motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }} onClick={place} className="btn-accent">Place order · {formatMAD(total)}</motion.button>
            )}
          </div>
        </div>

        <aside className="h-fit bg-tile p-6 lg:sticky lg:top-28">
          <h2 className="display text-3xl">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {cart.items.map((i) => (
              <li key={i.key} className="flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-canvas">
                  <ProductImage p={i.product} sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{i.product.name}</p>
                  <p className="text-xs text-soft">EU {i.size} · Qty {i.qty}</p>
                </div>
                <p className="tnum text-sm font-medium">{formatMAD(i.qty * i.product.price)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-ink/15 pt-4 text-sm text-soft">
            <p className="flex justify-between"><span>Subtotal</span><span className="tnum text-ink">{formatMAD(cart.subtotal)}</span></p>
            <p className="flex justify-between"><span>Shipping</span><span className="tnum text-ink">{cart.shipping ? formatMAD(cart.shipping) : 'Free'}</span></p>
            <AnimatePresence>
              {deliveryCost > 0 && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between overflow-hidden"><span>Express</span><span className="tnum text-ink">{formatMAD(deliveryCost)}</span></motion.p>
              )}
            </AnimatePresence>
            <p className="flex items-baseline justify-between pt-3 text-ink">
              <span className="font-semibold uppercase tracking-wider">Total</span>
              <motion.span key={total} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="tnum text-2xl font-semibold">{formatMAD(total)}</motion.span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-soft">{label}</span>
      {children}
      <AnimatePresence>
        {error && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden pt-1 text-xs font-medium text-accent" role="alert">{error}</motion.span>}
      </AnimatePresence>
    </label>
  )
}

function Options({ options, value, onChange, group, price }) {
  return (
    <div className="grid gap-3" role="radiogroup">
      {options.map((o) => {
        const Icon = o.icon
        const active = value === o.id
        return (
          <motion.button key={o.id} role="radio" aria-checked={active} whileTap={{ scale: 0.98 }} onClick={() => onChange(o.id)} className={`relative flex items-center gap-4 border p-4 text-left transition-colors ${active ? 'border-ink' : 'border-ink/15 hover:border-ink/40'}`}>
            {active && <motion.span layoutId={`${group}-bg`} className="absolute inset-0 bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className={`relative grid h-11 w-11 place-items-center ${active ? 'bg-accent text-white' : 'bg-tile'}`}><Icon size={20} /></span>
            <span className="relative flex-1">
              <span className="block font-semibold">{o.label}</span>
              <span className="text-sm text-soft">{o.note}</span>
            </span>
            {price && <span className="tnum relative font-semibold">{o.price ? `+${formatMAD(o.price)}` : 'Free'}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}

function Confirmation({ order }) {
  return (
    <div className="wrap flex min-h-[80vh] flex-col items-center justify-center pt-28 text-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28">
        <motion.circle cx="50" cy="50" r="44" fill="#2F3CF5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} style={{ originX: '50%', originY: '50%' }} />
        <motion.path d="M30 52 L44 66 L72 36" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.45 }} />
      </svg>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 display text-[clamp(3rem,7vw,6rem)]">Shukran, {order.name}!</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-3 max-w-md text-soft">
        Order <strong className="text-ink">{order.number}</strong> ({order.items} item{order.items > 1 ? 's' : ''}, {formatMAD(order.total)}) is confirmed. Our courier will call you before delivering in {order.city}.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Link to="/" className="btn-ink mt-8">Keep shopping</Link>
      </motion.div>
    </div>
  )
}
