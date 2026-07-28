import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/products'
import { useAuth } from './AuthContext'

type CartItem = Product & { qty: number }

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// La clé dépend de l'utilisateur : chaque compte a son panier, l'invité a le sien
function cartKey(userId: string | null) {
  return userId ? `cart_${userId}` : 'cart_guest'
}

function loadCart(key: string): CartItem[] {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [items, setItems] = useState<CartItem[]>(() => loadCart(cartKey(null)))

  // Quand l'utilisateur change (connexion / déconnexion / changement de compte),
  // on recharge le panier correspondant à cet utilisateur
  useEffect(() => {
    setItems(loadCart(cartKey(userId)))
  }, [userId])

  // Sauvegarde à chaque changement, sous la clé de l'utilisateur courant
  useEffect(() => {
    localStorage.setItem(cartKey(userId), JSON.stringify(items))
  }, [items, userId])

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const clear = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}