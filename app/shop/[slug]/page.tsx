"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ShoppingCart, Eye, CuboidIcon as Cube, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/use-products"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useOrders } from "@/hooks/use-orders"
import { ProductViewer3D } from "@/components/product-viewer-3d"
import { Navbar } from "@/components/navbar"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/hooks/use-reviews"
import { ProductReviews } from "@/components/product-reviews"
import { cn } from "@/lib/utils"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { products } = useProducts()
  const { addItem } = useCart()
  const { addSingleItemOrder } = useOrders()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getAverageRating, getProductReviews } = useReviews()
  const [quantity, setQuantity] = useState(1)
  const [isBuying, setIsBuying] = useState(false)

  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const slug = unwrappedParams.slug

  // Find the product by slug
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you are looking for does not exist.</p>
        <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
      </div>
    )
  }

  const averageRating = getAverageRating(product.id)
  const reviewCount = getProductReviews(product.id).length
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const handleBuyNow = () => {
    setIsBuying(true)

    // Create a direct order
    const order = addSingleItemOrder(product, quantity)

    // Redirect to orders page
    setTimeout(() => {
      router.push("/profile/orders")
    }, 1500)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4">
        <Button variant="ghost" className="mb-8 pl-0 flex items-center" onClick={() => router.push("/shop")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Tabs defaultValue="images">
              <TabsList className="mb-4">
                <TabsTrigger value="images" className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Images
                </TabsTrigger>
                {product.modelPath && (
                  <TabsTrigger value="3d" className="flex items-center">
                    <Cube className="mr-2 h-4 w-4" />
                    3D View
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="images" className="mt-0">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={product.image || "/placeholder.svg?height=600&width=600"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.additionalImages && product.additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.additionalImages.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              {product.modelPath && (
                <TabsContent value="3d" className="mt-0">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <ProductViewer3D modelPath={product.modelPath} />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{product.series}</div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  inWishlist && "text-red-500 hover:text-red-600 hover:bg-red-100",
                )}
                onClick={toggleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={averageRating} showText />
              <span className="text-sm text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="text-xl font-bold mb-4">${product.price.toFixed(2)}</div>

            <div className="text-sm text-muted-foreground mb-6">{product.category}</div>

            <p className="mb-6">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20">
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button size="lg" className="w-full" variant="secondary" onClick={handleBuyNow} disabled={isBuying}>
                {isBuying ? "Processing..." : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  )
}
