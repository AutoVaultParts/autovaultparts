export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0A1628]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 rounded-full border-4 border-gray-700" />
            {/* Spinning orange arc */}
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
            {/* Inner wheel spokes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 rounded-full border-2 border-[#E8590A]/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#E8590A]" />
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 rounded-full border border-[#E8590A]/40 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#E8590A]" />
          </div>
        </div>
      </div>
    </div>
  )
}
