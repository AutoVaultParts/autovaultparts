import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext({})

// ─── localStorage key ────────────────────────────────────────────────────────
const CART_STORAGE_KEY = 'avp_cart'

// ─── Load cart from localStorage (used as the reducer's initial state) ───────
// Wrapped in try/catch so corrupted or missing storage never breaks the app —
// it just falls back to an empty cart.
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return { items: [] }
    return { items: parsed.items }
  } catch {
    return { items: [] }
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  // Lazy initializer — runs once on mount, restores cart from localStorage
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage)

  // ─── Persist cart to localStorage on every change ───────────────────────
  // This is the fix: without this, items vanish on refresh because the cart
  // only ever lived in React state (memory).
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: state.items }))
    } catch {
      // localStorage unavailable (e.g. private browsing quota) — cart still
      // works for the current session, it just won't persist across reloads.
    }
  }, [state.items])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity, 0
  )

  return (
    <CartContext.Provider value={{
      items: state.items,
      subtotal,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
