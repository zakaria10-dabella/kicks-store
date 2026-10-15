import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import Checkout from './pages/Checkout'

export default function App() {
  const location = useLocation()
  useLayoutEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <a href="#main" className="sr-only z-[70] bg-ink px-4 py-3 text-canvas focus:not-sr-only focus:fixed focus:left-2 focus:top-2">
        Skip to content
      </a>
      <Navbar />
      <CartDrawer />
      {/* No route-level AnimatePresence: the product photo morphs from card to page via layoutId */}
      <main id="main">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
