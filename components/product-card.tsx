"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/hooks/use-products"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3">
            <Link href={`/shop/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            </Link>
          </div>
          <div className="p-4 sm:w-2/3 flex flex-col">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">{product.series}</div>
              <Link href={`/shop/${product.slug}`}>
                <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
              </Link>
              <div className="mt-2 text-sm text-muted-foreground">{product.category}</div>
              <p className="mt-4 text-lg font-bold">${product.price.toFixed(2)}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link href={`/shop/${product.slug}`}>View Details</Link>
              </Button>
              <Button variant="outline">
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
      <Link href={`/shop/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{product.series}</div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold hover:underline">{product.name}</h3>
        </Link>
        <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
