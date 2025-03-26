"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import type { Product } from "@/types"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const { isAuthenticated, user } = useAuth()

  // Load wishlist from localStorage on initial render and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const wishlistKey = `wishlist_${user.id}`
      const storedWishlist = localStorage.getItem(wishlistKey)
      if (storedWishlist) {
        setItems(JSON.parse(storedWishlist))
      } else {
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [isAuthenticated, user])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const wishlistKey = `wishlist_${user.id}`
      localStorage.setItem(wishlistKey, JSON.stringify(items))
    }
  }, [items, isAuthenticated, user])

  const addToWishlist = (product: Product) => {
    if (!isAuthenticated) return

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems
      } else {
        return [...prevItems, product]
      }
    })
  }

  const removeFromWishlist = (productId: number) => {
    if (!isAuthenticated) return

    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: number) => {
    return items.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    if (!isAuthenticated) return

    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

