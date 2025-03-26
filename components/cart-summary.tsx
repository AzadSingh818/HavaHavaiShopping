"use client"

import { X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CartSummaryProps {
  onClose: () => void
}

export function CartSummary({ onClose }: CartSummaryProps) {
  const { items, clearCart } = useCart()

  const totalPrice = items.reduce((total, item) => {
    const discountedPrice = item.price * (1 - item.discountPercentage / 100)
    return total + discountedPrice * item.quantity
  }, 0)

  const formattedTotal = totalPrice.toFixed(2)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md flex flex-col h-full shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl">${formattedTotal}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button>Checkout</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

