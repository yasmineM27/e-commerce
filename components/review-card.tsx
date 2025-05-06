"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Flag, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/hooks/use-reviews"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Review } from "@/hooks/use-reviews"

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const { markHelpful, deleteReview } = useReviews()
  const { user } = useAuth()
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false)
  const [hasReported, setHasReported] = useState(false)

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      markHelpful(review.id)
      setHasMarkedHelpful(true)
    }
  }

  const handleReport = () => {
    setHasReported(true)
  }

  const isOwner = user && user.id === review.userId

  // Format date to relative time (e.g., "2 days ago")
  const formattedDate = formatDistanceToNow(new Date(review.date), { addSuffix: true })

  return (
    <div className={cn("border rounded-lg p-4", className)}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <img
              src={review.userAvatar || "/placeholder.svg?height=40&width=40"}
              alt={review.userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{review.userName}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <StarRating rating={review.rating} size="sm" />
              <span>•</span>
              <span>{formattedDate}</span>
              {review.isVerifiedPurchase && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs py-0 h-5">
                    Verified Purchase
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteReview(review.id)}>Delete review</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-semibold">{review.title}</h4>
        <p className="mt-2 text-sm">{review.comment}</p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={handleMarkHelpful}
          disabled={hasMarkedHelpful}
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          {hasMarkedHelpful ? "Marked as helpful" : "Helpful"}
          {(review.helpful > 0 || hasMarkedHelpful) && (
            <span className="ml-1">({review.helpful + (hasMarkedHelpful ? 1 : 0)})</span>
          )}
        </Button>

        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleReport} disabled={hasReported}>
          <Flag className="h-3.5 w-3.5 mr-1" />
          {hasReported ? "Reported" : "Report"}
        </Button>
      </div>
    </div>
  )
}
