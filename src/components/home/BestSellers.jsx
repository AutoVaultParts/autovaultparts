import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const CONDITION_LABELS = {
  new_oem: { label: 'New OEM', color: 'bg-green-100 text-green-700 border-green-200' },
  new_aftermarket: { label: 'New Aftermarket', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  remanufactured: { label: 'Remanufactured', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  used: { label: 'Used / Pull', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default function BestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching featured products:', err)
    } finally {
      setLoading(false)
    }
  }

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

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
                <div className="bg-gray-200 h-48" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => {
              const cond = CONDITION_LABELS[product.condition]
              const mainImage = product.images?.[0] || null
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8590A] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="bg-[#0A1628] h-48 flex items-center justify-center relative overflow-hidden">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.is_freight && (
                        <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                          FREIGHT
                        </span>
                      )}
                      {product.compare_price && (
                        <span className="bg-[#E8590A] text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
                        {product.brand || product.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded border flex-shrink-0 ${cond?.color}`}>
                        {cond?.label}
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
                        {product.compare_price && (
                          <span className="text-gray-400 text-sm line-through">
                            ${product.compare_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="bg-[#E8590A] text-white p-2 rounded-md group-hover:bg-[#ff6b1a] transition-colors flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

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