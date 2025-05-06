"use client"

import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showText = false,
  className,
  interactive = false,
  onChange,
}: StarRatingProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  // Text size mappings
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  // Generate stars
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Interactive mode
    if (interactive && onChange) {
      for (let i = 1; i <= maxRating; i++) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="text-muted-foreground hover:text-yellow-400 transition-colors"
            aria-label={`Rate ${i} out of ${maxRating} stars`}
          >
            <Star
              className={cn(sizeClasses[size], i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent")}
            />
          </button>,
        )
      }
      return stars
    }

    // Display mode
    for (let i = 1; i <= maxRating; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(<Star key={i} className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(<StarHalf key={i} className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />)
      } else {
        // Empty star
        stars.push(<Star key={i} className={cn(sizeClasses[size], "text-muted-foreground")} />)
      }
    }

    return stars
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">{renderStars()}</div>
      {showText && <span className={cn("ml-1 font-medium", textSizeClasses[size])}>{rating.toFixed(1)}</span>}
    </div>
  )
}
