import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ placeholder = "Search by part name, car model or brand...", compact = false }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`relative flex items-center ${compact ? 'h-10' : 'h-14'}`}>
        <div className="absolute left-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border border-gray-200 rounded-l-md pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors ${compact ? 'h-10 text-sm' : 'h-14 text-base'}`}
        />
        <button
          type="submit"
          className={`bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-6 rounded-r-md transition-colors flex items-center gap-2 whitespace-nowrap ${compact ? 'h-10 text-sm' : 'h-14 text-base'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {!compact && <span>Search</span>}
        </button>
      </div>
    </form>
  )
}
