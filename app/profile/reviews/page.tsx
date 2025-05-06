"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useReviews } from "@/hooks/use-reviews"
import { useAuth } from "@/hooks/use-auth"
import { ReviewCard } from "@/components/review-card"
import { ChevronLeft, Loader2 } from "lucide-react"

export default function UserReviewsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getUserReviews } = useReviews()
  const [isLoading, setIsLoading] = useState(true)
  const [userReviews, setUserReviews] = useState<ReturnType<typeof getUserReviews>>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Simulate loading user reviews
    setTimeout(() => {
      setUserReviews(getUserReviews(user.id))
      setIsLoading(false)
    }, 1000)
  }, [user, router, getUserReviews])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your reviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">My Reviews</h1>
          </div>

          {userReviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">You haven't written any reviews yet</h2>
                <p className="text-muted-foreground mb-4">
                  Share your thoughts on products you've purchased to help other customers.
                </p>
                <Button asChild>
                  <a href="/shop">Browse Products</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
