"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { MainLayout } from "@/components/layouts/main-layout"
import { ProductCard } from "@/components/product-card"
import { useWishlist } from "@/context/wishlist-context"
import { Heart } from "lucide-react"

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const { items } = useWishlist()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || loading) {
    return null
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Browse our products and add items to your wishlist to save them for later.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

