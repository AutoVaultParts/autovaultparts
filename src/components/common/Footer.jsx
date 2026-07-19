import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src="/logo.png"
              alt="AutoVaultParts"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium car spare parts for serious buyers. Body parts, engines and internal components shipped globally.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">In Stock and Shipping</span>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'Body Parts', path: '/shop?category=body' },
                { label: 'Engines', path: '/shop?category=engine' },
                { label: 'Internal Parts', path: '/shop?category=internal' },
                { label: 'Transmission', path: '/shop?category=transmission' },
                { label: 'Wheels and Rims', path: '/shop?category=wheels' },
                { label: 'Tyres', path: '/shop?category=tyres' },
                { label: 'All Parts', path: '/shop' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-[#E8590A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Track Your Order', path: '/track' },
                { label: 'My Account', path: '/account' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-[#E8590A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Policy links */}
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 mt-8">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Refund Policy', path: '/refund-policy' },
                { label: 'Terms of Service', path: '/terms-of-service' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-[#E8590A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Free Shipping</h4>
            <ul className="space-y-3">
              {[
                { region: 'United States', threshold: '$1,000+' },
                { region: 'Canada', threshold: '$1,300+' },
                { region: 'Europe', threshold: '$1,500+' },
                { region: 'Australia', threshold: '$1,800+' },
              ].map(item => (
                <li key={item.region} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{item.region}</span>
                  <span className="text-[#E8590A] text-sm font-medium">{item.threshold}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-[#E8590A]/10 border border-[#E8590A]/20 rounded-lg">
              <p className="text-gray-400 text-xs leading-relaxed">
                Freight items (engines, transmissions) are excluded from free shipping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2026 AutoVaultParts. All rights reserved.
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy</Link>
                <span className="text-gray-700 text-xs">·</span>
                <Link to="/refund-policy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Refunds</Link>
                <span className="text-gray-700 text-xs">·</span>
                <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <span className="text-gray-500 text-sm">We accept:</span>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-visa.png" alt="Visa" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-applepay.png" alt="Apple Pay" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-googlepay.png" alt="Google Pay" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-cashapp.png" alt="Cash App" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white rounded-md p-1 flex items-center justify-center h-8 w-14">
                <img src="/pay-zelle.png" alt="Zelle" className="h-6 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}