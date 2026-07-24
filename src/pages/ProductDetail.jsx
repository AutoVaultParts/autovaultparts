import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SEO from '../components/common/SEO'

const CONDITION_LABELS = {
  new_oem: { label: 'New OEM', color: 'bg-green-100 text-green-700 border-green-200' },
  new_aftermarket: { label: 'New Aftermarket', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  remanufactured: { label: 'Remanufactured', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  used: { label: 'Used / Pull', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
  'Netherlands', 'Italy', 'Spain', 'Portugal', 'Sweden', 'Norway', 'Denmark',
  'Finland', 'Ireland', 'Austria', 'Switzerland', 'Luxembourg', 'Poland',
  'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
  'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Greece', 'Malta', 'Cyprus',
  'Japan', 'South Korea', 'Singapore', 'United Arab Emirates', 'Saudi Arabia',
  'South Africa', 'Mexico', 'Brazil', 'India', 'New Zealand',
]

const StarDisplay = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

const StarSelector = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

function ProductReviews({ productId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [globallyEnabled, setGloballyEnabled] = useState(true)
  const [form, setForm] = useState({
    name: '',
    country: '',
    rating: 0,
    title: '',
    body: '',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchReviews()
    checkSettings()
  }, [productId])

  useEffect(() => {
    if (toast) {
      setToastVisible(true)
      const hide = setTimeout(() => setToastVisible(false), 4500)
      const remove = setTimeout(() => setToast(false), 5000)
      return () => { clearTimeout(hide); clearTimeout(remove) }
    }
  }, [toast])

  async function checkSettings() {
    const { data } = await supabase
      .from('review_settings')
      .select('reviews_globally_enabled')
      .eq('id', 1)
      .single()
    if (data) setGloballyEnabled(data.reviews_globally_enabled)
  }

  async function fetchReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('type', 'product')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setFormError('Please enter your name.')
    if (!form.country) return setFormError('Please select your country.')
    if (form.rating === 0) return setFormError('Please select a star rating.')
    if (!form.body.trim()) return setFormError('Please write your review.')
    if (form.body.trim().length < 20) return setFormError('Your review must be at least 20 characters.')

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          type: 'product',
          product_id: productId,
          reviewer_name: form.name.trim(),
          reviewer_country: form.country,
          rating: form.rating,
          title: form.title.trim() || null,
          body: form.body.trim(),
          status: 'pending',
          is_featured: false,
          is_verified_purchase: false,
          is_admin_created: false,
        })
      if (error) throw error
      setShowForm(false)
      setForm({ name: '', country: '', rating: 0, title: '', body: '' })
      setToast(true)
    } catch (err) {
      console.error('Review submit error:', err)
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!globallyEnabled || !user) return null

  const averageRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 relative">

      {/* Toast notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-white border border-green-200 rounded-xl shadow-lg px-5 py-4 flex items-center gap-3 max-w-sm">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[#0A1628] font-bold text-sm">Review Submitted!</p>
            <p className="text-gray-500 text-xs mt-0.5">Your review is pending approval by our team.</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#0A1628] px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-sm uppercase tracking-wider">Customer Reviews</h2>
          {averageRating && (
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay rating={Math.round(averageRating)} size="sm" />
              <span className="text-gray-400 text-xs">{averageRating} out of 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex-shrink-0"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="p-5">

        {/* Review form */}
        {showForm && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0A1628] font-black text-sm">Write Your Review</h3>
              <button onClick={() => { setShowForm(false); setFormError('') }} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Share your thoughts on this listing. Was the part description accurate? Was it easy to find what you needed? How was your overall shopping experience on AutoVaultParts?
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Your Rating *</label>
                <StarSelector rating={form.rating} setRating={r => handleChange('rating', r)} />
                {form.rating > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {form.rating === 1 ? 'Poor' : form.rating === 2 ? 'Fair' : form.rating === 3 ? 'Good' : form.rating === 4 ? 'Very Good' : 'Excellent'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Country *</label>
                  <select
                    value={form.country}
                    onChange={e => handleChange('country', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Your Review *</label>
                <textarea
                  value={form.body}
                  onChange={e => handleChange('body', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors resize-none bg-white"
                  placeholder="Share your thoughts on this listing. Was the part description accurate? Was it easy to find what you needed?"
                />
                <p className="text-xs text-gray-400 mt-1">{form.body.length} characters (minimum 20)</p>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError('') }}
                  className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 rounded-lg font-black text-sm transition-all ${submitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-4 border-gray-200" />
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className={`border rounded-xl p-4 ${review.is_featured ? 'border-[#E8590A] bg-orange-50/30' : 'border-gray-100'}`}>
                {review.is_featured && (
                  <span className="inline-block bg-[#E8590A] text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">Featured Review</span>
                )}
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{review.reviewer_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-[#0A1628] font-bold text-xs">{review.reviewer_name}</p>
                      <p className="text-gray-400 text-xs">{review.reviewer_country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarDisplay rating={review.rating} size="sm" />
                    <span className="text-gray-400 text-xs">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    {review.is_verified_purchase && (
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-600 text-xs font-medium">Verified Purchase</span>
                      </div>
                    )}
                  </div>
                </div>
                {review.title && <p className="text-[#0A1628] font-bold text-sm mb-1">{review.title}</p>}
                <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-1">No reviews yet for this product.</p>
            <p className="text-gray-400 text-xs">Be the first to share your thoughts.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [compatibility, setCompatibility] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_compatibility (
            cars (make, model, year_from, year_to)
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      setProduct(data)
      setCompatibility(data.product_compatibility || [])

      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .eq('is_active', true)
        .neq('slug', slug)
        .limit(3)

      setRelatedProducts(related || [])
    } catch (err) {
      console.error('Error fetching product:', err)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEO title="Part Not Found" noIndex={true} />
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-bold text-[#0A1628] mb-3">Part Not Found</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            This part is not listed online. We may still have it in our warehouse. Contact us and we will check for you.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="bg-[#E8590A] text-white font-bold py-3 rounded-md text-sm text-center">
              Contact Us About This Part
            </Link>
            <Link to="/shop" className="border border-gray-300 text-gray-600 font-medium py-3 rounded-md text-sm text-center">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const cond = CONDITION_LABELS[product.condition]
  const images = product.images?.length > 0 ? product.images : ['/category-body.jpg']

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      slug: product.slug,
      condition: product.condition,
      isFreight: product.is_freight,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title={product.name}
        description={`${product.name} - ${cond?.label} condition. ${product.description?.slice(0, 120) || 'Premium quality auto part available at AutoVaultParts.'} Ships globally to US, Canada, Europe and Australia.`}
        image={images[0]?.startsWith('http') ? images[0] : `https://www.autovaultparts.com${images[0]}`}
        url={`/product/${product.slug}`}
        type="product"
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-[#E8590A]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#E8590A]">Shop</Link>
            <span>/</span>
            <span className="text-[#0A1628] font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Image gallery */}
          <div>
            <div className="bg-[#0A1628] rounded-xl overflow-hidden h-72 sm:h-96 mb-3 relative">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_freight && (
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded">FREIGHT ITEM</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-[#E8590A]' : 'border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.category}</span>
              <span className="text-gray-300">|</span>
              <span className={`text-xs font-medium px-2 py-1 rounded border ${cond?.color}`}>{cond?.label}</span>
              {product.is_freight && (
                <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Freight</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1628] mb-2 leading-tight">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-4">SKU: {product.sku}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-black text-[#E8590A]">${product.price.toLocaleString()}</span>
              {product.compare_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.compare_price.toLocaleString()}</span>
                  <span className="bg-[#E8590A] text-white text-xs font-bold px-2 py-1 rounded">
                    SAVE ${(product.compare_price - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-600 text-sm font-medium">
                    In Stock {product.stock <= 3 && `· Only ${product.stock} left`}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-gray-600 hover:bg-gray-100 font-bold">-</button>
                  <span className="px-4 py-3 text-[#0A1628] font-bold text-sm border-x border-gray-200">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-3 text-gray-600 hover:bg-gray-100 font-bold">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-md font-bold text-sm transition-all ${added ? 'bg-green-500 text-white' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                {user && (
                  <button
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                    className={`p-3 rounded-md border transition-all ${isInWishlist(product.id) ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}
                    title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {product.is_freight && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-800 text-xs leading-relaxed">
                  This is a freight item. Shipping cost will be calculated at checkout. Free shipping thresholds do not apply to freight items.
                </p>
              </div>
            )}

            {/* Trust badges — replaced inline SVGs with PNGs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <img src="/secure_payment.png" alt="Secure Payment" className="h-5 w-5 object-contain flex-shrink-0" />
                <span className="text-xs text-gray-600 font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <img src="/quality_guaranteed.png" alt="Quality Checked" className="h-5 w-5 object-contain flex-shrink-0" />
                <span className="text-xs text-gray-600 font-medium">Quality Checked</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <img src="/carefully_packaged.png" alt="Carefully Packaged" className="h-5 w-5 object-contain flex-shrink-0" />
                <span className="text-xs text-gray-600 font-medium">Carefully Packaged</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <img src="/easy_return.png" alt="Easy Returns" className="h-5 w-5 object-contain flex-shrink-0" />
                <span className="text-xs text-gray-600 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        {compatibility.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="bg-[#0A1628] px-5 py-4">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Vehicle Compatibility</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {compatibility.map((comp, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-[#0A1628] text-sm font-medium">{comp.cars?.make} {comp.cars?.model}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{comp.cars?.year_from} - {comp.cars?.year_to || 'Present'}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Not sure if this fits your vehicle?{' '}
                <Link to="/contact" className="text-[#E8590A] font-medium hover:underline">Contact us to confirm</Link>
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#0A1628] px-5 py-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Product Description</h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Product Reviews - account holders only */}
        <ProductReviews productId={product.id} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-[#0A1628] mb-6">Related Parts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map(related => (
                <Link
                  key={related.id}
                  to={`/product/${related.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8590A] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="h-36 overflow-hidden bg-[#0A1628]">
                    <img
                      src={related.images?.[0] || '/category-body.jpg'}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#0A1628] font-bold text-sm mb-1 group-hover:text-[#E8590A] transition-colors leading-snug">{related.name}</h3>
                    <p className="text-[#E8590A] font-black text-lg">${related.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}