import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '../components/shop/FilterSidebar'
import ProductGrid from '../components/shop/ProductGrid'
import SearchBar from '../components/shop/SearchBar'
import SEO from '../components/common/SEO'

export default function Shop() {
  const [searchParams] = useSearchParams()

  // ─── Restore saved shop state from sessionStorage ───────────────────────
  const savedShopState = (() => {
    try {
      const raw = sessionStorage.getItem('avp_shop_state')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const [filters, setFilters] = useState({
    make: searchParams.get('make') || savedShopState?.filters?.make || '',
    model: searchParams.get('model') || savedShopState?.filters?.model || '',
    year: searchParams.get('year') || savedShopState?.filters?.year || '',
    category: searchParams.get('category') || savedShopState?.filters?.category || '',
    condition: savedShopState?.filters?.condition || '',
    minPrice: savedShopState?.filters?.minPrice || '',
    maxPrice: savedShopState?.filters?.maxPrice || '',
    sort: savedShopState?.filters?.sort || 'newest',
    search: searchParams.get('search') || savedShopState?.filters?.search || '',
  })

  const [mobileFilterOpen, setMobileFilterOpen] = useState(savedShopState?.mobileFilterOpen || false)

  // ─── Save shop state whenever filters or mobile state change ──────────────
  useEffect(() => {
    try {
      sessionStorage.setItem('avp_shop_state', JSON.stringify({ filters, mobileFilterOpen }))
    } catch {
      // sessionStorage unavailable — fail silently
    }
  }, [filters, mobileFilterOpen])

  // ─── Update filters from URL params ──
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      make: searchParams.get('make') || prev.make,
      model: searchParams.get('model') || prev.model,
      year: searchParams.get('year') || prev.year,
      category: searchParams.get('category') || prev.category,
      search: searchParams.get('search') || prev.search,
    }))
  }, [searchParams])

  const category = searchParams.get('category')
  const make = searchParams.get('make')
  const search = searchParams.get('search')

  const getSEOTitle = () => {
    if (search) return `Search Results for "${search}"`
    if (make) return `${make} Spare Parts`
    if (category === 'body') return 'Body Parts - Bumpers, Hoods and Doors'
    if (category === 'engine') return 'Engines - Complete Engine Assemblies'
    if (category === 'transmission') return 'Transmissions - Automatic and Manual'
    if (category === 'internal') return 'Internal Parts - Turbos, Steering and More'
    if (category === 'suspension') return 'Suspension Parts'
    if (category === 'electrical') return 'Electrical Parts'
    if (category === 'exhaust') return 'Exhaust Systems'
    if (category === 'wheels') return 'Wheels and Rims'
    if (category === 'tyres') return 'Tyres'
    return 'Shop Car Parts'
  }

  const getSEODescription = () => {
    if (search) return `Search results for "${search}" on AutoVaultParts. Premium quality car spare parts shipped globally.`
    if (make) return `Shop premium spare parts for ${make} vehicles. New OEM, aftermarket and remanufactured parts available. Free shipping on qualifying orders.`
    if (category === 'body') return 'Shop premium body parts including bumpers, hoods, doors, fenders and panels for BMW, Toyota, Ford, Mercedes and more. Free shipping on qualifying orders.'
    if (category === 'engine') return 'Buy complete engines and engine assemblies for all major vehicle brands. New OEM, remanufactured and used engines available. Global shipping.'
    if (category === 'transmission') return 'Shop automatic and manual transmissions for all major vehicle brands. Remanufactured and used transmissions with warranty. Global shipping.'
    return 'Browse thousands of premium car spare parts. Filter by make, model and year to find exact fitting parts. New OEM, aftermarket, remanufactured and used parts available.'
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title={getSEOTitle()}
        description={getSEODescription()}
        url="/shop"
      />

      <div className="bg-[#0A1628] py-8 px-4 w-full">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Shop <span className="text-[#E8590A]">Parts</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-5">
            Premium spare parts for every car. Filter by your vehicle to find exact fits.
          </p>
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 w-full">

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-[#0A1628] text-white py-3 px-4 rounded-md font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-4">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        )}

        <div className="hidden lg:flex gap-8">
          <div className="w-72 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
          <div className="flex-1 min-w-0">
            <ProductGrid filters={filters} setFilters={setFilters} />
          </div>
        </div>

        <div className="lg:hidden">
          <ProductGrid filters={filters} setFilters={setFilters} />
        </div>

      </div>
    </div>
  )
}