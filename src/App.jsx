import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import About from './pages/About'
import OrderTracking from './pages/OrderTracking'
import OrderConfirmation from './pages/OrderConfirmation'
import MyAccount from './pages/account/MyAccount'
import OrderHistory from './pages/account/OrderHistory'
import MyCars from './pages/account/MyCars'
import Dashboard from './pages/admin/Dashboard'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function PageTransition({ children }) {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      {loading && <LoadingSpinner fullScreen />}
      <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/track/:orderNumber" element={<OrderTracking />} />
            <Route path="/order/:id" element={<OrderConfirmation />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/account/orders" element={<OrderHistory />} />
            <Route path="/account/cars" element={<MyCars />} />
            <Route path="/dashboard-x7k2p" element={<Dashboard />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App