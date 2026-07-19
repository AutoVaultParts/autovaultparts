import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function MyAccount() {
  const { user, signIn, signUp, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  })

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    if (error) {
      setError(error.message)
    } else {
      if (form.email === import.meta.env.VITE_ADMIN_EMAIL ||
          form.email === import.meta.env.VITE_ADMIN_EMAIL_2) {
        navigate('/dashboard-x7k2p')
      } else {
        navigate('/account/orders')
      }
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.fullName) {
      setError('Please fill in all fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Account created successfully. Please check your email to verify your account.')
      setForm({ email: '', password: '', fullName: '', confirmPassword: '' })
    }
    setLoading(false)
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <div className="bg-[#0A1628] py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
              My <span className="text-[#E8590A]">Account</span>
            </h1>
            <p className="text-gray-400 text-sm">Welcome back, {user.user_metadata?.full_name || user.email}</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Order History',
                desc: 'View all your past orders and their status',
                path: '/account/orders',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                title: 'My Cars',
                desc: 'Manage your saved vehicles for quick filtering',
                path: '/account/cars',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2zM13 6h3l3 4v4h-6V6z" />
                  </svg>
                )
              },
              {
                title: 'Track Order',
                desc: 'Track the status of your current orders',
                path: '/track',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: 'My Wishlist',
                desc: 'View and manage your saved parts',
                path: '/account/wishlist',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                title: 'Contact Support',
                desc: 'Get help with your orders or parts',
                path: '/contact',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="bg-white rounded-xl border border-gray-200 hover:border-[#E8590A] p-6 transition-all hover:shadow-lg group"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-[#0A1628] font-bold text-base mb-1 group-hover:text-[#E8590A] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-red-500 text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (user && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-black text-[#0A1628] mb-3">Admin Account</h2>
          <p className="text-gray-500 text-sm mb-6">You are logged in as an administrator.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard-x7k2p"
              className="bg-[#E8590A] text-white font-bold py-3 rounded-md text-sm text-center"
            >
              Go to Admin Dashboard
            </Link>
            <button
              onClick={signOut}
              className="border border-gray-300 text-gray-600 font-medium py-3 rounded-md text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="AutoVaultParts" className="h-16 w-auto object-contain mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-black text-[#0A1628]">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'signin' ? 'Welcome back to AutoVaultParts' : 'Join AutoVaultParts today'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'signin' ? 'text-[#E8590A] border-b-2 border-[#E8590A]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'signup' ? 'text-[#E8590A] border-b-2 border-[#E8590A]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-black text-sm transition-all ${loading ? 'bg-gray-200 text-gray-400' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E8590A] focus:ring-1 focus:ring-[#E8590A] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-black text-sm transition-all ${loading ? 'bg-gray-200 text-gray-400' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
                ← Back to AutoVaultParts
              </Link>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-gray-500">Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  )
}