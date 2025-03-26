"use client"

import Link from "next/link"
import { ShoppingCart, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  toggleCart: () => void
}

export function Header({ toggleCart }: HeaderProps) {
  const { user, logout } = useAuth()
  const { items } = useCart()

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/products" className="text-xl font-bold">
          ShopCart
        </Link>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">Welcome, {user.name}</span>}

          <Button variant="outline" size="sm" onClick={toggleCart} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {totalItems}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

