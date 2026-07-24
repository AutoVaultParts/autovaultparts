import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import SEO from '../components/common/SEO'

function useCountUp(target, suffix, inView) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!inView || hasRun.current) return
    hasRun.current = true

    // 2 second delay before starting
    const delay = setTimeout(() => {
      // Duration scales with target so all counters feel uniform speed
      // ~18ms per number ensures every number is visible
      const duration = target * 18
      let startTime = null

      function easeOut(t) {
        // Gentle ease — slows down near the end but not aggressively
        return 1 - Math.pow(1 - t, 2)
      }

      function animate(timestamp) {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOut(progress)
        const current = Math.floor(eased * target)
        setCount(current)
        if (progress < 1) requestAnimationFrame(animate)
        else setCount(target)
      }

      requestAnimationFrame(animate)
    }, 2000)

    return () => clearTimeout(delay)
  }, [inView, target])

  return `${count}${suffix}`
}

function StatCard({ value, label }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Parse the value into number + suffix
  // e.g. '376+' => target=376, suffix='+'
  // '100%' => target=100, suffix='%'
  // '4' => target=4, suffix=''
  // '81+' => target=81, suffix='+'
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1]) : 0
  const suffix = match ? match[2] : ''

  const displayed = useCountUp(target, suffix, inView)

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-black text-[#E8590A] mb-1">{displayed}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title="About Us"
        description="AutoVaultParts is a premium car spare parts platform shipping globally. Quality OEM and aftermarket parts for BMW, Toyota, Ford, Mercedes and hundreds more vehicles. Free shipping on qualifying orders."
        url="/about"
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            About <span className="text-[#E8590A]">AutoVaultParts</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Premium car spare parts sourced from trusted suppliers worldwide. We exist to give serious buyers access to quality parts at honest prices.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-black text-[#0A1628] mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AutoVaultParts was built for car enthusiasts, mechanics and buyers who take quality seriously. We source OEM, aftermarket and remanufactured parts from verified suppliers and ship them globally.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe buying a car part should not be a guessing game. Every listing on our platform includes the exact vehicle compatibility, part condition and a detailed description so you know exactly what you are getting before you order.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From a BMW M3 bumper to a Toyota LandCruiser engine, we stock parts that are difficult to find locally and ship them to your door anywhere in the world.
            </p>
          </div>
          <div className="bg-[#0A1628] rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '376+', label: 'Car Models Supported' },
                { value: '81+', label: 'Parts Listed' },
                { value: '4', label: 'Shipping Regions' },
                { value: '100%', label: 'Quality Checked' },
              ].map(stat => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>

        {/* Why us */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-[#0A1628] mb-8 text-center">Why AutoVaultParts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '/quality_guaranteed.png',
                alt: 'Quality Guaranteed',
                title: 'Quality Guaranteed',
                desc: 'Every part is inspected before shipping. New OEM, new aftermarket, remanufactured and used parts are all clearly labeled so you know exactly what condition you are buying.',
              },
              {
                icon: '/exact_compatibility.png',
                alt: 'Exact Compatibility',
                title: 'Exact Compatibility',
                desc: 'Use our Make, Model and Year filter to find parts that are confirmed to fit your specific vehicle. No guessing, no returns for wrong fitment.',
              },
              {
                icon: '/global_shipping.png',
                alt: 'Global Shipping',
                title: 'Global Shipping',
                desc: 'We ship to the United States, Canada, Europe and Australia with free shipping available on qualifying orders. Freight items like engines are handled with specialist carriers.',
              },
              {
                icon: '/real_time_tracking.png',
                alt: 'Real Time Tracking',
                title: 'Real Time Tracking',
                desc: 'Track your order directly on our website. Our team updates every shipment manually so you always know exactly where your parts are.',
              },
              {
                icon: '/secure_payment.png',
                alt: 'Secure Payments',
                title: 'Secure Payments',
                desc: 'We accept Visa, Mastercard, Apple Pay, Google Pay, Cash App and Zelle. All card payments are processed with 256-bit SSL encryption.',
              },
              {
                icon: '/responsive_support.png',
                alt: 'Responsive Support',
                title: 'Responsive Support',
                desc: 'Can not find the part you need? Contact our team and we will source it for you. We respond to every message within 24 hours.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#E8590A] transition-colors">
                <div className="mb-4">
                  <img
                    src={item.icon}
                    alt={item.alt}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-[#0A1628] font-black text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parts we carry */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-[#0A1628] mb-8 text-center">Parts We Carry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: '/body_parts.png',
                label: 'Body Parts',
                desc: 'Bumpers, hoods, doors and panels',
                path: '/shop?category=body',
              },
              {
                icon: '/engine.png',
                label: 'Engines',
                desc: 'Complete engines and long blocks',
                path: '/shop?category=engine',
              },
              {
                icon: '/internal_parts.png',
                label: 'Internal Parts',
                desc: 'Turbos, steering and more',
                path: '/shop?category=internal',
              },
              {
                icon: '/transmission.png',
                label: 'Transmission',
                desc: 'Gearboxes and axle assemblies',
                path: '/shop?category=transmission',
              },
              {
                icon: '/suspension.png',
                label: 'Suspension',
                desc: 'Control arms and struts',
                path: '/shop?category=suspension',
              },
              {
                icon: '/electrical_parts.png',
                label: 'Electrical',
                desc: 'Alternators and starters',
                path: '/shop?category=electrical',
              },
              {
                icon: '/exhaust.png',
                label: 'Exhaust',
                desc: 'Full systems and mufflers',
                path: '/shop?category=exhaust',
              },
              {
                icon: '/wheels_and_rims.png',
                label: 'Wheels and Rims',
                desc: 'Alloy wheels and steel rims',
                path: '/shop?category=wheels',
              },
              {
                icon: '/tyres.png',
                label: 'Tyres',
                desc: 'All season and performance tyres',
                path: '/shop?category=tyres',
              },
              {
                icon: null,
                label: 'More Coming',
                desc: 'New categories added regularly',
                path: '/shop',
              },
            ].map(item => (
              <Link
                key={item.label}
                to={item.path}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#E8590A] hover:shadow-md transition-all group text-center"
              >
                <div className="flex items-center justify-center mb-3 h-12">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#0A1628] group-hover:text-[#E8590A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  )}
                </div>
                <h3 className="text-[#0A1628] font-bold text-sm mb-1 group-hover:text-[#E8590A] transition-colors">{item.label}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Free shipping */}
        <div className="bg-[#0A1628] rounded-2xl p-8 mb-20">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Free Shipping Thresholds</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { region: 'United States', threshold: '$1,000+', flag: '🇺🇸' },
              { region: 'Canada', threshold: '$1,300+', flag: '🇨🇦' },
              { region: 'Europe', threshold: '$1,500+', flag: '🇪🇺' },
              { region: 'South America', threshold: '$1,500+', flag: '🌎' },
              { region: 'Australia', threshold: '$1,800+', flag: '🇦🇺' },
            ].map(item => (
              <div key={item.region} className="text-center bg-[#1a2d4a] rounded-xl p-4">
                <div className="text-3xl mb-2">{item.flag}</div>
                <p className="text-white font-bold text-sm mb-1">{item.region}</p>
                <p className="text-[#E8590A] font-black text-lg">{item.threshold}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs text-center mt-4">
            Freight items including engines and transmissions are excluded from free shipping thresholds.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#0A1628] mb-4">Ready to Find Your Part?</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Browse our catalog and use the vehicle filter to find parts that fit your exact car. If you cannot find what you need, contact us and we will source it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black px-8 py-4 rounded-lg transition-colors text-base"
            >
              Browse Parts
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[#0A1628] hover:border-[#E8590A] text-[#0A1628] hover:text-[#E8590A] font-black px-8 py-4 rounded-lg transition-colors text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
