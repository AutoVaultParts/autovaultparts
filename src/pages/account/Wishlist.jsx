import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SEO from '../../components/common/SEO'

export default function Wishlist() {
  const { user } = useAuth()
  const { wishlistItems, removeFromWishlist, loading } = useWishlist()
  const { addItem } = useCart()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEO title="My Wishlist" noIndex={true} />
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-black text-[#0A1628] mb-3">Sign In to View Wishlist</h2>
          <p className="text-gray-500 text-sm mb-6">Create an account or sign in to save parts to your wishlist.</p>
          <Link to="/account" className="bg-[#E8590A] text-white font-bold px-8 py-3 rounded-md inline-block">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = (item) => {
    const product = item.products
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/category-body.jpg',
      slug: product.slug,
      condition: product.condition,
      isFreight: product.is_freight,
      quantity: 1,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <SEO title="My Wishlist" noIndex={true} />

      {/* Header */}
      <div className="bg-[#0A1628] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/account" className="text-gray-400 hover:text-white text-sm transition-colors">My Account</Link>
            <span className="text-gray-600">›</span>
            <span className="text-white text-sm">Wishlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            My <span className="text-[#E8590A]">Wishlist</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">{wishlistItems.length} saved part{wishlistItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
              <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
            </div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-[#0A1628] mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Browse our catalog and save parts you are interested in. They will appear here for easy access later.
            </p>
            <Link
              to="/shop"
              className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-8 py-3 rounded-md transition-colors inline-block"
            >
              Browse Parts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(item => {
              const product = item.products
              if (!product) return null
              const image = product.images?.[0] || '/category-body.jpg'
              const CONDITION_COLORS = {
                new_oem: 'bg-green-100 text-green-700',
                new_aftermarket: 'bg-blue-100 text-blue-700',
                remanufactured: 'bg-purple-100 text-purple-700',
                used: 'bg-gray-100 text-gray-600',
              }
              const CONDITION_LABELS = {
                new_oem: 'New OEM',
                new_aftermarket: 'New Aftermarket',
                remanufactured: 'Remanufactured',
                used: 'Used / Pull',
              }
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#E8590A] hover:shadow-md transition-all group">

                  {/* Image */}
                  <Link to={`/product/${product.slug}`} className="block">
                    <div className="h-48 bg-[#0A1628] overflow-hidden relative">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.is_freight && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                          Freight
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${CONDITION_COLORS[product.condition]}`}>
                        {CONDITION_LABELS[product.condition]}
                      </span>
                    </div>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-[#0A1628] font-bold text-sm leading-snug mb-2 hover:text-[#E8590A] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#E8590A] font-black text-xl mb-3">${product.price.toLocaleString()}</p>

                    {/* Stock indicator */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      {product.stock > 0 && (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="w-full border border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-500 font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}