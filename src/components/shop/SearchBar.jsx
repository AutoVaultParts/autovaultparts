import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ placeholder = "Search by part name, car model or brand...", compact = false }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const doSearch = () => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="w-full">
      <div className={`relative flex items-center w-full ${compact ? 'h-10' : 'h-12'}`}>
        <div className="absolute left-3 text-gray-400 pointer-events-none z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') doSearch()
          }}
          placeholder={placeholder}
          className={`flex-1 bg-white border border-gray-200 rounded-l-md pl-10 pr-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors ${compact ? 'h-10 text-sm' : 'h-12 text-sm'}`}
        />
        <button
          type="button"
          onTouchEnd={(e) => {
            e.preventDefault()
            doSearch()
          }}
          onClick={doSearch}
          className={`bg-[#E8590A] hover:bg-[#ff6b1a] active:bg-[#cc4d08] text-white font-bold rounded-r-md transition-colors flex items-center justify-center gap-1 flex-shrink-0 cursor-pointer select-none ${compact ? 'h-10 px-4 text-sm' : 'h-12 px-5 text-sm'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline pointer-events-none">Search</span>
        </button>
      </div>
    </div>
  )
}