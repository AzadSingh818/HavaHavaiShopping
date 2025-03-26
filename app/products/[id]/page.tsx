"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Loader2 } from "lucide-react"
import type { Product } from "@/types"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://dummyjson.com/products/${params.id}`)

        if (!response.ok) {
          throw new Error("Product not found")
        }

        const data = await response.json()
        setProduct(data)

        // Fetch related products from the same category
        const categoryResponse = await fetch(`https://dummyjson.com/products/category/${data.category}`)
        const categoryData = await categoryResponse.json()

        // Filter out the current product and limit to 4 products
        const filtered = categoryData.products.filter((p: Product) => p.id !== data.id).slice(0, 4)
        setRelatedProducts(filtered)
      } catch (err) {
        console.error(err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [isAuthenticated, params.id, router])

  const handleAddToCart = () => {
    if (!isAuthenticated || !product) return

    setIsAdding(true)

    // Add product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const toggleWishlist = () => {
    if (!isAuthenticated || !product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  // Generate star rating display
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400 half-star"
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error || "Product not found"}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/products")}>
              Browse Products
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100)
  const formattedPrice = discountedPrice.toFixed(2)

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {[product.thumbnail, ...product.images].map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
                      <Image
                        src={image || "/placeholder.svg?height=400&width=400"}
                        alt={`${product.title} - Image ${index}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="grid grid-cols-5 gap-2 mt-4">
              {[product.thumbnail, ...product.images].slice(0, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 w-full overflow-hidden rounded-md border cursor-pointer hover:border-primary"
                >
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.title} - Thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-gray-500 uppercase">{product.brand}</span>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                {renderRating(product.rating)}
                <span className="text-sm text-gray-500">
                  Category: <span className="capitalize">{product.category.replace("-", " ")}</span>
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">${formattedPrice}</span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <Badge className="bg-red-500">{product.discountPercentage.toFixed(0)}% OFF</Badge>
                    </>
                  )}
                </div>

                <p className="text-green-600 text-sm">
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                      ? `Only ${product.stock} left in stock - order soon`
                      : "Out of Stock"}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>

              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-8">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
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

                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className={isInWishlist(product.id) ? "bg-red-50" : ""}
                >
                  <Heart className="h-4 w-4 mr-2" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 bg-white rounded-lg border mt-2">
              <h3 className="text-lg font-semibold mb-2">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="p-4 bg-white rounded-lg border mt-2">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Brand</span>
                    <span>{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Category</span>
                    <span className="capitalize">{product.category.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Rating</span>
                    <span>{product.rating}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Stock</span>
                    <span>{product.stock}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Price</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Discount</span>
                    <span>{product.discountPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 bg-white rounded-lg border mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{product.rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">out of 5</div>
                </div>
                <div className="flex-1">
                  {renderRating(product.rating)}
                  <div className="text-sm text-gray-500 mt-1">Based on customer reviews</div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

