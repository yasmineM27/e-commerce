"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/hooks/use-reviews"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { addReview, hasUserReviewed } = useReviews()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      })
      return
    }

    if (hasUserReviewed(productId, user.id)) {
      toast({
        title: "Already reviewed",
        description: "You have already reviewed this product",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Validate form
    if (formData.title.trim() === "" || formData.comment.trim() === "") {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Add review
    const success = addReview({
      productId,
      userId: user.id,
      userName: user.username,
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      isVerifiedPurchase: Math.random() > 0.5, // Randomly assign for demo purposes
      userAvatar: "/placeholder.svg?height=50&width=50", // Placeholder avatar
    })

    if (success) {
      // Reset form
      setFormData({
        rating: 5,
        title: "",
        comment: "",
      })

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    }

    setIsSubmitting(false)
  }

  if (!user) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Sign in to leave a review</h3>
        <p className="text-muted-foreground mb-4">Share your thoughts with other customers</p>
        <Button asChild>
          <a href="/auth/signin">Sign In</a>
        </Button>
      </div>
    )
  }

  if (user && hasUserReviewed(productId, user.id)) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Thank you for your review!</h3>
        <p className="text-muted-foreground">You have already reviewed this product.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Overall Rating</Label>
          <StarRating rating={formData.rating} size="lg" interactive onChange={handleRatingChange} className="mb-2" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Review Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Summarize your experience"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Review</Label>
          <Textarea
            id="comment"
            name="comment"
            placeholder="What did you like or dislike about this product?"
            rows={4}
            value={formData.comment}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </div>
  )
}
