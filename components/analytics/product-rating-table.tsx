"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StarRating } from "@/components/star-rating"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useReviews } from "@/hooks/use-reviews"
import type { Product } from "@/hooks/use-products"
import type { Review } from "@/hooks/use-reviews"

interface ProductRatingTableProps {
  products: Product[]
  reviews: Review[]
  sortBy: "highest" | "lowest" | "reviews"
  limit?: number
  showDistribution?: boolean
}

export function ProductRatingTable({
  products,
  reviews,
  sortBy = "highest",
  limit,
  showDistribution = false,
}: ProductRatingTableProps) {
  const { getProductReviews } = useReviews()
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate product ratings
  const productRatings = products.map((product) => {
    const productReviews = reviews.filter((review) => review.productId === product.id)
    const reviewCount = productReviews.length

    let averageRating = 0
    if (reviewCount > 0) {
      averageRating = Number((productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1))
    }

    // Calculate rating distribution
    const distribution = {
      1: productReviews.filter((r) => r.rating === 1).length,
      2: productReviews.filter((r) => r.rating === 2).length,
      3: productReviews.filter((r) => r.rating === 3).length,
      4: productReviews.filter((r) => r.rating === 4).length,
      5: productReviews.filter((r) => r.rating === 5).length,
    }

    return {
      product,
      averageRating,
      reviewCount,
      distribution,
    }
  })

  // Filter products with reviews
  const productsWithReviews = productRatings.filter((item) => item.reviewCount > 0)

  // Filter by search query
  const filteredProducts = productsWithReviews.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.series.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.averageRating - a.averageRating
      case "lowest":
        return a.averageRating - b.averageRating
      case "reviews":
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  // Apply limit if specified
  const displayProducts = limit ? sortedProducts.slice(0, limit) : sortedProducts

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No product ratings available for the selected period</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Average Rating</TableHead>
              <TableHead>Reviews</TableHead>
              {showDistribution && <TableHead>Rating Distribution</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayProducts.map(({ product, averageRating, reviewCount, distribution }) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{averageRating}</span>
                    <StarRating rating={averageRating} size="sm" />
                  </div>
                </TableCell>
                <TableCell>{reviewCount}</TableCell>
                {showDistribution && (
                  <TableCell>
                    <div className="space-y-1 w-48">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 text-xs">
                          <div className="w-8 text-right">{rating} ★</div>
                          <Progress
                            value={reviewCount > 0 ? (distribution[rating] / reviewCount) * 100 : 0}
                            className="h-1.5"
                          />
                          <div className="w-8">{distribution[rating]}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
