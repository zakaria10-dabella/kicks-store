import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import Checkout from './pages/Checkout'

export default function App() {
  const location = useLocation()
  useEffect(() => window.scrollTo(0, 0), [location.pathname])

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} className="relative">
          {/* page wipe: a volt panel sweeps across on route change */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60] origin-top bg-volt"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }}
            exit={{ scaleY: 0 }}
            style={{ originY: 0 }}
          />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5 } }} exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
