import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { compressImages } from '../../utils/imageCompression'

// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all max-w-sm
            ${t.type === 'success' ? 'bg-green-500 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#0A1628] text-white'}`}
        >
          {t.type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-75 hover:opacity-100 flex-shrink-0">×</button>
        </div>
      ))}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])
  return { toasts, addToast, removeToast }
}

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, pendingReviews: 0 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/')
      return
    }
    fetchData()
  }, [user, isAdmin])

  async function fetchData() {
    setLoading(true)
    try {
      const [productsRes, contactRes, pendingReviewsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_requests').select('id, status').eq('status', 'unread'),
        supabase.from('reviews').select('id').eq('status', 'pending'),
      ])

      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      setProducts(productsRes.data || [])
      setStats({
        products: productsRes.data?.length || 0,
        orders: orderCount || 0,
        messages: contactRes.data?.length || 0,
        pendingReviews: pendingReviewsRes.data?.length || 0,
      })
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !isAdmin) return null

  const navItems = [
    {
      id: 'dashboard', label: 'Dashboard', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'products', label: 'Products', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'orders', label: 'Orders', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'reviews', label: 'Reviews', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 'messages', label: 'Messages', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'shipping', label: 'Shipping Rates', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      id: 'customers', label: 'Customers', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex w-full overflow-x-hidden">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1628] transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[#1a2d4a]">
            <img src="/logo.png" alt="AutoVaultParts" className="h-12 w-auto object-contain" />
            <p className="text-gray-400 text-xs mt-2">Admin Panel</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMenuOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${activeSection === item.id ? 'bg-[#E8590A] text-white' : 'text-gray-400 hover:bg-[#1a2d4a] hover:text-white'}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
                {item.id === 'messages' && stats.messages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.messages}
                  </span>
                )}
                {item.id === 'reviews' && stats.pendingReviews > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingReviews}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-[#1a2d4a]">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Website
            </Link>
            <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-[#0A1628] font-black text-lg capitalize">{activeSection}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-500 text-xs hidden sm:block">{user.email}</span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* ─── DASHBOARD OVERVIEW ─────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: 'Total Products', value: stats.products, color: 'bg-blue-50 border-blue-200', icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )
                  },
                  {
                    label: 'Total Orders', value: stats.orders, color: 'bg-green-50 border-green-200', icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )
                  },
                  {
                    label: 'Pending Reviews', value: stats.pendingReviews, color: 'bg-yellow-50 border-yellow-200', icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )
                  },
                  {
                    label: 'Unread Messages', value: stats.messages, color: 'bg-orange-50 border-orange-200', icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                ].map(stat => (
                  <div key={stat.label} className={`bg-white rounded-xl border p-6 ${stat.color}`}>
                    <div className="mb-2">{stat.icon}</div>
                    <p className="text-3xl font-black text-[#0A1628]">{stat.value}</p>
                    <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-[#0A1628] font-black text-base mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: 'Add New Product', action: () => setActiveSection('products'), icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )
                    },
                    {
                      label: 'View Messages', action: () => setActiveSection('messages'), icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      label: 'Manage Orders', action: () => setActiveSection('orders'), icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )
                    },
                    {
                      label: 'Manage Reviews', action: () => setActiveSection('reviews'), icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E8590A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )
                    },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-[#E8590A]/5 border border-gray-200 hover:border-[#E8590A] rounded-lg transition-all text-left"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="text-[#0A1628] font-medium text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'products' && <ProductsSection products={products} onRefresh={fetchData} addToast={addToast} />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'reviews' && <ReviewsSection onRefresh={fetchData} />}
          {activeSection === 'messages' && <MessagesSection onRefresh={fetchData} />}
          {activeSection === 'shipping' && <ShippingSection />}
          {activeSection === 'customers' && <CustomersSection />}
        </div>
      </div>
    </div>
  )
}


// ─── PRODUCTS SECTION ────────────────────────────────────────────────────────

function ProductsSection({ products, onRefresh, addToast }) {
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [images, setImages] = useState([]) // [{url, file, preview}]
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', compare_price: '',
    condition: 'new_oem', category: 'body', brand: '', sku: '',
    weight_kg: '', is_freight: false, stock: '', is_active: true,
  })

  const resetForm = () => {
    setForm({
      name: '', slug: '', description: '', price: '', compare_price: '',
      condition: 'new_oem', category: 'body', brand: '', sku: '',
      weight_kg: '', is_freight: false, stock: '', is_active: true,
    })
    setImages([])
    setEditProduct(null)
    setShowForm(false)
    setUploadProgress('')
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      compare_price: product.compare_price || '',
      condition: product.condition,
      category: product.category,
      brand: product.brand || '',
      sku: product.sku || '',
      weight_kg: product.weight_kg || '',
      is_freight: product.is_freight,
      stock: product.stock,
      is_active: product.is_active,
    })
    // Load existing images as preview-only entries (no file, just url)
    const existingImages = (product.images || []).map(url => ({ url, file: null, preview: url }))
    setImages(existingImages)
    setEditProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      addToast(`Failed to delete: ${error.message}`, 'error')
    } else {
      addToast('Product deleted.', 'success')
      onRefresh()
    }
  }

  const handleToggleActive = async (product) => {
    const { error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    if (error) {
      addToast(`Failed to update status: ${error.message}`, 'error')
    } else {
      addToast(`Product ${!product.is_active ? 'activated' : 'hidden'}.`, 'success')
      onRefresh()
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // Handle file selection — max 4 total, compressed + resized before preview
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files)
    const remaining = 4 - images.length
    e.target.value = ''
    if (remaining <= 0) return
    const toAdd = files.slice(0, remaining)

    setUploadProgress(toAdd.length > 1 ? 'Compressing images...' : 'Compressing image...')
    const compressedFiles = await compressImages(toAdd)
    setUploadProgress('')

    const newImages = compressedFiles.map(file => ({
      file,
      url: null,
      preview: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev]
      if (updated[index].file) URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // Upload new files to Supabase Storage, return final URL array
  const uploadImages = async (productSlug) => {
    const finalUrls = []
    const newFiles = images.filter(x => x.file)
    let uploadCount = 0
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (!img.file) {
        finalUrls.push(img.url)
        continue
      }
      uploadCount++
      setUploadProgress(`Uploading image ${uploadCount} of ${newFiles.length}...`)
      const ext = img.file.name.split('.').pop().toLowerCase()
      const fileName = `${productSlug}-${Date.now()}-${i}.${ext}`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, img.file, { upsert: false, contentType: img.file.type })
      if (error) {
        console.error('Image upload error:', error)
        addToast(`Image upload failed: ${error.message}`, 'error')
        continue
      }
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)
      finalUrls.push(urlData.publicUrl)
    }
    setUploadProgress('')
    return finalUrls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const slug = form.slug || generateSlug(form.name)
      const imageUrls = await uploadImages(slug)
      const data = {
        name: form.name,
        slug,
        description: form.description,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        condition: form.condition,
        category: form.category,
        brand: form.brand,
        sku: form.sku,
        weight_kg: parseFloat(form.weight_kg) || 0,
        is_freight: form.is_freight,
        stock: parseInt(form.stock) || 0,
        is_active: form.is_active,
        images: imageUrls,
      }
      if (editProduct) {
        const { error } = await supabase.from('products').update(data).eq('id', editProduct.id)
        if (error) {
          addToast(`Failed to update product: ${error.message}`, 'error')
        } else {
          addToast('Product updated successfully!', 'success')
          resetForm()
          onRefresh()
        }
      } else {
        const { error } = await supabase.from('products').insert(data)
        if (error) {
          addToast(`Failed to add product: ${error.message}`, 'error')
        } else {
          addToast(`"${form.name}" added successfully!`, 'success')
          resetForm()
          onRefresh()
        }
      }
    } catch (err) {
      console.error('Save product error:', err)
      addToast(`Unexpected error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const CONDITION_COLORS = {
    new_oem: 'bg-green-100 text-green-700',
    new_aftermarket: 'bg-blue-100 text-blue-700',
    remanufactured: 'bg-purple-100 text-purple-700',
    used: 'bg-gray-100 text-gray-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#0A1628] font-black text-lg">{products.length} Products</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add / Edit product form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[#0A1628] font-black text-base">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Product Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="BMW M3 Front Bumper Assembly" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Brand</label>
                <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="BMW" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Price (USD) *</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="100" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="1250" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Compare Price (USD)</label>
                <input type="number" value={form.compare_price} onChange={e => setForm(p => ({ ...p, compare_price: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="1800" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Condition *</label>
                <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] bg-white">
                  <option value="new_oem">New OEM</option>
                  <option value="new_aftermarket">New Aftermarket</option>
                  <option value="remanufactured">Remanufactured</option>
                  <option value="used">Used / Pull</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] bg-white">
                  <option value="body">Body Parts</option>
                  <option value="engine">Engines</option>
                  <option value="internal">Internal Parts</option>
                  <option value="transmission">Transmission</option>
                  <option value="suspension">Suspension</option>
                  <option value="electrical">Electrical</option>
                  <option value="exhaust">Exhaust</option>
                  <option value="wheels">Wheels and Rims</option>
                  <option value="tyres">Tyres</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="AVP-BMW-M3-FB-001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Stock Quantity</label>
                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="5" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
                <input type="number" value={form.weight_kg} onChange={e => setForm(p => ({ ...p, weight_kg: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]" placeholder="12.5" />
              </div>
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_freight} onChange={e => setForm(p => ({ ...p, is_freight: e.target.checked }))} className="accent-[#E8590A] w-4 h-4" />
                  <span className="text-sm text-gray-600 font-medium">Freight Item</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="accent-[#E8590A] w-4 h-4" />
                  <span className="text-sm text-gray-600 font-medium">Active (visible)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] resize-none" placeholder="Describe the part condition, compatibility and what is included..." />
            </div>

            {/* ── IMAGE UPLOAD SECTION ── */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Product Images <span className="text-gray-400 normal-case font-normal">(up to 4 — first image is the main photo)</span>
              </label>

              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="flex gap-3 mb-3 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className={`w-24 h-24 rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-[#E8590A]' : 'border-gray-200'} bg-gray-50`}>
                        <img src={img.preview} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      {idx === 0 && (
                        <span className="absolute -top-1.5 left-1 text-[10px] bg-[#E8590A] text-white px-1.5 py-0.5 rounded font-bold">MAIN</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File picker — hidden when at 4 images */}
              {images.length < 4 && (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#E8590A] hover:bg-[#E8590A]/5 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#E8590A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm text-gray-500 group-hover:text-[#E8590A]">
                    {images.length === 0
                      ? 'Click to upload images (max 4)'
                      : `Add ${4 - images.length} more image${4 - images.length !== 1 ? 's' : ''}`}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}

              {/* Upload progress */}
              {uploadProgress && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#E8590A]">
                  <div className="w-4 h-4 rounded-full border-2 border-[#E8590A] border-t-transparent animate-spin flex-shrink-0" />
                  {uploadProgress}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. First image shown as main photo on product page.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-lg font-black text-sm transition-colors ${loading ? 'bg-gray-200 text-gray-400' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}>
                {loading ? (uploadProgress || 'Saving...') : editProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail preview in table */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                        }
                      </div>
                      <div>
                        <p className="text-[#0A1628] font-bold text-sm leading-snug">{product.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${CONDITION_COLORS[product.condition]}`}>
                          {product.condition.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-gray-500 text-sm capitalize">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#E8590A] font-black text-sm">${product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-sm font-medium ${product.stock <= 2 ? 'text-red-500' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(product)} className={`text-xs px-2 py-1 rounded font-medium transition-colors ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {product.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


// ─── REVIEWS SECTION ─────────────────────────────────────────────────────────

function ReviewsSection({ onRefresh }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [globallyEnabled, setGloballyEnabled] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const COUNTRIES = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Netherlands', 'Italy', 'Spain', 'Portugal', 'Sweden', 'Norway', 'Denmark',
    'Finland', 'Ireland', 'Austria', 'Switzerland', 'Luxembourg', 'Poland',
    'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
    'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Greece', 'Malta', 'Cyprus',
    'Japan', 'South Korea', 'Singapore', 'United Arab Emirates', 'Saudi Arabia',
    'South Africa', 'Mexico', 'Brazil', 'India', 'New Zealand',
  ]

  const emptyForm = {
    reviewer_name: '',
    reviewer_country: '',
    rating: 5,
    title: '',
    body: '',
    type: 'site',
    is_verified_purchase: false,
    is_featured: false,
    created_at: new Date().toISOString().slice(0, 16),
  }

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchReviews()
    fetchSettings()
  }, [filter])

  async function fetchSettings() {
    const { data } = await supabase
      .from('review_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (data) setGloballyEnabled(data.reviews_globally_enabled)
  }

  async function fetchReviews() {
    setLoading(true)
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (filter !== 'all') {
      query = query.eq('status', filter)
    }
    const { data } = await query
    setReviews(data || [])
    setLoading(false)
  }

  async function toggleGlobalReviews() {
    setSavingSettings(true)
    await supabase
      .from('review_settings')
      .update({ reviews_globally_enabled: !globallyEnabled, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setGloballyEnabled(!globallyEnabled)
    setSavingSettings(false)
  }

  async function approveReview(id) {
    await supabase.from('reviews').update({ status: 'approved' }).eq('id', id)
    fetchReviews()
    onRefresh()
  }

  async function rejectReview(id) {
    await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id)
    fetchReviews()
    onRefresh()
  }

  async function deleteReview(id) {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    await supabase.from('reviews').delete().eq('id', id)
    fetchReviews()
    onRefresh()
  }

  async function toggleFeatured(review) {
    await supabase.from('reviews').update({ is_featured: !review.is_featured }).eq('id', review.id)
    fetchReviews()
  }

  async function toggleVerified(review) {
    await supabase.from('reviews').update({ is_verified_purchase: !review.is_verified_purchase }).eq('id', review.id)
    fetchReviews()
  }

  async function handleSaveReview(e) {
    e.preventDefault()
    if (!form.reviewer_name.trim() || !form.reviewer_country || !form.body.trim()) return
    setFormLoading(true)

    if (editingReview) {
      await supabase.from('reviews').update({
        reviewer_name: form.reviewer_name.trim(),
        reviewer_country: form.reviewer_country,
        rating: form.rating,
        title: form.title.trim() || null,
        body: form.body.trim(),
        is_verified_purchase: form.is_verified_purchase,
        is_featured: form.is_featured,
        created_at: new Date(form.created_at).toISOString(),
      }).eq('id', editingReview.id)
    } else {
      await supabase.from('reviews').insert({
        type: form.type,
        reviewer_name: form.reviewer_name.trim(),
        reviewer_country: form.reviewer_country,
        rating: form.rating,
        title: form.title.trim() || null,
        body: form.body.trim(),
        status: 'approved',
        is_featured: form.is_featured,
        is_verified_purchase: form.is_verified_purchase,
        is_admin_created: true,
        created_at: new Date(form.created_at).toISOString(),
      })
    }

    setFormLoading(false)
    setShowCreateForm(false)
    setEditingReview(null)
    setForm(emptyForm)
    fetchReviews()
    onRefresh()
  }

  const StarDisplay = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[#0A1628] font-black text-lg">Reviews</h2>
          {pendingCount > 0 && filter !== 'pending' && (
            <p className="text-yellow-600 text-xs font-medium mt-0.5">{pendingCount} review{pendingCount !== 1 ? 's' : ''} pending approval</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-gray-600">Reviews {globallyEnabled ? 'ON' : 'OFF'}</span>
            <button
              onClick={toggleGlobalReviews}
              disabled={savingSettings}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${globallyEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${globallyEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
          <button
            onClick={() => { setShowCreateForm(true); setEditingReview(null); setForm(emptyForm) }}
            className="bg-[#E8590A] hover:bg-[#ff6b1a] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Review
          </button>
        </div>
      </div>

      {(showCreateForm || editingReview) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[#0A1628] font-black text-base">{editingReview ? 'Edit Review' : 'Create Review Manually'}</h3>
            <button
              onClick={() => { setShowCreateForm(false); setEditingReview(null); setForm(emptyForm) }}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >×</button>
          </div>
          <form onSubmit={handleSaveReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Reviewer Name *</label>
                <input
                  type="text"
                  value={form.reviewer_name}
                  onChange={e => setForm(p => ({ ...p, reviewer_name: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]"
                  placeholder="John D."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Country *</label>
                <select
                  value={form.reviewer_country}
                  onChange={e => setForm(p => ({ ...p, reviewer_country: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] bg-white"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Star Rating *</label>
                <select
                  value={form.rating}
                  onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] bg-white"
                >
                  <option value={5}>5 Stars — Excellent</option>
                  <option value={4}>4 Stars — Very Good</option>
                  <option value={3}>3 Stars — Good</option>
                  <option value={2}>2 Stars — Fair</option>
                  <option value={1}>1 Star — Poor</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Date and Time</label>
                <input
                  type="datetime-local"
                  value={form.created_at}
                  onChange={e => setForm(p => ({ ...p, created_at: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]"
                />
                <p className="text-xs text-gray-400 mt-1">Set any past date to make the review appear older. Defaults to right now.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Title (optional)</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A]"
                placeholder="e.g. Excellent website, easy to navigate"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Review Body *</label>
              <textarea
                value={form.body}
                onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                required
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8590A] resize-none"
                placeholder="Write the review text here..."
              />
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_verified_purchase}
                  onChange={e => setForm(p => ({ ...p, is_verified_purchase: e.target.checked }))}
                  className="accent-[#E8590A] w-4 h-4"
                />
                <span className="text-sm text-gray-600 font-medium">Verified Purchase Badge</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                  className="accent-[#E8590A] w-4 h-4"
                />
                <span className="text-sm text-gray-600 font-medium">Feature this Review</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className={`flex-1 py-3 rounded-lg font-black text-sm transition-colors ${formLoading ? 'bg-gray-200 text-gray-400' : 'bg-[#E8590A] hover:bg-[#ff6b1a] text-white'}`}
              >
                {formLoading ? 'Saving...' : editingReview ? 'Update Review' : 'Create Review'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setEditingReview(null); setForm(emptyForm) }}
                className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'all', label: 'All Reviews' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === tab.value ? 'bg-[#E8590A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8590A] hover:text-[#E8590A]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
            <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-gray-500 text-sm">No {filter === 'all' ? '' : filter} reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 ${review.status === 'pending' ? 'border-yellow-300' : review.status === 'approved' ? 'border-gray-200' : 'border-red-200 opacity-75'}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{review.reviewer_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-[#0A1628] font-bold text-sm">{review.reviewer_name}</p>
                      <p className="text-gray-400 text-xs">{review.reviewer_country}</p>
                    </div>
                    <StarDisplay rating={review.rating} />
                    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {review.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${review.type === 'site' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {review.type === 'site' ? 'Site Review' : 'Product Review'}
                    </span>
                    {review.is_admin_created && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">Admin Created</span>
                    )}
                    {review.is_featured && (
                      <span className="text-xs bg-[#E8590A]/10 text-[#E8590A] px-2 py-0.5 rounded font-medium">Featured</span>
                    )}
                    {review.is_verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Verified</span>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-[#0A1628] font-bold text-sm mb-1">{review.title}</p>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">{review.body}</p>
                  <p className="text-gray-400 text-xs">{new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                {review.status === 'pending' && (
                  <>
                    <button onClick={() => approveReview(review.id)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded font-bold transition-colors">Approve</button>
                    <button onClick={() => rejectReview(review.id)} className="text-xs bg-red-400 hover:bg-red-500 text-white px-3 py-1.5 rounded font-bold transition-colors">Reject</button>
                  </>
                )}
                {review.status === 'rejected' && (
                  <button onClick={() => approveReview(review.id)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded font-bold transition-colors">Approve</button>
                )}
                {review.status === 'approved' && (
                  <button onClick={() => rejectReview(review.id)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-1.5 rounded font-bold transition-colors">Unapprove</button>
                )}
                <button
                  onClick={() => toggleFeatured(review)}
                  className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${review.is_featured ? 'bg-[#E8590A] text-white hover:bg-[#ff6b1a]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {review.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => toggleVerified(review)}
                  className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${review.is_verified_purchase ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {review.is_verified_purchase ? 'Remove Verified' : 'Mark Verified'}
                </button>
                <button
                  onClick={() => {
                    setEditingReview(review)
                    setShowCreateForm(false)
                    setForm({
                      reviewer_name: review.reviewer_name,
                      reviewer_country: review.reviewer_country,
                      rating: review.rating,
                      title: review.title || '',
                      body: review.body,
                      type: review.type,
                      is_verified_purchase: review.is_verified_purchase,
                      is_featured: review.is_featured,
                      created_at: new Date(review.created_at).toISOString().slice(0, 16),
                    })
                  }}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded font-bold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// ─── ORDERS SECTION ──────────────────────────────────────────────────────────

function OrdersSection() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items(*)`)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => ({ ...prev, status }))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
      </div>
    </div>
  )

  const STATUS_COLORS = {
    confirmed: 'bg-green-100 text-green-700',
    pending_payment: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-100 text-red-700',
  }

  const STATUS_OPTIONS = ['confirmed', 'pending_payment', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#0A1628] font-black text-lg">{orders.length} Orders</h2>
        <button onClick={fetchOrders} className="text-sm text-[#E8590A] hover:underline font-medium">Refresh</button>
      </div>

      {orders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-sm">No orders yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => {
          const addr = order.shipping_address || {}
          return (
            <div key={order.id} className={`bg-white rounded-xl border overflow-hidden transition-all ${selectedOrder?.id === order.id ? 'border-[#E8590A]' : 'border-gray-200'}`}>
              <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[#0A1628] font-black text-sm">{order.order_number}</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status?.replace('_', ' ')}
                    </span>
                    {order.is_freight && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">Freight</span>
                    )}
                    {order.btc_discount_applied && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                        <img src="/btc-logo.png" alt="BTC" className="h-3 w-3 object-contain" />
                        BTC 10% off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#E8590A] font-black text-base">${order.total?.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${selectedOrder?.id === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 flex-wrap">
                  <span className="text-gray-600 text-xs font-medium">{addr.firstName} {addr.lastName}</span>
                  {addr.email && <span className="text-gray-400 text-xs">{addr.email}</span>}
                  {addr.phone && <span className="text-gray-400 text-xs">{addr.phone}</span>}
                  <span className="text-gray-400 text-xs capitalize">{order.payment_method?.replace('_', ' ')}</span>
                </div>
              </div>

              {selectedOrder?.id === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[#0A1628] font-bold text-sm mb-3">Customer Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0">Name</span>
                          <span className="text-[#0A1628] text-xs font-medium">{addr.firstName} {addr.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0">Email</span>
                          <span className="text-[#0A1628] text-xs font-medium break-all">{addr.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0">Phone</span>
                          <span className="text-[#0A1628] text-xs font-medium">{addr.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0">Address</span>
                          <span className="text-[#0A1628] text-xs font-medium leading-relaxed">
                            {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}, {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}, {addr.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-16 flex-shrink-0">Payment</span>
                          <span className="text-[#0A1628] text-xs font-medium capitalize">{order.payment_method?.replace('_', ' ')}</span>
                        </div>
                        {order.btc_discount_applied && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-16 flex-shrink-0">BTC Disc.</span>
                            <span className="text-green-600 text-xs font-bold">- ${order.discount_amount?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#0A1628] font-bold text-sm mb-3">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {item.image && (
                                <div className="w-8 h-8 rounded overflow-hidden bg-[#0A1628] flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <span className="text-[#0A1628] text-xs font-medium truncate">{item.name}</span>
                            </div>
                            <span className="text-gray-500 text-xs flex-shrink-0">x{item.quantity} · ${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-gray-500 text-xs">Total</span>
                        <span className="text-[#E8590A] font-black text-sm">${order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-[#0A1628] font-bold text-sm mb-3">Update Order Status</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order.id, status)}
                          className={`text-xs px-3 py-1.5 rounded font-medium transition-colors capitalize ${order.status === status ? 'bg-[#E8590A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8590A] hover:text-[#E8590A]'}`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TrackingEventEditor orderId={order.id} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ─── TRACKING EVENT EDITOR ───────────────────────────────────────────────────

function TrackingEventEditor({ orderId }) {
  const [showForm, setShowForm] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    status_label: '',
    location: '',
    description: '',
    event_time: new Date().toISOString().slice(0, 16),
    is_visible: true,
  })

  const QUICK_STATUSES = [
    { label: 'Order Confirmed', description: 'Your order has been received and is being processed' },
    { label: 'Processing', description: 'Your order is being prepared for quality inspection' },
    { label: 'Quality Check Complete', description: 'Your item has been inspected and meets our quality standards' },
    { label: 'Handed to Carrier', description: 'Your order has been collected by our shipping partner' },
    { label: 'In Transit', description: 'Your package is on its way to the destination country' },
    { label: 'Customs Clearance', description: 'Your package is currently being processed through customs' },
    { label: 'Out for Delivery', description: 'Your package is out for delivery and will arrive today' },
    { label: 'Delivery Attempted', description: 'A delivery attempt was made but no one was available' },
    { label: 'Delivered', description: 'Your package has been successfully delivered' },
    { label: 'On Hold', description: 'Your order is temporarily on hold. Our team will contact you shortly' },
  ]

  useEffect(() => {
    fetchEvents()
  }, [orderId])

  async function fetchEvents() {
    const { data } = await supabase
      .from('order_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('event_time', { ascending: false })
    setEvents(data || [])
  }

  async function addEvent(e) {
    e.preventDefault()
    if (!form.status_label) return
    setLoading(true)
    await supabase.from('order_tracking_events').insert({
      order_id: orderId,
      status_label: form.status_label,
      location: form.location,
      description: form.description,
      event_time: new Date(form.event_time).toISOString(),
      is_visible: form.is_visible,
    })
    setForm({
      status_label: '',
      location: '',
      description: '',
      event_time: new Date().toISOString().slice(0, 16),
      is_visible: true,
    })
    setLoading(false)
    setShowForm(false)
    fetchEvents()
  }

  async function deleteEvent(id) {
    await supabase.from('order_tracking_events').delete().eq('id', id)
    fetchEvents()
  }

  async function toggleVisibility(event) {
    await supabase.from('order_tracking_events').update({ is_visible: !event.is_visible }).eq('id', event.id)
    fetchEvents()
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[#0A1628] font-bold text-sm">Tracking Events</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-[#E8590A] text-white px-3 py-1.5 rounded font-medium hover:bg-[#ff6b1a] transition-colors"
        >
          + Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={addEvent} className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Status Label *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_STATUSES.map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status_label: s.label, description: s.description }))}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${form.status_label === s.label ? 'bg-[#E8590A] text-white border-[#E8590A]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#E8590A]'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.status_label}
              onChange={e => setForm(p => ({ ...p, status_label: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8590A]"
              placeholder="Or type custom status..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8590A]"
                placeholder="e.g. Frankfurt, Germany"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Event Time</label>
              <input
                type="datetime-local"
                value={form.event_time}
                onChange={e => setForm(p => ({ ...p, event_time: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8590A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8590A]"
              placeholder="e.g. Package in transit to destination country"
            />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={e => setForm(p => ({ ...p, is_visible: e.target.checked }))}
                className="accent-[#E8590A] w-4 h-4"
              />
              <span className="text-sm text-gray-600 font-medium">Visible to customer</span>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !form.status_label}
                className={`text-xs px-4 py-2 rounded font-bold transition-colors ${loading || !form.status_label ? 'bg-gray-200 text-gray-400' : 'bg-[#E8590A] text-white hover:bg-[#ff6b1a]'}`}
              >
                {loading ? 'Adding...' : 'Add Event'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs px-4 py-2 rounded border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {events.length > 0 && (
        <div className="space-y-2">
          {events.map(event => (
            <div key={event.id} className={`flex items-start justify-between gap-2 p-3 rounded-lg border ${event.is_visible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#0A1628] font-bold text-xs">{event.status_label}</span>
                  {!event.is_visible && (
                    <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Hidden</span>
                  )}
                </div>
                {event.location && <p className="text-gray-500 text-xs">{event.location}</p>}
                {event.description && <p className="text-gray-400 text-xs">{event.description}</p>}
                <p className="text-gray-400 text-xs mt-0.5">{new Date(event.event_time).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleVisibility(event)} className="text-xs text-blue-500 hover:underline">
                  {event.is_visible ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => deleteEvent(event.id)} className="text-xs text-red-400 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length === 0 && !showForm && (
        <p className="text-gray-400 text-xs">No tracking events added yet.</p>
      )}
    </div>
  )
}


// ─── MESSAGES SECTION ────────────────────────────────────────────────────────

function MessagesSection({ onRefresh }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function markAsRead(id) {
    await supabase.from('contact_requests').update({ status: 'read' }).eq('id', id)
    fetchMessages()
    onRefresh()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-[#0A1628] font-black text-lg">{messages.length} Messages</h2>
      {messages.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm">No messages yet.</p>
        </div>
      )}
      {messages.map(msg => (
        <div key={msg.id} className={`bg-white rounded-xl border p-5 ${msg.status === 'unread' ? 'border-[#E8590A]' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[#0A1628] font-bold text-sm">{msg.name}</span>
                <span className="text-gray-400 text-xs">{msg.email}</span>
                {msg.phone && <span className="text-gray-400 text-xs">{msg.phone}</span>}
                {msg.status === 'unread' && (
                  <span className="bg-[#E8590A] text-white text-xs px-2 py-0.5 rounded font-medium">New</span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{msg.message}</p>
              <p className="text-gray-400 text-xs mt-2">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
            {msg.status === 'unread' && (
              <button onClick={() => markAsRead(msg.id)} className="text-xs text-[#E8590A] hover:underline font-medium flex-shrink-0">
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}


// ─── SHIPPING SECTION ────────────────────────────────────────────────────────

function ShippingSection() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editRate, setEditRate] = useState('')

  useEffect(() => {
    fetchRates()
  }, [])

  async function fetchRates() {
    const { data } = await supabase
      .from('shipping_rates')
      .select('*')
      .order('region')
      .order('weight_min')
    setRates(data || [])
    setLoading(false)
  }

  async function saveRate(id) {
    await supabase.from('shipping_rates').update({ rate: parseFloat(editRate) }).eq('id', id)
    setEditing(null)
    fetchRates()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
      </div>
    </div>
  )

  const regions = ['US', 'CA', 'EU', 'AU']

  return (
    <div className="space-y-6">
      <h2 className="text-[#0A1628] font-black text-lg">Shipping Rates</h2>
      {regions.map(region => (
        <div key={region} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#0A1628] px-5 py-3">
            <h3 className="text-white font-bold text-sm">
              {region === 'US' ? 'United States' : region === 'CA' ? 'Canada' : region === 'EU' ? 'Europe' : 'Australia'}
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {rates.filter(r => r.region === region).map(rate => (
              <div key={rate.id} className="flex items-center justify-between px-5 py-3 flex-wrap gap-2">
                <div>
                  <span className="text-[#0A1628] text-sm font-medium">
                    {rate.weight_min}kg - {rate.weight_max >= 9999 ? '50kg+' : `${rate.weight_max}kg`}
                  </span>
                  {rate.is_freight && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Freight</span>
                  )}
                  <p className="text-gray-400 text-xs">{rate.delivery_days_min} - {rate.delivery_days_max} business days</p>
                </div>
                <div className="flex items-center gap-2">
                  {editing === rate.id ? (
                    <>
                      <input type="number" value={editRate} onChange={e => setEditRate(e.target.value)} className="w-24 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#E8590A]" />
                      <button onClick={() => saveRate(rate.id)} className="text-green-600 text-xs font-medium hover:underline">Save</button>
                      <button onClick={() => setEditing(null)} className="text-gray-400 text-xs hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="text-[#E8590A] font-black text-base">${rate.rate}</span>
                      <button onClick={() => { setEditing(rate.id); setEditRate(rate.rate) }} className="text-blue-500 text-xs font-medium hover:underline">Edit</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


// ─── CUSTOMERS SECTION ───────────────────────────────────────────────────────

function CustomersSection() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  async function toggleBanned(customer) {
    setUpdatingId(customer.id)
    await supabase
      .from('profiles')
      .update({ is_banned: !customer.is_banned })
      .eq('id', customer.id)
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, is_banned: !c.is_banned } : c))
    setUpdatingId(null)
  }

  async function toggleCanReview(customer) {
    setUpdatingId(customer.id)
    await supabase
      .from('profiles')
      .update({ can_review: !customer.can_review })
      .eq('id', customer.id)
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, can_review: !c.can_review } : c))
    setUpdatingId(null)
  }

  const filteredCustomers = customers.filter(c => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (c.full_name || '').toLowerCase().includes(term) || (c.phone || '').includes(term)
  })

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-transparent border-t-[#E8590A] animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-[#0A1628] font-black text-lg">{customers.length} Customers</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#E8590A] w-full sm:w-64"
        />
      </div>

      {customers.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-xl font-black text-[#0A1628] mb-2">No Customers Yet</h3>
          <p className="text-gray-500 text-sm">Customer accounts will appear here when users register.</p>
        </div>
      )}

      {customers.length > 0 && filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">No customers match "{search}".</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredCustomers.map(customer => {
          const addr = customer.default_address || {}
          const hasAddress = addr.address1 || addr.city || addr.country
          const cartCount = Array.isArray(customer.saved_cart) ? customer.saved_cart.length : 0

          return (
            <div
              key={customer.id}
              className={`bg-white rounded-xl border p-5 ${customer.is_banned ? 'border-red-200' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {(customer.full_name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#0A1628] font-bold text-sm">{customer.full_name || 'Unnamed Customer'}</p>
                      {customer.is_banned && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Banned</span>
                      )}
                      {customer.can_review === false && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">Reviews Disabled</span>
                      )}
                    </div>
                    {customer.phone && (
                      <p className="text-gray-500 text-xs mt-0.5">{customer.phone}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-0.5">
                      Joined {new Date(customer.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {cartCount > 0 && (
                  <span className="text-xs bg-[#E8590A]/10 text-[#E8590A] px-2 py-1 rounded font-medium flex-shrink-0">
                    {cartCount} item{cartCount !== 1 ? 's' : ''} in saved cart
                  </span>
                )}
              </div>

              {hasAddress && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Default Address</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''} {addr.zip || ''}{addr.country ? `, ${addr.country}` : ''}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => toggleBanned(customer)}
                  disabled={updatingId === customer.id}
                  className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${customer.is_banned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                >
                  {customer.is_banned ? 'Unban Customer' : 'Ban Customer'}
                </button>
                <button
                  onClick={() => toggleCanReview(customer)}
                  disabled={updatingId === customer.id}
                  className={`text-xs px-3 py-1.5 rounded font-bold transition-colors ${customer.can_review === false ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {customer.can_review === false ? 'Enable Reviews' : 'Disable Reviews'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}