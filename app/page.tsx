"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layouts/main-layout"
import { ProductCard } from "@/components/product-card"
import { FeedbackForm } from "@/components/feedback-form"
import { ArrowRight, ShoppingBag, Shield, Star, Truck, Loader2 } from "lucide-react"
import type { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([])
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all products
        const response = await fetch("https://dummyjson.com/products?limit=100")
        const data = await response.json()
        const products = data.products

        // Get featured products (newest products based on ID)
        const featured = [...products].sort((a, b) => b.id - a.id).slice(0, 8)

        // Get top rated products
        const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)

        // Get products with highest discount
        const discounted = [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 8)

        // Get unique categories
        const uniqueCategories = Array.from(new Set(products.map((product: Product) => product.category))) as string[]

        setFeaturedProducts(featured)
        setTopRatedProducts(topRated)
        setDiscountedProducts(discounted)
        setCategories(uniqueCategories)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/products")
    } else {
      router.push("/login")
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Loading amazing products...</p>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Products at Unbeatable Prices</h1>
            <p className="text-lg text-gray-600 mb-6">
              Shop our wide selection of high-quality products with exclusive discounts and deals.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="flex-1">
            <Carousel className="w-full">
              <CarouselContent>
                {discountedProducts.slice(0, 5).map((product) => (
                  <CarouselItem key={product.id}>
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <Badge className="self-start mb-2 bg-red-500">
                          {product.discountPercentage.toFixed(0)}% OFF
                        </Badge>
                        <h3 className="text-white text-xl font-bold mb-2">{product.title}</h3>
                        <p className="text-white/80 mb-4 line-clamp-2">{product.description}</p>
                        <Button
                          onClick={() => router.push(`/products?search=${encodeURIComponent(product.title)}`)}
                          size="sm"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <Button variant="outline" onClick={() => router.push("/products")}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium capitalize">{category.replace("-", " ")}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" onClick={() => router.push("/products")}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Top Rated Products Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Rated Products</h2>
            <Button variant="outline" onClick={() => router.push("/products?sort=rating")}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRatedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Best Deals Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Best Deals</h2>
            <Button variant="outline" onClick={() => router.push("/products?sort=discount")}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {discountedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Why Shop With Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Browse through thousands of products across multiple categories.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Star className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
              <p className="text-gray-600">Get exclusive discounts and the best prices on all products.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Shop with confidence with our secure payment system.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Truck className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping to your doorstep.</p>
            </div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">We Value Your Feedback</h2>
          <div className="max-w-2xl mx-auto">
            <FeedbackForm />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white p-8 rounded-lg text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Create an account or log in to start adding products to your cart and enjoy a seamless shopping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" onClick={() => router.push("/signup")}>
              Create Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

