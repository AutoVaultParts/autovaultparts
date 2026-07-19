import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchOrders()
    else setLoading(false)
  }, [user])

  async function fetchOrders() {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .eq('shipping_address->>email', user.email)
        .order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-xl font-black text-[#0A1628] mb-3">Sign In Required</h2>
          <p className="text-gray-500 text-sm mb-6">Please sign in to view your order history.</p>
          <Link to="/account" className="bg-[#E8590A] text-white font-bold px-6 py-3 rounded-md inline-block">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* Header */}
      <div className="bg-[#0A1628] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/account" className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Order <span className="text-[#E8590A]">History</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-8">All your past orders in one place</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        )}

        {/* No orders */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl font-black text-[#0A1628] mb-3">No Orders Yet</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              You have not placed any orders yet. Browse our catalog to find the parts you need.
            </p>
            <Link to="/shop" className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-8 py-3 rounded-md transition-colors inline-block">
              Browse Parts
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#E8590A] transition-colors">

                {/* Order header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-[#0A1628] font-black text-base">{order.order_number}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs px-3 py-1.5 rounded font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                      <span className="text-[#E8590A] font-black text-lg">
                        ${order.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-5">
                  <div className="space-y-3 mb-4">
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0A1628] font-medium text-sm truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity} · ${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-gray-100">
                    <Link
                      to={`/track/${order.order_number}`}
                      className="text-xs bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-4 py-2 rounded-md transition-colors"
                    >
                      Track Order
                    </Link>
                    <Link
                      to={`/order/${order.order_number}`}
                      className="text-xs border border-gray-200 hover:border-[#E8590A] text-gray-600 hover:text-[#E8590A] font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                    <span className="text-gray-400 text-xs capitalize ml-auto">
                      via {order.payment_method?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}