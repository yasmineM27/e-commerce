"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart()

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border p-4 rounded">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} × ${item.price}
                </p>
              </div>
              <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </div>
          ))}

          <div className="text-right mt-8">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button asChild>
                <a href="/checkout">Proceed to Checkout</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
