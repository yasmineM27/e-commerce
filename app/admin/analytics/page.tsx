"use client"

import { useState, useEffect } from "react"
import { useReviews } from "@/hooks/use-reviews"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/star-rating"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, TrendingUp, TrendingDown, Star, BarChart3, MessageSquare, ThumbsUp } from "lucide-react"
import { ReviewsChart } from "@/components/analytics/reviews-chart"
import { RatingTrendsChart } from "@/components/analytics/rating-trends-chart"
import { ProductRatingTable } from "@/components/analytics/product-rating-table"
import { ReviewVolumeChart } from "@/components/analytics/review-volume-chart"
import { subDays, subMonths, isAfter, parseISO } from "date-fns"

export default function AnalyticsPage() {
  const { reviews } = useReviews()
  const { products } = useProducts()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [filteredReviews, setFilteredReviews] = useState(reviews)

  // Calculate date ranges
  const getDateRange = () => {
    const now = new Date()
    switch (timeRange) {
      case "7days":
        return subDays(now, 7)
      case "30days":
        return subDays(now, 30)
      case "90days":
        return subDays(now, 90)
      case "6months":
        return subMonths(now, 6)
      case "1year":
        return subMonths(now, 12)
      default:
        return subDays(now, 30)
    }
  }

  // Filter reviews based on selected time range
  useEffect(() => {
    const startDate = getDateRange()
    const filtered = reviews.filter((review) => isAfter(parseISO(review.date), startDate))
    setFilteredReviews(filtered)

    // Simulate loading for better UX
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [reviews, timeRange])

  // Calculate overall metrics
  const totalReviews = filteredReviews.length
  const averageRating =
    totalReviews > 0
      ? Number((filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
      : 0

  const totalHelpfulVotes = filteredReviews.reduce((sum, review) => sum + review.helpful, 0)

  // Calculate rating distribution
  const ratingDistribution = {
    1: filteredReviews.filter((r) => r.rating === 1).length,
    2: filteredReviews.filter((r) => r.rating === 2).length,
    3: filteredReviews.filter((r) => r.rating === 3).length,
    4: filteredReviews.filter((r) => r.rating === 4).length,
    5: filteredReviews.filter((r) => r.rating === 5).length,
  }

  // Calculate percentage of verified purchases
  const verifiedPurchases = filteredReviews.filter((r) => r.isVerifiedPurchase).length
  const verifiedPercentage = totalReviews > 0 ? Math.round((verifiedPurchases / totalReviews) * 100) : 0

  // Calculate review trend (comparing to previous period)
  const getPreviousPeriodReviews = () => {
    const currentStartDate = getDateRange()
    const previousStartDate = subDays(currentStartDate, currentStartDate.getTime() - new Date().getTime())

    return reviews.filter(
      (review) =>
        isAfter(parseISO(review.date), previousStartDate) && !isAfter(parseISO(review.date), currentStartDate),
    ).length
  }

  const previousPeriodReviews = getPreviousPeriodReviews()
  const reviewTrend =
    previousPeriodReviews > 0 ? Math.round(((totalReviews - previousPeriodReviews) / previousPeriodReviews) * 100) : 100

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Review Analytics</h1>
          <p className="text-muted-foreground">Insights and trends from customer reviews</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => window.print()} className="hidden md:flex">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              {reviewTrend > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{reviewTrend}% increase</span>
                </>
              ) : reviewTrend < 0 ? (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(reviewTrend)}% decrease</span>
                </>
              ) : (
                <span>No change</span>
              )}
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{averageRating}</div>
              <StarRating rating={averageRating} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on {totalReviews} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Purchases</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedPercentage}%</div>
            <div className="mt-2">
              <Progress value={verifiedPercentage} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{verifiedPurchases} verified reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpful Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHelpfulVotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalReviews > 0 ? (totalHelpfulVotes / totalReviews).toFixed(1) : 0} votes per review on average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ratings">Rating Trends</TabsTrigger>
          <TabsTrigger value="products">Product Ratings</TabsTrigger>
          <TabsTrigger value="volume">Review Volume</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Distribution of ratings across all reviews</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ReviewsChart ratingDistribution={ratingDistribution} totalReviews={totalReviews} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>Average rating over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <RatingTrendsChart reviews={filteredReviews} timeRange={timeRange} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Rated Products</CardTitle>
              <CardDescription>Products with the highest average ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductRatingTable products={products} reviews={filteredReviews} sortBy="highest" limit={5} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Trends Over Time</CardTitle>
              <CardDescription>How average ratings have changed over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <RatingTrendsChart reviews={filteredReviews} timeRange={timeRange} detailed />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Highest Rated Products</CardTitle>
                <CardDescription>Products with the best reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductRatingTable products={products} reviews={filteredReviews} sortBy="highest" limit={5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lowest Rated Products</CardTitle>
                <CardDescription>Products that may need improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductRatingTable products={products} reviews={filteredReviews} sortBy="lowest" limit={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Rating Analysis</CardTitle>
              <CardDescription>Detailed breakdown of ratings by product</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductRatingTable products={products} reviews={filteredReviews} sortBy="reviews" showDistribution />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Volume Over Time</CardTitle>
              <CardDescription>Number of reviews received over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ReviewVolumeChart reviews={filteredReviews} timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Reviewed Products</CardTitle>
              <CardDescription>Products with the highest number of reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductRatingTable products={products} reviews={filteredReviews} sortBy="reviews" limit={10} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
