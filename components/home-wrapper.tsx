"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"

interface HomeWrapperProps {
  children: ReactNode
}

export function HomeWrapper({ children }: HomeWrapperProps) {
  // Add overflow-hidden to body when component mounts
  // Remove it when component unmounts
  useEffect(() => {
    // Save the original overflow value
    const originalOverflow = document.body.style.overflow

    // Apply overflow hidden
    document.body.style.overflow = "hidden"

    // Clean up function to restore original overflow
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return <>{children}</>
}
