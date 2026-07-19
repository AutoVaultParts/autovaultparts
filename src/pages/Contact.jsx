import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SEO from '../components/common/SEO'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.')
      return
    }
    setLoading(true)
    try {
      const { error: dbError } = await supabase
        .from('contact_requests')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          status: 'unread',
        })
      if (dbError) throw dbError
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title="Contact Us"
        description="Contact AutoVaultParts for help finding car parts, shipping quotes, bulk orders or any questions about our products. We respond to every message within 24 hours."
        url="/contact"
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Contact <span className="text-[#E8590A]">Us</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Can not find the part you need? Our team will source it for you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-4">

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-[#0A1628] font-black text-sm mb-4 uppercase tracking-wide">Get In Touch</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: 'Email',
                    value: 'support@autovaultparts.com',
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: 'Response Time',
                    value: 'Within 24 hours',
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: 'Shipping',
                    value: 'Worldwide delivery',
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">{item.label}</p>
                      <p className="text-[#0A1628] text-sm font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-[#0A1628] font-black text-sm mb-3 uppercase tracking-wide">Common Reasons to Contact Us</h3>
              <ul className="space-y-2">
                {[
                  'Part not listed on website',
                  'Compatibility questions',
                  'Bulk order inquiries',
                  'Shipping quotes',
                  'Order status questions',
                  'Returns and warranties',
                ].map(reason => (
                  <li key={reason} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#E8590A]/5 border border-[#E8590A]/20 rounded-xl p-5">
              <p className="text-[#0A1628] font-bold text-sm mb-1">Track an Existing Order?</p>
              <p className="text-gray-500 text-xs mb-3">Use our order tracking page for real time updates.</p>
              <Link
                to="/track"
                className="bg-[#E8590A] text-white font-bold text-xs px-4 py-2 rounded-md inline-block hover:bg-[#ff6b1a] transition-colors"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#0A1628] px-6 py-4">
                <h2 className="text-white font-black text-base">Send Us a Message</h2>
                <p className="text-gray-400 text-xs mt-1">We respond to every message within 24 hours</p>
              </div>

              <div className="p-6">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-[#0A1628] font-black text-lg mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-6 py-3 rounded-md text-sm transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number (optional)</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={e => handleChange('message', e.target.value)}
                        rows={5}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors resize-none"
                        placeholder="Tell us what part you need, your car make, model and year, and any other details..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-lg font-black text-base transition-all ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>

                    <p className="text-gray-400 text-xs text-center">
                      Your information is kept private and never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}