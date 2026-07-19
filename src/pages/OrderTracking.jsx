import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SEO from '../components/common/SEO'

const STATUS_COLORS = {
  'Order Confirmed': 'bg-blue-500',
  'Quality Check Complete': 'bg-purple-500',
  'Handed to Carrier': 'bg-yellow-500',
  'In Transit': 'bg-orange-500',
  'Out for Delivery': 'bg-orange-600',
  'Delivered': 'bg-green-500',
  'Processing': 'bg-blue-400',
  'Cancelled': 'bg-red-500',
}

export default function OrderTracking() {
  const { orderNumber } = useParams()
  const navigate = useNavigate()

  // ─── Restore saved tracking state from sessionStorage ───────────────────
  // Lets customers reload the page and keep their searched order number.
  const savedTrackingState = (() => {
    try {
      const raw = sessionStorage.getItem('avp_tracking_state')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const [searchInput, setSearchInput] = useState(orderNumber || savedTrackingState?.searchInput || '')
  const [order, setOrder] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // ─── Save tracking state whenever search input changes ──────────────────
  useEffect(() => {
    try {
      sessionStorage.setItem('avp_tracking_state', JSON.stringify({ searchInput }))
    } catch {
      // sessionStorage unavailable — fail silently, tracking still works
    }
  }, [searchInput])

  useEffect(() => {
    if (orderNumber) {
      setSearchInput(orderNumber)
      fetchTracking(orderNumber)
    }
  }, [orderNumber])

  async function fetchTracking(number) {
    setLoading(true)
    setNotFound(false)
    setOrder(null)
    setEvents([])

    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', number)
        .single()

      if (!orderData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setOrder(orderData)

      const { data: eventsData } = await supabase
        .from('order_tracking_events')
        .select('*')
        .eq('order_id', orderData.id)
        .eq('is_visible', true)
        .order('event_time', { ascending: false })

      setEvents(eventsData || [])
    } catch (err) {
      console.error('Tracking error:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`)
    }
  }

  const STATUS_DISPLAY = {
    confirmed: 'Order Confirmed',
    pending_payment: 'Pending Payment',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title={orderNumber ? `Tracking ${orderNumber}` : 'Track Your Order'}
        description="Track your AutoVaultParts order in real time. Enter your order number to see the latest shipping updates and delivery status."
        url="/track"
        noIndex={!!orderNumber}
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Track Your <span className="text-[#E8590A]">Order</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">Enter your order number to see real time updates</p>

          <div className="flex gap-0 max-w-lg mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. AVP-2026-44008"
              className="flex-1 bg-white border-0 rounded-l-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E8590A]"
            />
            <button
              type="button"
              onClick={handleSearch}
              onTouchEnd={e => { e.preventDefault(); handleSearch() }}
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-6 py-3 rounded-r-lg transition-colors text-sm"
            >
              Track
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* No order number entered */}
        {!orderNumber && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-xl font-black text-[#0A1628] mb-2">Track Your Shipment</h2>
            <p className="text-gray-500 text-sm">Enter your order number above to see the latest updates on your delivery.</p>
          </div>
        )}

        {/* Loading */}
        {orderNumber && loading && (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
              <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
            </div>
          </div>
        )}

        {/* Order not found */}
        {orderNumber && !loading && notFound && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-black text-[#0A1628] mb-3">Order Not Found</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              We could not find an order with that number. Please check your confirmation email and try again.
            </p>
            <Link to="/contact" className="bg-[#E8590A] text-white font-bold px-6 py-3 rounded-md text-sm inline-block">
              Contact Support
            </Link>
          </div>
        )}

        {/* Tracking found */}
        {orderNumber && !loading && order && (
          <div className="space-y-4">

            {/* Status card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#0A1628] px-5 py-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Order Number</p>
                  <p className="text-white font-black">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Status</p>
                  <p className="text-[#E8590A] font-bold text-sm capitalize">
                    {STATUS_DISPLAY[order.status] || order.status}
                  </p>
                </div>
              </div>
              <div className="p-5">
                {events.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#E8590A] animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-[#0A1628] font-black text-base">{events[0].status_label}</p>
                      {events[0].location && (
                        <p className="text-gray-500 text-sm mt-0.5">{events[0].location}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-[#0A1628] font-black text-base">
                      {STATUS_DISPLAY[order.status] || 'Order Received'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {events.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-[#0A1628] px-5 py-4">
                  <h2 className="text-white font-bold text-sm uppercase tracking-wider">Tracking Timeline</h2>
                </div>
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-gray-200" />
                    <div className="space-y-6">
                      {events.map((event, index) => (
                        <div key={event.id} className="flex gap-4 relative">
                          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${index === 0 ? (STATUS_COLORS[event.status_label] || 'bg-[#E8590A]') : 'bg-gray-200'}`}>
                            {index === 0 ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-2">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <p className={`font-bold text-sm ${index === 0 ? 'text-[#0A1628]' : 'text-gray-500'}`}>
                                {event.status_label}
                              </p>
                              <p className="text-xs text-gray-400 flex-shrink-0">
                                {new Date(event.event_time).toLocaleString()}
                              </p>
                            </div>
                            {event.location && (
                              <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                            )}
                            {event.description && (
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No events yet */}
            {events.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-gray-500 text-sm">Your order has been received. Tracking updates will appear here as your order progresses.</p>
              </div>
            )}

            {/* Help */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#0A1628] font-bold text-sm">Need help with your order?</p>
                <p className="text-gray-500 text-xs mt-0.5">Our team is available to assist you with any questions.</p>
              </div>
              <Link
                to="/contact"
                className="bg-[#0A1628] hover:bg-[#1a2d4a] text-white font-bold px-5 py-2.5 rounded-md transition-colors text-sm flex-shrink-0"
              >
                Contact Us
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
