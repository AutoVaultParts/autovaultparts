import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, getFreeShippingThreshold, amountToFreeShipping } from '../utils/helpers'
import SEO from '../components/common/SEO'

export default function Cart() {
  const { items, subtotal, itemCount, removeItem, updateQuantity, clearCart } = useCart()

  const countryCode = 'US'
  const threshold = getFreeShippingThreshold(countryCode)
  const hasFreightOnly = items.every(item => item.isFreight)
  const hasAnyFreight = items.some(item => item.isFreight)
  const nonFreightSubtotal = items.filter(i => !i.isFreight).reduce((sum, i) => sum + i.price * i.quantity, 0)
  const nonFreightRemaining = amountToFreeShipping(nonFreightSubtotal, countryCode)
  const qualifies = nonFreightRemaining === 0 && !hasFreightOnly

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEO title="Your Cart" url="/cart" noIndex={true} />
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-black text-[#0A1628] mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You have not added any parts yet. Browse our catalog and find the exact part you need.
          </p>
          <Link
            to="/shop"
            className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-8 py-3 rounded-md transition-colors inline-block"
          >
            Browse Parts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO title="Your Cart" url="/cart" noIndex={true} />

      {/* Header */}
      <div className="bg-[#0A1628] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            Your <span className="text-[#E8590A]">Cart</span>
          </h1>
          <p className="text-gray-400 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart items */}
          <div className="flex-1 min-w-0">

            {/* Freight only notice */}
            {hasFreightOnly && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-bold text-sm">Freight Shipping Required</p>
                    <p className="text-yellow-700 text-xs mt-0.5">Your cart contains only freight items. Shipping costs will be calculated at checkout and free shipping does not apply.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Free shipping progress */}
            {!hasFreightOnly && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                {hasAnyFreight && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-yellow-700 text-xs font-medium">
                      Freight items in your cart are excluded from free shipping
                    </p>
                  </div>
                )}
                {qualifies ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-600 font-bold text-sm">You qualify for free shipping in the US!</p>
                      <p className="text-gray-500 text-xs">Free standard shipping will be applied at checkout</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[#0A1628] text-sm font-medium">
                        Add <span className="text-[#E8590A] font-bold">{formatPrice(nonFreightRemaining)}</span> more for free US shipping
                      </p>
                      <span className="text-xs text-gray-400">{formatPrice(nonFreightSubtotal)} / {formatPrice(threshold)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#E8590A] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((nonFreightSubtotal / threshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Items list */}
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex gap-4">

                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-[#0A1628] font-bold text-sm leading-snug mb-1 truncate">
                            {item.name}
                          </h3>
                          {item.isFreight && (
                            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded mb-1">
                              Freight
                            </span>
                          )}
                          <p className="text-[#E8590A] font-black text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-gray-400 text-xs">{formatPrice(item.price)} each</p>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-500 font-medium">Qty:</span>
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1.5 text-[#0A1628] font-bold text-sm border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear cart */}
            <div className="mt-4 text-right">
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-32">

              {/* Header */}
              <div className="bg-[#0A1628] px-5 py-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Order Summary</h2>
              </div>

              <div className="p-5">

                {/* Line items */}
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <span className="text-gray-600 text-sm truncate flex-1">
                        {item.name} {item.quantity > 1 && `x${item.quantity}`}
                      </span>
                      <span className="text-[#0A1628] font-medium text-sm flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Subtotal</span>
                    <span className="text-[#0A1628] font-bold text-sm">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Shipping</span>
                    <span className={`text-sm font-medium ${qualifies ? 'text-green-600' : 'text-gray-500'}`}>
                      {qualifies ? 'FREE' : 'Calculated at checkout'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Tax</span>
                    <span className="text-gray-500 text-sm">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0A1628] font-black text-base">Total</span>
                    <span className="text-[#E8590A] font-black text-2xl">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Link
                  to="/checkout"
                  className="w-full bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black py-4 rounded-md transition-colors text-center block text-base mb-3"
                >
                  Proceed to Checkout →
                </Link>

                <Link
                  to="/shop"
                  className="w-full border border-gray-200 hover:border-[#E8590A] text-gray-600 hover:text-[#E8590A] font-medium py-3 rounded-md transition-colors text-center block text-sm"
                >
                  Continue Shopping
                </Link>

                {/* Payment icons */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center mb-3">Secure checkout powered by</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {['pay-visa.png', 'pay-mastercard.png', 'pay-paypal.png', 'pay-applepay.png', 'pay-googlepay.png'].map(logo => (
                      <div key={logo} className="bg-white border border-gray-100 rounded px-1.5 py-1 h-7 flex items-center justify-center">
                        <img src={`/${logo}`} alt="" className="h-4 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust signals */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-500">SSL encrypted secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">Quality guaranteed on all parts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="text-xs text-gray-500">Easy returns policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}