import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  async function fetchOrder() {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .eq('order_number', id)
        .single()
      setOrder(data)
    } catch (err) {
      console.error('Error fetching order:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
        </div>
      </div>
    )
  }

  const addr = order?.shipping_address || {}
  const isBTC = order?.payment_method === 'bitcoin'
  const isZelle = order?.payment_method === 'zelle'
  const isCashApp = order?.payment_method === 'cashapp'
  const isManual = isBTC || isZelle || isCashApp

  const PAYMENT_LABELS = {
    card: 'Credit / Debit Card',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay',
    paypal: 'PayPal',
    cashapp: 'Cash App',
    zelle: 'Zelle',
    chime: 'Chime',
    bitcoin: 'Bitcoin (BTC)',
  }

  // ─── Payment method logo helper ──────────────────────────────────────────
  // Renders the correct logo(s) for whichever payment method was used.
  // Card shows Visa + Mastercard side by side since it's a generic card payment.
  function PaymentMethodLogo({ method }) {
    switch (method) {
      case 'bitcoin':
        return <img src="/btc-logo.png" alt="Bitcoin" className="h-5 w-5 object-contain" />
      case 'zelle':
        return <img src="/pay-zelle.png" alt="Zelle" className="h-5 w-auto object-contain" />
      case 'cashapp':
        return <img src="/pay-cashapp.png" alt="Cash App" className="h-5 w-auto object-contain" />
      case 'apple_pay':
        return <img src="/pay-applepay.png" alt="Apple Pay" className="h-5 w-auto object-contain" />
      case 'google_pay':
        return <img src="/pay-googlepay.png" alt="Google Pay" className="h-5 w-auto object-contain" />
      case 'paypal':
        return <img src="/pay-paypal.png" alt="PayPal" className="h-5 w-auto object-contain" />
      case 'chime':
        return <img src="/pay-chime.png" alt="Chime" className="h-5 w-auto object-contain" />
      case 'card':
        return (
          <div className="flex items-center gap-1">
            <img src="/pay-visa.png" alt="Visa" className="h-5 w-auto object-contain" />
            <img src="/pay-mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" />
          </div>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/">
            <img src="/logo.png" alt="AutoVaultParts" className="h-10 w-auto object-contain" />
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#0A1628] mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-1">Thank you for your order, {addr.firstName}.</p>
          <div className="inline-flex items-center gap-2 bg-[#0A1628] text-white px-4 py-2 rounded-full mt-2">
            <span className="text-xs text-gray-400">Order Number</span>
            <span className="text-[#E8590A] font-black text-sm">{id}</span>
          </div>
        </div>

        {/* Payment specific notice */}
        {isBTC && (
          <div className="bg-gradient-to-r from-[#0A1628] via-[#1a2d4a] to-[#0A1628] rounded-xl p-5 mb-6 border border-[#E8590A]/30">
            <div className="flex items-center gap-3 mb-3">
              <img src="/btc-logo.png" alt="Bitcoin" className="h-8 w-8 object-contain flex-shrink-0" />
              <div>
                <p className="text-white font-black text-sm">Bitcoin Payment — 10% Discount Applied</p>
                <p className="text-gray-400 text-xs mt-0.5">Your discounted total is shown below</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
              {[
                'Our team will contact you within 24 hours with our Bitcoin wallet address',
                'Send the exact discounted amount in BTC to the provided wallet',
                'Your order will be processed once payment is confirmed on the blockchain',
                'Shipping fee will be calculated and added to your final invoice',
              ].map(item => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-300 text-xs leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-3">
              Questions? Email us at <span className="text-[#E8590A] font-medium">support@autovaultparts.com</span>
            </p>
          </div>
        )}

        {isZelle && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img src="/pay-zelle.png" alt="Zelle" className="h-7 w-auto object-contain flex-shrink-0" />
              <p className="text-purple-800 font-black text-sm">Zelle Payment Pending</p>
            </div>
            <p className="text-purple-700 text-xs leading-relaxed mb-2">
              Our team will contact you within 24 hours with our Zelle payment details. Your order will be processed and shipped once payment is confirmed.
            </p>
            <p className="text-purple-600 text-xs">
              Questions? Email <span className="font-medium">support@autovaultparts.com</span>
            </p>
          </div>
        )}

        {isCashApp && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img src="/pay-cashapp.png" alt="Cash App" className="h-7 w-auto object-contain flex-shrink-0" />
              <p className="text-green-800 font-black text-sm">Cash App Payment Pending</p>
            </div>
            <p className="text-green-700 text-xs leading-relaxed mb-2">
              Our team will contact you within 24 hours with our Cash App details. Your order will be processed and shipped once payment is confirmed.
            </p>
            <p className="text-green-600 text-xs">
              Questions? Email <span className="font-medium">support@autovaultparts.com</span>
            </p>
          </div>
        )}

        {/* Order summary card */}
        {order && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">

            {/* Card header */}
            <div className="bg-[#0A1628] px-5 py-4">
              <h2 className="text-white font-black text-sm uppercase tracking-wider">Order Receipt</h2>
            </div>

            <div className="p-5 space-y-5">

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[#0A1628] font-bold text-sm truncate">{item.name}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity} · ${item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                      <p className="text-[#0A1628] font-bold text-sm flex-shrink-0">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Parts Total</span>
                  <span className={`text-sm font-medium ${isBTC ? 'text-gray-400 line-through' : 'text-[#0A1628] font-bold'}`}>
                    ${order.order_items?.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}
                  </span>
                </div>
                {isBTC && order.discount_amount > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[#E8590A] text-sm font-medium">BTC Discount (10%)</span>
                      <span className="text-green-600 text-sm font-bold">- ${order.discount_amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#0A1628] font-bold text-sm">Discounted Parts Total</span>
                      <span className="text-[#E8590A] font-black text-sm">${order.total?.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Shipping</span>
                  <span className="text-gray-500 text-sm">{isBTC ? 'Added to invoice' : 'Calculated by team'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[#0A1628] font-black text-base">Total Charged</span>
                  <span className="text-[#E8590A] font-black text-2xl">${order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment method — now with logo for every method, including card/paypal/chime */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment Method</p>
                <div className="flex items-center gap-2">
                  <PaymentMethodLogo method={order.payment_method} />
                  <span className="text-[#0A1628] font-medium text-sm">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                  {isManual && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Pending confirmation</span>
                  )}
                </div>
              </div>

              {/* Shipping address */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Delivering To</p>
                <p className="text-[#0A1628] font-bold text-sm">{addr.firstName} {addr.lastName}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}, {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}, {addr.country}
                </p>
                {addr.email && <p className="text-gray-500 text-xs mt-0.5">{addr.email}</p>}
                {addr.phone && <p className="text-gray-500 text-xs mt-0.5">{addr.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-[#0A1628] font-black text-base mb-4">What Happens Next</h2>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: isManual ? 'Payment Confirmation' : 'Order Processing',
                desc: isManual
                  ? 'Our team will contact you within 24 hours to confirm your payment details and process your order.'
                  : 'Our team is reviewing your order and preparing your parts for quality inspection.',
              },
              {
                step: '2',
                title: 'Quality Check',
                desc: 'Every part is inspected before packaging to ensure it meets our strict quality standards.',
              },
              {
                step: '3',
                title: 'Careful Packaging',
                desc: 'Your parts are professionally packaged to ensure they arrive in perfect condition.',
              },
              {
                step: '4',
                title: 'Shipping and Tracking',
                desc: 'Your order is handed to our carrier and real time tracking updates appear on our website.',
              },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E8590A] text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-[#0A1628] font-bold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need help */}
        <div className="bg-[#0A1628] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white font-bold text-sm">Need help with your order?</p>
              <p className="text-gray-400 text-xs mt-0.5">Our team responds to every message within 24 hours.</p>
              <p className="text-[#E8590A] text-xs font-medium mt-1">support@autovaultparts.com</p>
            </div>
            <Link
              to="/contact"
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex-shrink-0"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/track/${id}`}
            className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-8 py-3 rounded-md transition-colors text-sm text-center"
          >
            Track Your Order
          </Link>
          <Link
            to="/shop"
            className="border border-gray-300 hover:border-[#E8590A] text-gray-600 hover:text-[#E8590A] font-medium px-8 py-3 rounded-md transition-colors text-sm text-center"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}