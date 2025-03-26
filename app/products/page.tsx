"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ProductList } from "@/components/product-list"
import { Pagination } from "@/components/pagination"
import { MainLayout } from "@/components/layouts/main-layout"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, X, Loader2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(2000)

  const limit = 12 // Products per page

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Parse URL search params
    const query = searchParams.get("search")
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const sort = searchParams.get("sort")

    if (query) setSearchQuery(query)
    if (category) setSelectedCategories([category])
    if (brand) setSelectedBrands([brand])
    if (sort) setSortBy(sort)

    // Fetch all products and categories
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Fetch all products
        const response = await fetch("https://dummyjson.com/products?limit=100")
        const data = await response.json()

        setAllProducts(data.products)

        // Extract unique categories and brands
        const uniqueCategories = Array.from(
          new Set(data.products.map((product: Product) => product.category)),
        ) as string[]

        const uniqueBrands = Array.from(new Set(data.products.map((product: Product) => product.brand))) as string[]

        // Find max price
        const highestPrice = Math.max(...data.products.map((product: Product) => product.price))

        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
        setMaxPrice(Math.ceil(highestPrice / 100) * 100) // Round up to nearest hundred
        setPriceRange([0, Math.ceil(highestPrice / 100) * 100])
      } catch (err) {
        setError("Failed to fetch products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isAuthenticated, router, searchParams])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products/brands");
        const data = await response.json();
        setBrands(data || []);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setBrands([]); // Fallback to an empty array
      }
    };

    fetchBrands();
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (allProducts.length === 0) return

    let result = [...allProducts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query),
      )
    }

    // Apply price range filter
    result = result.filter((product) => {
      const price = product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand))
    }

    // Apply rating filter
    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      case "newest":
        // Since we don't have a date field, we'll use ID as a proxy for "newest"
        result.sort((a, b) => b.id - a.id)
        break
      // Default is "featured", no sorting needed
    }

    setFilteredProducts(result)
    setTotalPages(Math.ceil(result.length / limit))

    // Only reset to first page if we're not on the first page already
    if (currentPage !== 1 && result.length <= (currentPage - 1) * limit) {
      setCurrentPage(1)
    }
  }, [allProducts, searchQuery, priceRange, selectedCategories, selectedBrands, minRating, sortBy, currentPage, limit])

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * limit
    const endIndex = startIndex + limit
    return filteredProducts.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((b) => b !== brand)
      } else {
        return [...prev, brand]
      }
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setSelectedBrands([])
    setMinRating(0)
    setSortBy("featured")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Products</h1>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="discount">Biggest Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - always visible on desktop, toggleable on mobile */}
          <aside
            className={`
            md:block md:w-64 flex-shrink-0 bg-white p-4 rounded-lg border
            ${showFilters ? "block" : "hidden"}
          `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["price", "category", "brand", "rating"]}>
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider value={priceRange} min={0} max={maxPrice} step={10} onValueChange={setPriceRange} />
                    <div className="flex items-center justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="category">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="capitalize">
                          {category.replace("-", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brand">
                <AccordionTrigger>Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox />
                          <span>{brand}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No brands available.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rating">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
                        />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-1">& Up</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Filter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your filters or search query.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500 flex flex-wrap items-center gap-2">
                  <span>
                    Showing {Math.min((currentPage - 1) * limit + 1, filteredProducts.length)} -{" "}
                    {Math.min(currentPage * limit, filteredProducts.length)} of {filteredProducts.length} products
                  </span>

                  {/* Active filters */}
                  {(searchQuery ||
                    selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    minRating > 0 ||
                    priceRange[0] > 0 ||
                    priceRange[1] < maxPrice) && (
                    <div className="flex flex-wrap gap-2 ml-2">
                      {searchQuery && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          Search: {searchQuery}
                          <button onClick={() => setSearchQuery("")}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}

                      {selectedCategories.map((category) => (
                        <Badge key={category} variant="outline" className="flex items-center gap-1 capitalize">
                          {category.replace("-", " ")}
                          <button onClick={() => handleCategoryChange(category)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}

                      {selectedBrands.map((brand) => (
                        <Badge key={brand} variant="outline" className="flex items-center gap-1">
                          {brand}
                          <button onClick={() => handleBrandChange(brand)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}

                      {minRating > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          {minRating}+ Stars
                          <button onClick={() => setMinRating(0)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}

                      {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          ${priceRange[0]} - ${priceRange[1]}
                          <button onClick={() => setPriceRange([0, maxPrice])}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <ProductList products={getCurrentPageProducts()} />

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

