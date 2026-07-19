import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

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
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 transition-colors ${star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [globallyEnabled, setGloballyEnabled] = useState(true)
  const [toast, setToast] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const [form, setForm] = useState({
    name: '',
    country: '',
    email: '',
    rating: 0,
    title: '',
    body: '',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchReviews()
    checkSettings()
  }, [])

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
          type: 'site',
          reviewer_name: form.name.trim(),
          reviewer_country: form.country,
          reviewer_email: form.email.trim() || null,
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
      setForm({ name: '', country: '', email: '', rating: 0, title: '', body: '' })
      setToast(true)
    } catch (err) {
      console.error('Review submit error:', err)
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!globallyEnabled) return null

  const averageRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null

  const featuredReviews = reviews.filter(r => r.is_featured)
  const regularReviews = reviews.filter(r => !r.is_featured)
  const displayReviews = [...featuredReviews, ...regularReviews].slice(0, 6)

  return (
    <section className="bg-gray-50 py-16 px-4 relative">

      {/* Toast notification */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
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

      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[#E8590A] text-sm font-bold uppercase tracking-wider mb-2">Customer Reviews</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] mb-4">
            What Our Customers Say
          </h2>
          {averageRating && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <StarDisplay rating={Math.round(averageRating)} size="lg" />
              <span className="text-2xl font-black text-[#0A1628]">{averageRating}</span>
              <span className="text-gray-500 text-sm">out of 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            Real experiences from real customers. We value every piece of feedback, as it helps us improve AutoVaultParts for everyone.
          </p>
        </div>

        {/* Reviews grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {displayReviews.map(review => (
              <div
                key={review.id}
                className={`bg-white rounded-xl border p-6 relative transition-shadow hover:shadow-md ${review.is_featured ? 'border-[#E8590A] shadow-sm' : 'border-gray-200'}`}
              >
                {review.is_featured && (
                  <div className="absolute -top-3 left-4">
                    <span className="bg-[#E8590A] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured Review
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <StarDisplay rating={review.rating} size="sm" />
                  <span className="text-gray-400 text-xs">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {review.title && (
                  <p className="text-[#0A1628] font-bold text-sm mb-2">{review.title}</p>
                )}

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {review.body.length > 180 ? `${review.body.slice(0, 180)}...` : review.body}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#0A1628] font-bold text-xs">{review.reviewer_name}</p>
                      <p className="text-gray-400 text-xs">{review.reviewer_country}</p>
                    </div>
                  </div>
                  {review.is_verified_purchase && (
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600 text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience.</p>
          </div>
        )}

        {/* Write a review CTA */}
        {!showForm && (
          <div className="text-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-[#0A1628] font-black text-xl mb-2">Share Your Experience</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
                How was your experience with AutoVaultParts? Tell us what you think about our website design, navigation, product listings, and overall feel. Your feedback helps us grow.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-black px-8 py-3 rounded-lg transition-colors"
              >
                Write a Review
              </button>
            </div>
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-[#0A1628] px-6 py-5">
                <h3 className="text-white font-black text-lg">Write Your Review</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

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
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Country *</label>
                    <select
                      value={form.country}
                      onChange={e => handleChange('country', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors bg-white"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email (optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Title (optional)</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="Summarize your experience in one line"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Your Review *</label>
                  <textarea
                    value={form.body}
                    onChange={e => handleChange('body', e.target.value)}
                    rows={5}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors resize-none"
                    placeholder="Tell us about your experience with AutoVaultParts. How was the website design, navigation, product listings, and overall feel?"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.body.length} characters (minimum 20)</p>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{formError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormError('') }}
                    className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-3 rounded-lg font-black text-sm transition-all ${submitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}