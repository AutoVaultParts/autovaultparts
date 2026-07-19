import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('avp_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('avp_cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('avp_cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0A1628] border border-[#1a2d4a] rounded-2xl shadow-2xl overflow-hidden">

        {/* Main banner */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Icon and text */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#E8590A]/10 border border-[#E8590A]/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm mb-1">We use cookies to improve your experience</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  AutoVaultParts uses cookies for analytics and to improve site performance. We do not sell your data to third parties.{' '}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[#E8590A] hover:underline font-medium"
                  >
                    {showDetails ? 'Hide details' : 'Learn more'}
                  </button>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black px-5 py-2 rounded-lg text-xs transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Details panel */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-[#1a2d4a]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1a2d4a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-bold text-xs">Essential Cookies</p>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-medium">Always On</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Required for the website to function. These include session cookies that keep you logged in and cart cookies that remember your items.
                  </p>
                </div>
                <div className="bg-[#1a2d4a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-bold text-xs">Analytics Cookies</p>
                    <span className="text-xs bg-[#E8590A]/20 text-[#E8590A] px-2 py-0.5 rounded font-medium">Optional</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Google Analytics helps us understand how visitors use AutoVaultParts so we can improve the experience. No personal data is shared.
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                By clicking Accept All, you agree to the use of analytics cookies. You can change your preference at any time by clearing your browser cookies. Read our{' '}
                <a href="/privacy-policy" className="text-[#E8590A] hover:underline">Privacy Policy</a>{' '}
                for more information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}