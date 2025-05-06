"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useReviews } from "@/hooks/use-reviews"
import { StarRating } from "@/components/star-rating"
import { cn } from "@/lib/utils"
import type { Product } from "@/hooks/use-products"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getAverageRating, getProductReviews } = useReviews()

  const averageRating = getAverageRating(product.id)
  const reviewCount = getProductReviews(product.id).length
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 relative">
            <Link href={`/shop/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm",
                inWishlist && "text-red-500 hover:text-red-600 hover:bg-white/90",
              )}
              onClick={toggleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>
          <div className="p-4 sm:w-2/3 flex flex-col">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">{product.series}</div>
              <Link href={`/shop/${product.slug}`}>
                <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
              </Link>

              <div className="flex items-center gap-2 mt-1 mb-2">
                <StarRating rating={averageRating} size="sm" />
                {reviewCount > 0 && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
              </div>

              <div className="mt-2 text-sm text-muted-foreground">{product.category}</div>
              <p className="mt-4 text-lg font-bold">${product.price.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link href={`/shop/${product.slug}`}>View Details</Link>
              </Button>
              <Button variant="outline" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href={`/shop/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm",
            inWishlist && "text-red-500 hover:text-red-600 hover:bg-white/90",
          )}
          onClick={toggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{product.series}</div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold hover:underline">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={averageRating} size="sm" />
          {reviewCount > 0 && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
        </div>

        <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
