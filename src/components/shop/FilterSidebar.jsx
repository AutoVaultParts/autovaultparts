import { useState, useEffect } from 'react'

const CAR_DATA = {
  Toyota: {
    Camry: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    Corolla: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    HiLux: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    LandCruiser: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    RAV4: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  BMW: {
    'M3': ['2019', '2020', '2021', '2022', '2023', '2024'],
    'M4': ['2019', '2020', '2021', '2022', '2023', '2024'],
    '3 Series': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    '5 Series': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'X5': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  'Mercedes-Benz': {
    'C-Class': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'E-Class': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'GLE': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'AMG GT': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Ford: {
    'F-150': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Ranger': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Mustang': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Explorer': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Dodge: {
    'Charger': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Challenger': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Ram 1500': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Durango': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Chevrolet: {
    'Silverado': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Camaro': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Tahoe': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Jeep: {
    'Wrangler': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Grand Cherokee': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Audi: {
    'A4': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'A6': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Q5': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'RS6': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Subaru: {
    'WRX': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Outback': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Forester': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
  Porsche: {
    '911': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Cayenne': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    'Panamera': ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  },
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'body', label: 'Body Parts' },
  { value: 'engine', label: 'Engines' },
  { value: 'internal', label: 'Internal Parts' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'exhaust', label: 'Exhaust' },
  { value: 'wheels', label: 'Wheels and Rims' },
  { value: 'tyres', label: 'Tyres' },
]

const CONDITIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'new_oem', label: 'New OEM' },
  { value: 'new_aftermarket', label: 'New Aftermarket' },
  { value: 'remanufactured', label: 'Remanufactured' },
  { value: 'used', label: 'Used / Pull' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export default function FilterSidebar({ filters, setFilters }) {
  const [availableModels, setAvailableModels] = useState([])
  const [availableYears, setAvailableYears] = useState([])

  useEffect(() => {
    if (filters.make && CAR_DATA[filters.make]) {
      setAvailableModels(Object.keys(CAR_DATA[filters.make]))
      setAvailableYears([])
    } else {
      setAvailableModels([])
      setAvailableYears([])
    }
  }, [filters.make])

  useEffect(() => {
    if (filters.make && filters.model && CAR_DATA[filters.make]?.[filters.model]) {
      setAvailableYears(CAR_DATA[filters.make][filters.model])
    } else {
      setAvailableYears([])
    }
  }, [filters.make, filters.model])

  const handleChange = (key, value) => {
    if (key === 'make') {
      setFilters(prev => ({ ...prev, make: value, model: '', year: '' }))
    } else if (key === 'model') {
      setFilters(prev => ({ ...prev, model: value, year: '' }))
    } else {
      setFilters(prev => ({ ...prev, [key]: value }))
    }
  }

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      search: '',
    })
  }

  const hasActiveFilters = filters.make || filters.model || filters.year ||
    filters.category || filters.condition || filters.minPrice || filters.maxPrice

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-32">

      {/* Header */}
      <div className="bg-[#0A1628] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Filter Parts</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[#E8590A] text-xs hover:text-orange-400 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">

        {/* Vehicle filter section */}
        <div>
          <h4 className="text-[#0A1628] font-bold text-sm mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
            </svg>
            Find Parts for Your Car
          </h4>

          {/* Make */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wide">Make</label>
            <select
              value={filters.make}
              onChange={e => handleChange('make', e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] bg-white"
            >
              <option value="">Select Make</option>
              {Object.keys(CAR_DATA).map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wide">Model</label>
            <select
              value={filters.model}
              onChange={e => handleChange('model', e.target.value)}
              disabled={!filters.make}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select Model</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wide">Year</label>
            <select
              value={filters.year}
              onChange={e => handleChange('year', e.target.value)}
              disabled={!filters.model}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select Year</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Active vehicle badge */}
          {filters.make && (
            <div className="mt-3 p-2 bg-[#E8590A]/10 border border-[#E8590A]/20 rounded-md">
              <p className="text-[#E8590A] text-xs font-medium">
                Showing parts for: {filters.make} {filters.model} {filters.year}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100" />

        {/* Category */}
        <div>
          <h4 className="text-[#0A1628] font-bold text-sm mb-3">Category</h4>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={filters.category === cat.value}
                  onChange={e => handleChange('category', e.target.value)}
                  className="accent-[#E8590A]"
                />
                <span className={`text-sm transition-colors ${filters.category === cat.value ? 'text-[#E8590A] font-medium' : 'text-gray-600 group-hover:text-[#E8590A]'}`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Condition */}
        <div>
          <h4 className="text-[#0A1628] font-bold text-sm mb-3">Condition</h4>
          <div className="space-y-2">
            {CONDITIONS.map(cond => (
              <label key={cond.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="condition"
                  value={cond.value}
                  checked={filters.condition === cond.value}
                  onChange={e => handleChange('condition', e.target.value)}
                  className="accent-[#E8590A]"
                />
                <span className={`text-sm transition-colors ${filters.condition === cond.value ? 'text-[#E8590A] font-medium' : 'text-gray-600 group-hover:text-[#E8590A]'}`}>
                  {cond.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Price range */}
        <div>
          <h4 className="text-[#0A1628] font-bold text-sm mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={e => handleChange('minPrice', e.target.value)}
                className="w-full border border-gray-200 rounded-md pl-6 pr-3 py-2 text-sm focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A]"
              />
            </div>
            <span className="text-gray-400 text-sm">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={e => handleChange('maxPrice', e.target.value)}
                className="w-full border border-gray-200 rounded-md pl-6 pr-3 py-2 text-sm focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Sort */}
        <div>
          <h4 className="text-[#0A1628] font-bold text-sm mb-3">Sort By</h4>
          <select
            value={filters.sort}
            onChange={e => handleChange('sort', e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] bg-white"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  )
}