"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const discountedPrice = product.price * (1 - product.discountPercentage / 100)
  const formattedPrice = discountedPrice.toFixed(2)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsAdding(true)
    addToCart(product)

    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  // Generate star rating display
  const renderRating = () => {
    const fullStars = Math.floor(product.rating)
    const hasHalfStar = product.rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400 half-star"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
      </div>
    )
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden h-full flex flex-col group cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.thumbnail || "/placeholder.svg?height=192&width=384"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">{product.discountPercentage.toFixed(0)}% OFF</Badge>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <button
              onClick={toggleWishlist}
              className={`p-1.5 rounded-full transition-colors ${
                isInWishlist(product.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Heart className="h-4 w-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/products/${product.id}`)
              }}
              className="p-1.5 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-500 text-white text-xs py-1 px-2 rounded text-center">
              Only {product.stock} left in stock!
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <CardContent className="pt-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium uppercase">{product.brand}</span>
            {renderRating()}
          </div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-lg">${formattedPrice}</span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
              )}
            </div>
            <span className="text-xs text-gray-500 capitalize">{product.category.replace("-", " ")}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={isAdding || product.stock === 0}
            variant={product.stock === 0 ? "outline" : "default"}
          >
            {!isAuthenticated ? (
              "Login to Add"
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : isAdding ? (
              "Added!"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

