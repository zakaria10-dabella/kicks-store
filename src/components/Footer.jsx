import { Link } from 'react-router-dom'
import { credits } from '../data/credits'

const cols = [
  ['Shop', [['Running', '/?cat=Running#shop'], ['Lifestyle', '/?cat=Lifestyle#shop'], ['Basketball', '/?cat=Basketball#shop'], ['Skate', '/?cat=Skate#shop']]],
  ['Help', [['Delivery in Morocco', '/#store'], ['Returns within 30 days', '/#store'], ['Cash on delivery', '/#store'], ['Checkout', '/checkout']]],
]

export default function Footer() {
  return (
    <footer className="on-dark mt-28 bg-ink text-canvas sm:mt-36">
      <div className="wrap pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="display text-5xl sm:text-6xl">
              Kicks<span className="text-accent-hi">.</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">
              A sneaker concept store at 112 Boulevard d’Anfa, Casablanca. Open daily 10:00 to 21:00, Friday from 15:00.
            </p>
          </div>
          {cols.map(([title, items]) => (
            <div key={title}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">{title}</p>
              <ul className="mt-4 space-y-1">
                {items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="inline-flex min-h-[36px] items-center text-sm hover:text-accent-hi">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mute">Newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex border-b border-canvas/30 focus-within:border-canvas">
              <label htmlFor="nl" className="sr-only">Email address</label>
              <input id="nl" type="email" placeholder="Email for drop alerts" className="min-h-[48px] w-full bg-transparent text-sm placeholder:text-mute focus:outline-none" />
              <button className="min-h-[48px] px-2 text-[13px] font-semibold uppercase tracking-[0.08em] hover:text-accent-hi">Join</button>
            </form>
          </div>
        </div>

        <details id="credits" className="group mt-16 border-t border-canvas/15 pt-6">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-mute hover:text-canvas">
            Photo credits: Wikimedia Commons contributors, CC BY-SA 4.0 and CC0
            <span aria-hidden="true" className="text-base transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-xs text-mute sm:grid-cols-2 lg:grid-cols-3">
            {credits.map((c) => (
              <li key={c.file}>
                <a href={c.source} target="_blank" rel="noreferrer" className="underline decoration-canvas/20 underline-offset-2 hover:text-canvas">
                  {c.title.replace(/\.(jpe?g)$/i, '')}
                </a>{' '}
                by {c.author}, {c.license}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-mute">Product names are fictional; photographs show real shoes and are used for demonstration only.</p>
        </details>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-canvas/15 pt-6 text-xs text-mute sm:flex-row">
          <p>Concept store and interface by Zakaria Dabella, Casablanca.</p>
          <p>© 2026 KICKS. Portfolio project, no real orders.</p>
        </div>
      </div>
    </footer>
  )
}
