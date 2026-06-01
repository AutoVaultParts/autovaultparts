import { Link } from 'react-router-dom'

const dummyProducts = [
  {
    id: 1,
    name: 'BMW M3 Front Bumper Assembly',
    category: 'Body Parts',
    condition: 'New OEM',
    price: 1250,
    comparePrice: 1800,
    image: null,
    slug: 'bmw-m3-front-bumper',
    isFreight: false,
  },
  {
    id: 2,
    name: 'Toyota Camry 2.5L Complete Engine',
    category: 'Engines',
    condition: 'Remanufactured',
    price: 2800,
    comparePrice: 4200,
    image: null,
    slug: 'toyota-camry-25l-engine',
    isFreight: true,
  },
  {
    id: 3,
    name: 'Ford F-150 Hood Panel',
    category: 'Body Parts',
    condition: 'New Aftermarket',
    price: 480,
    comparePrice: 720,
    image: null,
    slug: 'ford-f150-hood-panel',
    isFreight: false,
  },
  {
    id: 4,
    name: 'Mercedes C300 Turbocharger',
    category: 'Internal Parts',
    condition: 'New OEM',
    price: 1650,
    comparePrice: 2400,
    image: null,
    slug: 'mercedes-c300-turbocharger',
    isFreight: false,
  },
  {
    id: 5,
    name: 'Dodge Ram Automatic Transmission',
    category: 'Transmission',
    condition: 'Remanufactured',
    price: 2200,
    comparePrice: 3500,
    image: null,
    slug: 'dodge-ram-auto-transmission',
    isFreight: true,
  },
  {
    id: 6,
    name: 'Jeep Wrangler Front Door Shell',
    category: 'Body Parts',
    condition: 'New OEM',
    price: 890,
    comparePrice: 1200,
    image: null,
    slug: 'jeep-wrangler-front-door',
    isFreight: false,
  },
]

const conditionColors = {
  'New OEM': 'bg-green-900/50 text-green-400 border-green-800',
  'New Aftermarket': 'bg-blue-900/50 text-blue-400 border-blue-800',
  'Remanufactured': 'bg-purple-500/20 text-purple-300 border-purple-500',
  'Used / Pull': 'bg-gray-800 text-gray-400 border-gray-700',
}

export default function BestSellers() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
            Featured Parts
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Premium quality parts for the world's most popular vehicles
          </p>
          <div className="w-16 h-1 bg-[#E8590A] mx-auto mt-4 rounded-full" />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProducts.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8590A] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image placeholder */}
              <div className="bg-[#0A1628] h-48 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-20">⚙️</div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent opacity-50" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isFreight && (
                    <span className="bg-yellow-500/90 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                      FREIGHT
                    </span>
                  )}
                  {product.comparePrice && (
                    <span className="bg-[#E8590A] text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Product info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded border ${conditionColors[product.condition]}`}>
                    {product.condition}
                  </span>
                </div>

                <h3 className="text-[#0A1628] font-bold text-base mb-3 group-hover:text-[#E8590A] transition-colors leading-snug">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E8590A] font-black text-xl">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-gray-400 text-sm line-through">
                        ${product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="bg-[#E8590A] text-white p-2 rounded-md group-hover:bg-[#ff6b1a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#0A1628] hover:bg-[#1a2d4a] text-white font-bold px-8 py-4 rounded-md transition-all duration-200 hover:scale-105"
          >
            View All Parts
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
