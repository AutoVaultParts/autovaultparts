import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

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
                { value: '12+', label: 'Parts Listed' },
                { value: '4', label: 'Shipping Regions' },
                { value: '100%', label: 'Quality Checked' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-[#E8590A] mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
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
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Quality Guaranteed',
                desc: 'Every part is inspected before shipping. New OEM, new aftermarket, remanufactured and used parts are all clearly labeled so you know exactly what condition you are buying.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
                  </svg>
                ),
                title: 'Exact Compatibility',
                desc: 'Use our Make, Model and Year filter to find parts that are confirmed to fit your specific vehicle. No guessing, no returns for wrong fitment.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Global Shipping',
                desc: 'We ship to the United States, Canada, Europe and Australia with free shipping available on qualifying orders. Freight items like engines are handled with specialist carriers.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Real Time Tracking',
                desc: 'Track your order directly on our website. Our team updates every shipment manually so you always know exactly where your parts are.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure Payments',
                desc: 'We accept Visa, Mastercard, Apple Pay, Google Pay, Cash App and Zelle. All card payments are processed with 256-bit SSL encryption.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Responsive Support',
                desc: 'Can not find the part you need? Contact our team and we will source it for you. We respond to every message within 24 hours.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#E8590A] transition-colors">
                <div className="mb-4">{item.icon}</div>
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
              { label: 'Body Parts', desc: 'Bumpers, hoods, doors and panels', path: '/shop?category=body' },
              { label: 'Engines', desc: 'Complete engines and long blocks', path: '/shop?category=engine' },
              { label: 'Internal Parts', desc: 'Turbos, steering and more', path: '/shop?category=internal' },
              { label: 'Transmission', desc: 'Gearboxes and axle assemblies', path: '/shop?category=transmission' },
              { label: 'Suspension', desc: 'Control arms and struts', path: '/shop?category=suspension' },
              { label: 'Electrical', desc: 'Alternators and starters', path: '/shop?category=electrical' },
              { label: 'Exhaust', desc: 'Full systems and mufflers', path: '/shop?category=exhaust' },
              { label: 'Wheels and Rims', desc: 'Alloy wheels and steel rims', path: '/shop?category=wheels' },
              { label: 'Tyres', desc: 'All season and performance tyres', path: '/shop?category=tyres' },
              { label: 'More Coming', desc: 'New categories added regularly', path: '/shop' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.path}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#E8590A] hover:shadow-md transition-all group text-center"
              >
                <h3 className="text-[#0A1628] font-bold text-sm mb-1 group-hover:text-[#E8590A] transition-colors">{item.label}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Free shipping */}
        <div className="bg-[#0A1628] rounded-2xl p-8 mb-20">
          <h2 className="text-2xl font-black text-white mb-6 text-center">Free Shipping Thresholds</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { region: 'United States', threshold: '$1,000+', flag: '🇺🇸' },
              { region: 'Canada', threshold: '$1,300+', flag: '🇨🇦' },
              { region: 'Europe', threshold: '$1,500+', flag: '🇪🇺' },
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