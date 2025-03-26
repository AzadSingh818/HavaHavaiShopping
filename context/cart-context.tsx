"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import type { CartItemType } from "@/types"

interface CartContextType {
  items: CartItemType[]
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([])
  const { isAuthenticated, user } = useAuth()

  // Load cart from localStorage on initial render and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = `cart_${user.id}`
      const storedCart = localStorage.getItem(cartKey)
      if (storedCart) {
        setItems(JSON.parse(storedCart))
      } else {
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [isAuthenticated, user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = `cart_${user.id}`
      localStorage.setItem(cartKey, JSON.stringify(items))
    }
  }, [items, isAuthenticated, user])

  const addToCart = (product: any) => {
    if (!isAuthenticated) return

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Otherwise add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    if (!isAuthenticated) return

    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (!isAuthenticated) return

    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    if (!isAuthenticated) return

    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

