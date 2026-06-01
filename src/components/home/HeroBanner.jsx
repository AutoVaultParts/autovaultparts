import { Link } from 'react-router-dom'
import SearchBar from '../shop/SearchBar'

export default function HeroBanner() {
  return (
    <section className="relative bg-[#0A1628] min-h-[600px] flex items-center overflow-hidden">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #E8590A,
            #E8590A 1px,
            transparent 1px,
            transparent 60px
          )`
        }} />
      </div>

      {/* Orange accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8590A]" />

      {/* Gear animations */}
      <style>{`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounterClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes spinClockwiseSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gear-cw { animation: spinClockwise 20s linear infinite; }
        .gear-ccw { animation: spinCounterClockwise 14s linear infinite; }
        .gear-cw-slow { animation: spinClockwiseSlow 30s linear infinite; }
      `}</style>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E8590A]/10 border border-[#E8590A]/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E8590A] animate-pulse" />
            <span className="text-[#E8590A] text-sm font-medium">Premium Car Spare Parts</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Quality Parts.
            <br />
            <span className="text-[#E8590A]">Global</span> Delivery.
            <br />
            Every Car.
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
            Premium body parts, engines and internal components for BMW, Toyota, Ford, Mercedes and more. Shipped to the US, Canada, Europe and Australia.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/shop"
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-8 py-4 rounded-md text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-[#E8590A]/25"
            >
              Shop Now
            </Link>
            <Link
              to="/shop"
              className="border border-gray-600 hover:border-[#E8590A] text-gray-300 hover:text-white font-medium px-8 py-4 rounded-md text-lg transition-all duration-200"
            >
              Browse by Car
            </Link>
          </div>

          {/* Search bar */}
          <div className="mb-10 max-w-2xl">
            <SearchBar />
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-8">

            {/* Secure Payments */}
            <div className="flex flex-col items-center gap-2 group">
              <img
                src="/src/assets/images/badge-payments.png"
                alt="Secure Payments"
                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Secure Payments</span>
            </div>

            {/* Global Shipping */}
            <div className="flex flex-col items-center gap-2 group">
              <img
                src="/src/assets/images/badge-shipping.png"
                alt="Global Shipping"
                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Global Shipping</span>
            </div>

            {/* Quality Guaranteed */}
            <div className="flex flex-col items-center gap-2 group">
              <img
                src="/src/assets/images/badge-quality.png"
                alt="Quality Guaranteed"
                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Quality Guaranteed</span>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col items-center gap-2 group">
              <img
                src="/src/assets/images/badge-returns.png"
                alt="Easy Returns"
                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Easy Returns</span>
            </div>

          </div>
        </div>
      </div>

      {/* Decorative right side - Real steel gears */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A1628]/80 to-transparent" />

        {/* Large gear - top right - clockwise */}
        <div
          className="absolute gear-cw"
          style={{
            width: '340px',
            height: '340px',
            top: '-60px',
            right: '-80px',
            opacity: 0.18,
          }}
        >
          <img
            src="/src/assets/images/gear.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Medium gear - middle - counter clockwise */}
        <div
          className="absolute gear-ccw"
          style={{
            width: '220px',
            height: '220px',
            top: '160px',
            right: '120px',
            opacity: 0.12,
          }}
        >
          <img
            src="/src/assets/images/gear.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Small gear - bottom right - slow clockwise */}
        <div
          className="absolute gear-cw-slow"
          style={{
            width: '160px',
            height: '160px',
            bottom: '20px',
            right: '-20px',
            opacity: 0.15,
          }}
        >
          <img
            src="/src/assets/images/gear.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

      </div>

    </section>
  )
}