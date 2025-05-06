import { Progress } from "@/components/ui/progress"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/hooks/use-reviews"

interface ReviewSummaryProps {
  productId: string
}

export function ReviewSummary({ productId }: ReviewSummaryProps) {
  const { getProductReviews, getAverageRating, getRatingDistribution } = useReviews()

  const productReviews = getProductReviews(productId)
  const averageRating = getAverageRating(productId)
  const ratingDistribution = getRatingDistribution(productId)

  const totalReviews = productReviews.length

  if (totalReviews === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
        <StarRating rating={averageRating} size="lg" className="mb-2" />
        <div className="text-sm text-muted-foreground">Based on {totalReviews} reviews</div>
      </div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <span>{rating}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-400"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <Progress value={percentage} className="h-2 flex-1" />
              <div className="w-10 text-sm text-right">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
