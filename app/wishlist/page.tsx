"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from "lucide-react"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = (product: any) => {
    addItem(product)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearWishlist}>
                Clear Wishlist
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save items you're interested in for later.</p>
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <Link href={`/shop/${product.slug}`}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">{product.series}</div>
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-semibold hover:underline">{product.name}</h3>
                      </Link>
                      <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
                      <Button className="w-full mt-4" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link href="/shop">
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-muted py-12 mt-12">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">© 2025 AnimeVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
