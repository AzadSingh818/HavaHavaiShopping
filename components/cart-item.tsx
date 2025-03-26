"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { CartItemType } from "@/types"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const discountedPrice = item.price * (1 - item.discountPercentage / 100)
  const formattedPrice = discountedPrice.toFixed(2)
  const totalPrice = (discountedPrice * item.quantity).toFixed(2)

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      removeFromCart(item.id)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  return (
    <div className="flex gap-4 py-2 border-b">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image src={item.thumbnail || "/placeholder.svg"} alt={item.title} fill className="object-cover rounded" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
        <div className="text-sm text-gray-500 mt-1">
          ${formattedPrice} x {item.quantity}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleDecrease}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleIncrease}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">${totalPrice}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={handleRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

