import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { formatPrice, getFreeShippingThreshold, qualifiesForFreeShipping } from '../utils/helpers'
import SEO from '../components/common/SEO'

// ─── COUNTRY LIST ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  // North America
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },

  // South America
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'GY', name: 'Guyana' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'SR', name: 'Suriname' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },

  // Europe — Western
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'ES', name: 'Spain' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'GR', name: 'Greece' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Sweden' },

  // Europe — Eastern
  { code: 'AL', name: 'Albania' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BY', name: 'Belarus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'EE', name: 'Estonia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'HU', name: 'Hungary' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'PL', name: 'Poland' },
  { code: 'RO', name: 'Romania' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'XK', name: 'Kosovo' },

  // Oceania
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
]

// ─── US STATES ────────────────────────────────────────────────────────────────
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

// ─── PAYMENT METHODS ──────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'card',       label: 'Credit or Debit Card', logo: null,                global: true },
  { id: 'apple_pay',  label: 'Apple Pay',             logo: '/pay-applepay.png', global: true },
  { id: 'google_pay', label: 'Google Pay',            logo: '/pay-googlepay.png',global: true },
  { id: 'paypal',     label: 'PayPal',                logo: '/pay-paypal.png',   global: true },
  { id: 'cashapp',    label: 'Cash App Pay',          logo: '/pay-cashapp.png',  global: false, regions: ['US'] },
  { id: 'zelle',      label: 'Zelle',                 logo: '/pay-zelle.png',    global: false, regions: ['US'] },
  {
    id: 'chime',
    label: 'Chime',
    logo: '/pay-chime.png',
    global: false,
    regions: ['US', 'CA', 'GB', 'BR', 'MX', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'IE', 'AT', 'CH', 'PL', 'SG', 'AE'],
  },
  { id: 'bitcoin',    label: 'Bitcoin (BTC)',          logo: null,               global: true },
]

// ─── PAYMENT METHOD LOGO HELPER ───────────────────────────────────────────────
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

