"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, ShoppingCart, User, LogOut, Heart, Bell, Search } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  toggleSidebar: () => void
  toggleCart: () => void
}

export function Navbar({ toggleSidebar, toggleCart }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
    }
  }

  // Categories for dropdown
  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "mens-shirts",
    "mens-shoes",
    "womens-watches",
    "mens-watches",
    "womens-bags",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ]

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="text-xl font-bold">
              ShopCart
            </Link>

            <nav className="hidden md:flex items-center space-x-6 ml-10">
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-700 hover:text-primary">Categories</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-auto">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => router.push(`/products?category=${category}`)}
                      className="capitalize"
                    >
                      {category.replace("-", " ")}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/products" className="text-gray-700 hover:text-primary">
                All Products
              </Link>

              <Link href="/products?sort=discount" className="text-gray-700 hover:text-primary">
                Deals
              </Link>

              {isAuthenticated && (
                <Link href="/wishlist" className="text-gray-700 hover:text-primary">
                  Wishlist
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {showSearch ? (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowSearch(false)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={() => router.push("/wishlist")} className="relative">
                <Heart className="h-5 w-5" />
              </Button>
            )}

            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">2</Badge>
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={toggleCart} className="relative" disabled={!isAuthenticated}>
              <ShoppingCart className="h-5 w-5" />
              {isAuthenticated && totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/wishlist")}>Wishlist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => router.push("/signup")}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

