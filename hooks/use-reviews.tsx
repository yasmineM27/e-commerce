"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

// Define review types
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  isVerifiedPurchase: boolean
  userAvatar?: string
}

// Define reviews context type
interface ReviewsContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "date" | "helpful">) => void
  updateReview: (id: string, updates: Partial<Omit<Review, "id" | "userId" | "productId">>) => void
  deleteReview: (id: string) => void
  getProductReviews: (productId: string) => Review[]
  getUserReviews: (userId: string) => Review[]
  markHelpful: (id: string) => void
  hasUserReviewed: (productId: string, userId: string) => boolean
  getAverageRating: (productId: string) => number
  getRatingDistribution: (productId: string) => Record<number, number>
}

// Create reviews context
const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

// Sample initial reviews
const initialReviews: Review[] = [
  {
    id: "review-1",
    productId: "product-1",
    userId: "user-1",
    userName: "Naruto Fan",
    rating: 5,
    title: "Amazing detail!",
    comment:
      "The detail on this Naruto figure is incredible. The pose is dynamic and the paint job is flawless. Definitely worth the price!",
    date: "2025-04-15T10:30:00Z",
    helpful: 12,
    isVerifiedPurchase: true,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "review-2",
    productId: "product-1",
    userId: "user-2",
    userName: "Anime Collector",
    rating: 4,
    title: "Great figure with minor issues",
    comment:
      "The figure looks amazing and is well-made. The only issue I had was with the base, which feels a bit flimsy. Otherwise, it's a great addition to my collection.",
    date: "2025-04-10T14:20:00Z",
    helpful: 8,
    isVerifiedPurchase: true,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "review-3",
    productId: "product-1",
    userId: "user-3",
    userName: "SasukeUchiha",
    rating: 3,
    title: "Decent but overpriced",
    comment:
      "The figure is well-made but I think it's a bit overpriced for what you get. The packaging was nice though and it arrived in perfect condition.",
    date: "2025-04-05T09:15:00Z",
    helpful: 5,
    isVerifiedPurchase: false,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "review-4",
    productId: "product-2",
    userId: "user-4",
    userName: "OnePieceFan",
    rating: 5,
    title: "Best Luffy figure ever!",
    comment:
      "This Luffy statue is incredible! The Gear Fourth pose is dynamic and the details are spot on. It's a centerpiece in my collection now.",
    date: "2025-04-12T16:45:00Z",
    helpful: 15,
    isVerifiedPurchase: true,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "review-5",
    productId: "product-2",
    userId: "user-5",
    userName: "PirateKing",
    rating: 4,
    title: "Almost perfect",
    comment:
      "The figure is amazing but there were some minor paint issues on the base. Customer service was great though and offered a partial refund.",
    date: "2025-04-08T11:30:00Z",
    helpful: 7,
    isVerifiedPurchase: true,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "review-6",
    productId: "product-3",
    userId: "user-6",
    userName: "DBZCollector",
    rating: 5,
    title: "Perfect Goku figure!",
    comment:
      "This Goku figure is perfect in every way. The Super Saiyan form looks incredible and the quality is top-notch. Highly recommended!",
    date: "2025-04-14T13:20:00Z",
    helpful: 10,
    isVerifiedPurchase: true,
    userAvatar: "/placeholder.svg?height=50&width=50",
  },
]

// Reviews provider component
export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  // Load reviews from localStorage on mount
  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews")
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews))
      } catch (error) {
        console.error("Error parsing reviews from localStorage:", error)
        setReviews(initialReviews)
      }
    } else {
      setReviews(initialReviews)
    }
    setMounted(true)
  }, [])

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("reviews", JSON.stringify(reviews))
    }
  }, [reviews, mounted])

  // Add a new review
  const addReview = (review: Omit<Review, "id" | "date" | "helpful">) => {
    // Check if user has already reviewed this product
    if (user && hasUserReviewed(review.productId, review.userId)) {
      toast.error("You have already reviewed this product", {
        description: "You can edit your existing review instead.",
      })
      return false
    }

    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0,
    }

    setReviews((prev) => [...prev, newReview])
    toast.success("Review submitted", {
      description: "Thank you for your feedback!",
    })
    return true
  }

  // Update an existing review
  const updateReview = (id: string, updates: Partial<Omit<Review, "id" | "userId" | "productId">>) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === id) {
          return { ...review, ...updates }
        }
        return review
      }),
    )
    toast.success("Review updated", {
      description: "Your review has been updated successfully.",
    })
  }

  // Delete a review
  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== id))
    toast.success("Review deleted", {
      description: "Your review has been removed.",
    })
  }

  // Get reviews for a specific product
  const getProductReviews = (productId: string) => {
    return reviews.filter((review) => review.productId === productId)
  }

  // Get reviews by a specific user
  const getUserReviews = (userId: string) => {
    return reviews.filter((review) => review.userId === userId)
  }

  // Mark a review as helpful
  const markHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === id) {
          return { ...review, helpful: review.helpful + 1 }
        }
        return review
      }),
    )
  }

  // Check if a user has already reviewed a product
  const hasUserReviewed = (productId: string, userId: string) => {
    return reviews.some((review) => review.productId === productId && review.userId === userId)
  }

  // Calculate average rating for a product
  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0

    const sum = productReviews.reduce((total, review) => total + review.rating, 0)
    return Number.parseFloat((sum / productReviews.length).toFixed(1))
  }

  // Get rating distribution for a product (how many 5-star, 4-star, etc.)
  const getRatingDistribution = (productId: string) => {
    const productReviews = getProductReviews(productId)
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    productReviews.forEach((review) => {
      distribution[review.rating]++
    })

    return distribution
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        updateReview,
        deleteReview,
        getProductReviews,
        getUserReviews,
        markHelpful,
        hasUserReviewed,
        getAverageRating,
        getRatingDistribution,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

// Custom hook to use reviews context
export function useReviews() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}
