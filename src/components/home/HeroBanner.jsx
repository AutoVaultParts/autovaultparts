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
          <h1 className="text-6xl sm:text-7xl lg:text-8xl text-white leading-tight mb-6" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}>
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

          {/* Trust badges - replaced badge-*.png images with inline SVGs */}
          <div className="flex flex-wrap items-center gap-8">

            {/* Secure Payments */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#E8590A]/10 border border-[#E8590A]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Secure Payments</span>
            </div>

            {/* Global Shipping */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#E8590A]/10 border border-[#E8590A]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Global Shipping</span>
            </div>

            {/* Quality Guaranteed */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#E8590A]/10 border border-[#E8590A]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Quality Guaranteed</span>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 rounded-full bg-[#E8590A]/10 border border-[#E8590A]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">Easy Returns</span>
            </div>

          </div>
        </div>
      </div>

      {/* Decorative right side - Real steel gears */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 block overflow-hidden">
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
            src="/gear.png"
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
            src="/gear.png"
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
            src="/gear.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

      </div>

    </section>
  )
}