export default function Checkout() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const navigate = useNavigate()

  const savedState = (() => {
    try {
      const raw = sessionStorage.getItem('avp_checkout_state')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const [step, setStep] = useState(savedState?.step || 1)
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState('')

  const [address, setAddress] = useState(savedState?.address || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const [paymentMethod, setPaymentMethod] = useState(savedState?.paymentMethod || 'card')

  useEffect(() => {
    try {
      sessionStorage.setItem('avp_checkout_state', JSON.stringify({ step, address, paymentMethod }))
    } catch {
      // sessionStorage unavailable — fail silently
    }
  }, [step, address, paymentMethod])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const hasFreight = items.some(i => i.isFreight)
  const nonFreightSubtotal = items.filter(i => !i.isFreight).reduce((sum, i) => sum + i.price * i.quantity, 0)
  const nonFreightItems = items.filter(i => !i.isFreight)
  const freeShipping = nonFreightItems.length > 0 && qualifiesForFreeShipping(nonFreightSubtotal, address.country)
  const allFreight = items.every(i => i.isFreight)
  const isHighValue = subtotal >= 2000

  const isBTC = paymentMethod === 'bitcoin'
  const btcDiscount = isBTC ? Math.round(subtotal * 0.10 * 100) / 100 : 0
  const btcTotal = isBTC ? subtotal - btcDiscount : subtotal

  const availablePaymentMethods = PAYMENT_METHODS.filter(
    m => m.global || (m.regions && m.regions.includes(address.country))
  )

  const handleAddressChange = (key, value) => {
    setAddress(prev => ({ ...prev, [key]: value }))
  }

  const isAddressValid =
    address.firstName && address.lastName && address.email &&
    address.address1 && address.city && address.country &&
    (address.country !== 'US' || address.state) &&
    (address.country !== 'US' || address.zip)

  const handlePlaceOrder = async () => {
    setLoading(true)
    setOrderError('')
    try {
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 90000) + 10000
      const orderNumber = `AVP-${year}-${random}`

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          payment_method: paymentMethod,
          status: 'pending_payment',
          subtotal: subtotal,
          shipping_cost: 0,
          total: isBTC ? btcTotal : subtotal,
          discount_amount: isBTC ? btcDiscount : 0,
          shipping_address: address,
          is_freight: items.some(i => i.isFreight),
          zelle_confirmed: false,
          btc_discount_applied: isBTC,
        })
        .select()
        .single()

      if (orderErr) throw orderErr

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      await supabase
        .from('order_tracking_events')
        .insert({
          order_id: order.id,
          status_label: 'Order Confirmed',
          location: 'AutoVaultParts',
          description: 'Your order has been received and is being processed',
          is_visible: true,
        })

      clearCart()
      sessionStorage.removeItem('avp_checkout_state')
      navigate(`/order/${orderNumber}`)

    } catch (error) {
      console.error('Order error:', error)
      setOrderError('Something went wrong placing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEO title="Checkout" url="/checkout" noIndex={true} />
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-xl font-black text-[#0A1628] mb-3">Your cart is empty</h2>
          <Link to="/shop" className="bg-[#E8590A] text-white font-bold px-8 py-3 rounded-md inline-block">
            Browse Parts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO title="Checkout" url="/checkout" noIndex={true} />

      {/* Top header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="AutoVaultParts" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={step >= 1 ? 'text-[#E8590A] font-bold' : ''}>Shipping</span>
            <span>›</span>
            <span className={step >= 2 ? 'text-[#E8590A] font-bold' : ''}>Payment</span>
            <span>›</span>
            <span className={step >= 3 ? 'text-[#E8590A] font-bold' : ''}>Review</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* BTC promotion banner */}
      <div className="bg-gradient-to-r from-[#0A1628] via-[#1a2d4a] to-[#0A1628] border-b border-[#E8590A]/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/btc-logo.png" alt="Bitcoin" className="h-10 w-10 object-contain flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-black text-sm">Pay with Bitcoin and Save 10%</span>
                  <span className="bg-[#E8590A] text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">LIMITED OFFER</span>
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  Get <span className="text-[#E8590A] font-bold">{formatPrice(subtotal * 0.10)}</span> off your order of <span className="text-white font-medium">{formatPrice(subtotal)}</span>. Pay <span className="text-green-400 font-bold">{formatPrice(subtotal * 0.90)}</span> instead. Shipping calculated separately.
                </p>
              </div>
            </div>
            <button
              onClick={() => { setPaymentMethod('bitcoin'); setStep(2) }}
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black px-5 py-2.5 rounded-lg text-sm transition-all hover:scale-105 flex-shrink-0 flex items-center gap-2 shadow-lg"
            >
              <img src="/btc-logo.png" alt="Bitcoin" className="h-6 w-6 object-contain" />
              Pay with Bitcoin — Save 10%
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left side — form steps */}
          <div className="flex-1 min-w-0">

            {/* STEP 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-[#0A1628] font-black text-lg">Shipping Address</h2>
                  <p className="text-gray-500 text-sm mt-1">Where should we deliver your parts?</p>
                </div>
                <div className="p-6 space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">First Name *</label>
                      <input type="text" value={address.firstName} onChange={e => handleAddressChange('firstName', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Last Name *</label>
                      <input type="text" value={address.lastName} onChange={e => handleAddressChange('lastName', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input type="email" value={address.email} onChange={e => handleAddressChange('email', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <input type="tel" value={address.phone} onChange={e => handleAddressChange('phone', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="+1 234 567 8900" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Country *</label>
                    <select value={address.country} onChange={e => handleAddressChange('country', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white">
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Street Address *</label>
                    <input type="text" value={address.address1} onChange={e => handleAddressChange('address1', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Apartment, Suite, etc. (optional)</label>
                    <input type="text" value={address.address2} onChange={e => handleAddressChange('address2', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="Apt 4B" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">City *</label>
                      <input type="text" value={address.city} onChange={e => handleAddressChange('city', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="New York" />
                    </div>
                    {address.country === 'US' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">State *</label>
                        <select value={address.state} onChange={e => handleAddressChange('state', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white">
                          <option value="">Select State</option>
                          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}
                    {address.country === 'US' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">ZIP Code *</label>
                        <input type="text" value={address.zip} onChange={e => handleAddressChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors" placeholder="10001" />
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => isAddressValid && setStep(2)}
                      disabled={!isAddressValid}
                      className={`w-full py-4 rounded-lg font-black text-base transition-all ${isAddressValid ? 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Delivering to</p>
                    <p className="text-sm text-[#0A1628] font-medium">{address.firstName} {address.lastName} · {address.city}, {address.country}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#E8590A] text-xs font-medium hover:underline">Edit</button>
                </div>

                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-[#0A1628] font-black text-lg">Payment Method</h2>
                  <p className="text-gray-500 text-sm mt-1">All transactions are secure and encrypted</p>
                </div>

                <div className="p-6 space-y-4">

                  <div className="space-y-2">
                    {availablePaymentMethods.map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#E8590A] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="accent-[#E8590A]"
                        />
                        {method.id === 'bitcoin' ? (
                          <img src="/btc-logo.png" alt="Bitcoin" className="h-6 w-6 object-contain flex-shrink-0" />
                        ) : method.logo ? (
                          <img src={method.logo} alt={method.label} className="h-6 w-auto object-contain flex-shrink-0" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-[#0A1628]">{method.label}</span>
                          {method.id === 'bitcoin' && (
                            <p className="text-xs text-[#E8590A] font-medium mt-0.5">10% discount applied — you save {formatPrice(btcDiscount)}</p>
                          )}
                        </div>
                        {method.id === 'zelle' && (
                          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Manual confirmation</span>
                        )}
                        {method.id === 'bitcoin' && (
                          <span className="ml-auto text-xs text-white bg-[#E8590A] px-2 py-1 rounded font-bold">SAVE 10%</span>
                        )}
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-bold text-sm mb-1">How Card Payment works at AutoVaultParts</p>
                      <p className="text-blue-700 text-xs leading-relaxed">Place your order and our support team will contact you within 24 hours with secure payment instructions. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-800 font-bold text-sm mb-1">How Apple Pay works at AutoVaultParts</p>
                      <p className="text-gray-700 text-xs leading-relaxed">Place your order and our support team will contact you within 24 hours with Apple Pay instructions. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}

                  {paymentMethod === 'google_pay' && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-800 font-bold text-sm mb-1">How Google Pay works at AutoVaultParts</p>
                      <p className="text-gray-700 text-xs leading-relaxed">Place your order and our support team will contact you within 24 hours with Google Pay instructions. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 font-bold text-sm mb-1">How PayPal works at AutoVaultParts</p>
                      <p className="text-blue-700 text-xs leading-relaxed">Place your order and our team will send you a PayPal payment request within 24 hours. <span className="font-bold">Important!</span> Payment must be sent via Friends &amp; Family only. This protects both you and our business. No package leaves our warehouse until payment is confirmed and verified.</p>
                    </div>
                  )}

                  {paymentMethod === 'cashapp' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-bold text-sm mb-1">How Cash App works at AutoVaultParts</p>
                      <p className="text-green-700 text-xs leading-relaxed">Place your order and our team will contact you within 24 hours with our Cash App details. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}

                  {paymentMethod === 'zelle' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-purple-800 font-bold text-sm mb-1">How Zelle works at AutoVaultParts</p>
                      <p className="text-purple-700 text-xs leading-relaxed">Place your order and our team will contact you within 24 hours with our Zelle details. Your order will be processed once payment is confirmed by our team.</p>
                    </div>
                  )}

                  {paymentMethod === 'chime' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="/pay-chime.png" alt="Chime" className="h-5 w-auto object-contain flex-shrink-0" />
                        <p className="text-emerald-800 font-bold text-sm">How Chime works at AutoVaultParts</p>
                      </div>
                      <p className="text-emerald-700 text-xs leading-relaxed">Place your order and our team will contact you within 24 hours with our Chime payment details. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}

                  {paymentMethod === 'bitcoin' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="/btc-logo.png" alt="Bitcoin" className="h-5 w-5 object-contain flex-shrink-0" />
                        <p className="text-orange-800 font-bold text-sm">How Bitcoin payment works at AutoVaultParts</p>
                      </div>
                      <ul className="space-y-1.5">
                        {[
                          'Place your order and your 10% discount will be applied automatically',
                          'Our team will contact you within 24 hours with our Bitcoin wallet address',
                          'Send the exact discounted amount in BTC to the provided wallet',
                          'Your order will be processed and shipped once payment is confirmed on the blockchain',
                          'Shipping fee is calculated separately and added to your final invoice',
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                            <span className="text-orange-700 text-xs leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isHighValue && paymentMethod !== 'bitcoin' && (
                    <div className="p-4 bg-[#E8590A]/5 border border-[#E8590A]/20 rounded-lg">
                      <p className="text-[#E8590A] font-bold text-sm mb-1">High Value Order</p>
                      <p className="text-gray-600 text-xs leading-relaxed">Your order exceeds $2,000. Our team will contact you to confirm delivery details and arrange payment before processing begins.</p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black py-4 rounded-lg text-base transition-colors"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Place Order */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Delivering to</p>
                    <p className="text-sm text-[#0A1628] font-medium">{address.firstName} {address.lastName} · {address.address1}, {address.city}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#E8590A] text-xs font-medium hover:underline">Edit</button>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Payment</p>
                    <div className="flex items-center gap-2">
                      <PaymentMethodLogo method={paymentMethod} />
                      <p className="text-sm text-[#0A1628] font-medium capitalize">
                        {paymentMethod === 'card'        ? 'Credit / Debit Card'
                        : paymentMethod === 'bitcoin'    ? 'Bitcoin (BTC) — 10% discount applied'
                        : paymentMethod === 'apple_pay'  ? 'Apple Pay'
                        : paymentMethod === 'google_pay' ? 'Google Pay'
                        : paymentMethod === 'paypal'     ? 'PayPal'
                        : paymentMethod === 'cashapp'    ? 'Cash App Pay'
                        : paymentMethod === 'zelle'      ? 'Zelle'
                        : paymentMethod === 'chime'      ? 'Chime'
                        : paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="text-[#E8590A] text-xs font-medium hover:underline">Edit</button>
                </div>

                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-[#0A1628] font-black text-lg">Review Your Order</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0A1628] font-bold text-sm truncate">{item.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[#0A1628] font-bold text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {isBTC && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <img src="/btc-logo.png" alt="Bitcoin" className="h-4 w-4 object-contain flex-shrink-0" />
                        <p className="text-orange-800 font-bold text-sm">Bitcoin Payment Discount Applied</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Parts Total</span>
                          <span className="text-gray-500 line-through">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#E8590A] font-medium">BTC Discount (10%)</span>
                          <span className="text-green-600 font-bold">- {formatPrice(btcDiscount)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-orange-200 pt-1.5 mt-1.5">
                          <span className="text-[#0A1628] font-bold">Discounted Parts Total</span>
                          <span className="text-[#E8590A] font-black">{formatPrice(btcTotal)}</span>
                        </div>
                        <p className="text-orange-600 text-xs mt-2">+ Shipping fee will be added to your final invoice</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-xs text-gray-500 leading-relaxed">
                    By placing your order, you agree to AutoVaultParts terms of service. All parts are subject to our quality guarantee and return policy.
                  </div>

                  {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-600 text-sm">{orderError}</p>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-black text-base transition-all ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Place Order · ${formatPrice(isBTC ? btcTotal : subtotal)}`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-500">Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side — order summary sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              <div className="bg-[#0A1628] px-5 py-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Order Summary</h2>
              </div>
              <div className="p-5">

                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0A1628]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 bg-[#0A1628] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0A1628] text-xs font-medium truncate">{item.name}</p>
                        {item.isFreight && <span className="text-yellow-600 text-xs">Freight</span>}
                      </div>
                      <p className="text-[#0A1628] font-bold text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Subtotal</span>
                    <span className={`font-bold text-sm ${isBTC ? 'text-gray-400 line-through' : 'text-[#0A1628]'}`}>{formatPrice(subtotal)}</span>
                  </div>
                  {isBTC && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[#E8590A] text-sm font-medium">BTC Discount (10%)</span>
                        <span className="text-green-600 font-bold text-sm">- {formatPrice(btcDiscount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0A1628] font-bold text-sm">Discounted Total</span>
                        <span className="text-[#E8590A] font-black text-sm">{formatPrice(btcTotal)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Shipping</span>
                    <span className={`text-sm font-medium ${freeShipping && !hasFreight && !isBTC ? 'text-green-600' : 'text-gray-500'}`}>
                      {isBTC
                        ? 'Added to invoice'
                        : allFreight
                        ? 'Calculated at checkout'
                        : freeShipping && !hasFreight
                        ? 'FREE'
                        : hasFreight
                        ? 'Partial freight applies'
                        : 'Calculated at checkout'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0A1628] font-black text-base">Total</span>
                    <span className="font-black text-2xl text-[#E8590A]">
                      {formatPrice(isBTC ? btcTotal : subtotal)}
                    </span>
                  </div>
                  {isBTC && (
                    <p className="text-xs text-gray-400 mt-1 text-right">+ shipping fee on invoice</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}