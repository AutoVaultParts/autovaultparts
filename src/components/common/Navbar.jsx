import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const { wishlistCount } = useWishlist()
  const location = useLocation()

  useEffect(() => {
    setBannerVisible(false)
    const timer = setTimeout(() => {
      setBannerVisible(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-[#0A1628] text-white sticky top-0 z-50 shadow-lg">

      {/* Animated free shipping banner */}
      <style>{`
        @keyframes bannerShift {
          0%   { background-color: #E8590A; }
          20%  { background-color: #d94f0a; }
          40%  { background-color: #c0440d; }
          60%  { background-color: #e06020; }
          80%  { background-color: #f07030; }
          100% { background-color: #E8590A; }
        }
        .banner-animated {
          animation: bannerShift 6s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`banner-animated text-white text-center text-xs py-2 font-medium tracking-wide overflow-hidden transition-all duration-700 ease-out ${
          bannerVisible ? 'max-h-12 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-full'
        }`}
        style={{
          transform: bannerVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease, max-height 0.5s ease',
        }}
      >
        Free shipping on orders over $1,000 in the US &nbsp;|&nbsp; $1,300 in Canada &nbsp;|&nbsp; $1,500 in Europe &nbsp;|&nbsp; $1,800 in Australia
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center h-full py-1">
            <img
              src="/logo.png"
              alt="AutoVaultParts"
              className="h-full w-auto object-contain max-h-20"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#E8590A] ${
                  isActive(link.path) ? 'text-[#E8590A]' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">

            {/* Wishlist icon - only for logged in users */}
            {user && (
              <Link to="/account/wishlist" className="relative p-2 hover:text-[#E8590A] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E8590A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart icon */}
            <Link to="/cart" className="relative p-2 hover:text-[#E8590A] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8590A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/account" className="text-sm text-gray-300 hover:text-[#E8590A] transition-colors">
                  My Account
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/account"
                className="hidden md:block text-sm bg-[#E8590A] hover:bg-[#ff6b1a] text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-[#1a2d4a] transition-colors"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1a2d4a] py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium px-2 py-1 transition-colors hover:text-[#E8590A] ${
                    isActive(link.path) ? 'text-[#E8590A]' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-[#E8590A] px-2 py-1">My Account</Link>
                  <button onClick={signOut} className="text-sm text-left text-gray-400 hover:text-white px-2 py-1">Sign Out</button>
                </>
              ) : (
                <Link to="/account" onClick={() => setMenuOpen(false)} className="text-sm bg-[#E8590A] text-white px-4 py-2 rounded-md font-medium w-fit">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}