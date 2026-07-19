import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import LoadingSpinner from '../common/LoadingSpinner'

const CONDITION_LABELS = {
  new_oem: { label: 'New OEM', color: 'bg-green-100 text-green-700 border-green-200' },
  new_aftermarket: { label: 'New Aftermarket', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  remanufactured: { label: 'Remanufactured', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  used: { label: 'Used / Pull', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default function ProductGrid({ filters, setFilters }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [filters])

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_compatibility (
            car_id,
            cars (make, model, year_from, year_to)
          )
        `)
        .eq('is_active', true)

      if (filters.category) query = query.eq('category', filters.category)
      if (filters.condition) query = query.eq('condition', filters.condition)
      if (filters.minPrice) query = query.gte('price', Number(filters.minPrice))
      if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice))
      if (filters.search) query = query.ilike('name', `%${filters.search}%`)

      if (filters.sort === 'price_asc') query = query.order('price', { ascending: true })
      else if (filters.sort === 'price_desc') query = query.order('price', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      let filtered = data || []

      if (filters.make) {
        filtered = filtered.filter(p =>
          p.product_compatibility?.some(c =>
            c.cars?.make === filters.make &&
            (!filters.model || c.cars?.model === filters.model)
          )
        )
      }

      setProducts(filtered)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={fetchProducts} className="mt-4 text-[#E8590A] font-medium text-sm hover:underline">
        Try Again
      </button>
    </div>
  )

  return (
    <div className="w-full">

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">
          Showing <span className="font-bold text-[#0A1628]">{products.length}</span> parts
          {filters.make && (
            <span className="text-[#E8590A] font-medium"> for {filters.make} {filters.model} {filters.year}</span>
          )}
        </p>
      </div>

      {/* No results */}
      {products.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center w-full">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-[#0A1628] mb-3">No Parts Found</h3>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed px-4">
            We could not find any parts matching your search. We have thousands of parts in our warehouse that are not yet listed online.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link
              to="/contact"
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-6 py-3 rounded-md transition-colors text-center text-sm"
            >
              Contact Us About This Part
            </Link>
            <button
              onClick={() => setFilters(prev => ({
                ...prev,
                make: '',
                model: '',
                year: '',
                category: '',
                condition: '',
                minPrice: '',
                maxPrice: '',
                search: '',
              }))}
              className="border border-gray-300 hover:border-[#E8590A] text-gray-600 hover:text-[#E8590A] font-medium px-6 py-3 rounded-md transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(product => {
            const cond = CONDITION_LABELS[product.condition]
            const mainImage = product.images?.[0] || '/category-body.jpg'
            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8590A] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="h-44 relative overflow-hidden bg-[#0A1628]">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">
                      {product.brand}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded border flex-shrink-0 ${cond?.color}`}>
                      {cond?.label}
                    </span>
                  </div>
                  <h3 className="text-[#0A1628] font-bold text-sm mb-1 group-hover:text-[#E8590A] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#E8590A] font-black text-lg">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.compare_price && (
                        <span className="text-gray-400 text-xs line-through">
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
    </div>
  )
}