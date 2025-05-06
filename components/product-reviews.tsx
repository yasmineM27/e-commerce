"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { ReviewSummary } from "@/components/review-summary"
import { useReviews } from "@/hooks/use-reviews"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { getProductReviews } = useReviews()
  const [sortOption, setSortOption] = useState("newest")
  const [filterOption, setFilterOption] = useState("all")

  // Get reviews for this product
  let productReviews = getProductReviews(productId)

  // Apply filtering
  if (filterOption !== "all") {
    const ratingFilter = Number.parseInt(filterOption, 10)
    productReviews = productReviews.filter((review) => review.rating === ratingFilter)
  }

  // Apply sorting
  const sortedReviews = [...productReviews].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="write">Write a Review</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="pt-6">
          <ReviewSummary productId={productId} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-6">
            <h3 className="text-lg font-semibold">
              {productReviews.length} {productReviews.length === 1 ? "Review" : "Reviews"}
            </h3>

            <div className="flex flex-wrap gap-2">
              <Select value={filterOption} onValueChange={setFilterOption}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {sortedReviews.length > 0 ? (
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">No reviews match your current filters.</p>
              {filterOption !== "all" && (
                <Button variant="link" onClick={() => setFilterOption("all")} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="write" className="pt-6">
          <ReviewForm
            productId={productId}
            onSuccess={() => document.querySelector('[data-value="reviews"]')?.click()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
