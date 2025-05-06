"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { Product } from "@/hooks/use-products"

// Define wishlist context type
interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  itemCount: number
}

// Create wishlist context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Wishlist provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  // Calculate item count
  const itemCount = items.length

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items, mounted])

  // Add an item to the wishlist
  const addItem = (product: Product) => {
    setItems((prevItems) => {
      // Check if the item is already in the wishlist
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        toast.info(`${product.name} is already in your wishlist`)
        return prevItems
      } else {
        toast.success(`Added ${product.name} to wishlist`)
        return [...prevItems, product]
      }
    })
  }

  // Remove an item from the wishlist
  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from wishlist`)
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  // Check if an item is in the wishlist
  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  // Clear the wishlist
  const clearWishlist = () => {
    setItems([])
    toast.success("Wishlist cleared")
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Custom hook to use wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
