import { Link } from 'react-router-dom'

const categories = [
  {
    title: 'Body Parts',
    description: 'Bumpers, hoods, fenders, doors and more',
    range: '$100 - $5,000+',
    path: '/shop?category=body',
    image: '/src/assets/images/category-body.jpg',
  },
  {
    title: 'Engines',
    description: 'Complete engines and major assemblies',
    range: '$800 - $15,000+',
    path: '/shop?category=engine',
    image: '/src/assets/images/category-engine.jpg',
  },
  {
    title: 'Internal Parts',
    description: 'Turbochargers, AC compressors, alternators',
    range: '$150 - $2,000',
    path: '/shop?category=internal',
    image: '/src/assets/images/category-internal.jpg',
  },
  {
    title: 'Transmission',
    description: 'Automatic and manual transmissions',
    range: '$800 - $3,500',
    path: '/shop?category=transmission',
    image: '/src/assets/images/category-transmission.jpg',
  },
]

export default function FeaturedCategories() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Find the exact part you need from our premium catalog of high-value automotive components
          </p>
          <div className="w-16 h-1 bg-[#E8590A] mx-auto mt-4 rounded-full" />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.title}
              to={cat.path}
              className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8590A] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E8590A]/10 h-72"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />

              {/* Orange accent line at bottom on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8590A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#E8590A] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#E8590A] text-sm font-bold">{cat.range}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#E8590A] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[#E8590A] font-medium hover:gap-4 transition-all duration-200"
          >
            View all categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}