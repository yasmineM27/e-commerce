"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { cartItems } = useCart()

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <p className="mb-4">Total to pay: <strong>${total.toFixed(2)}</strong></p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Pay with Flouci</h2>
          <Button className="w-full" asChild>
            <a href="https://flouci.com/pay-link">Open Flouci App</a>
          </Button>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Pay with D17</h2>
          <Button className="w-full" asChild>
            <a href="https://d17.tn/payment">Go to D17</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
