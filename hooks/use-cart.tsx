"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { Product } from "@/hooks/use-products"

// Define cart item type
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

// Define cart context type
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

// Create cart context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Calculate item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  // Add an item to the cart
  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex > -1) {
        // If the item exists, update its quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        toast.success(`Updated quantity for ${product.name}`)
        return updatedItems
      } else {
        // If the item doesn't exist, add it to the cart
        const newItem: CartItem = {
          id: `cart-item-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        }
        toast.success(`Added ${product.name} to cart`)
        return [...prevItems, newItem]
      }
    })
  }

  // Remove an item from the cart
  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`)
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  // Update the quantity of an item in the cart
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  // Clear the cart
  const clearCart = () => {
    setItems([])
    toast.success("Cart cleared")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
