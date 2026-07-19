import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const WishlistContext = createContext({})

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlistItems([])
    }
  }, [user])

  async function fetchWishlist() {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('wishlists')
        .select(`*, products(*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setWishlistItems(data || [])
    } catch (err) {
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addToWishlist(productId) {
    if (!user) return false
    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId })
      if (error) throw error
      await fetchWishlist()
      return true
    } catch (err) {
      console.error('Error adding to wishlist:', err)
      return false
    }
  }

  async function removeFromWishlist(productId) {
    if (!user) return false
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) throw error
      await fetchWishlist()
      return true
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      return false
    }
  }

  function isInWishlist(productId) {
    return wishlistItems.some(item => item.product_id === productId)
  }

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}