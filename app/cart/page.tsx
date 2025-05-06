"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const { addOrder } = useOrders()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)

    // Create a new order
    const order = addOrder(items)

    // Clear the cart
    clearCart()

    // Redirect to the order confirmation page
    setTimeout(() => {
      router.push(`/profile/orders`)
    }, 1500)
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                <Button variant="outline" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-t">
                    <div className="sm:w-24 h-24 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">Unit Price: ${item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(subtotal * 0.1).toFixed(2)}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>

              <p className="text-sm text-muted-foreground mt-4 text-center">Secure checkout powered by Stripe</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
