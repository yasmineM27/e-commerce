"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { Product } from "@/hooks/use-products"
import type { CartItem } from "@/hooks/use-cart"

// Define order item type
export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

// Define order type
export interface Order {
  id: string
  items: OrderItem[]
  total: number
  tax: number
  shipping: number
  grandTotal: number
  date: string
  status: "processing" | "shipped" | "delivered"
  paymentMethod: string
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
}

// Define orders context type
interface OrdersContextType {
  orders: Order[]
  addOrder: (items: CartItem[], shippingInfo?: Order["shippingAddress"]) => Order
  addSingleItemOrder: (product: Product, quantity: number) => Order
  getOrders: () => Order[]
  getOrderById: (id: string) => Order | undefined
}

// Create orders context
const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

// Orders provider component
export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders))
      } catch (error) {
        console.error("Error parsing orders from localStorage:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders, mounted])

  // Add an order from cart items
  const addOrder = (items: CartItem[], shippingInfo?: Order["shippingAddress"]): Order => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = 0 // Free shipping
    const grandTotal = subtotal + tax + shipping

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: items.map((item) => ({
        id: `order-item-${Date.now()}-${item.id}`,
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      total: subtotal,
      tax,
      shipping,
      grandTotal,
      date: new Date().toISOString(),
      status: "processing",
      paymentMethod: "Credit Card",
      shippingAddress: shippingInfo,
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    toast.success("Order placed successfully!")
    return newOrder
  }

  // Add an order from a single product
  const addSingleItemOrder = (product: Product, quantity: number): Order => {
    const subtotal = product.price * quantity
    const tax = subtotal * 0.1 // 10% tax
    const shipping = 0 // Free shipping
    const grandTotal = subtotal + tax + shipping

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [
        {
          id: `order-item-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ],
      total: subtotal,
      tax,
      shipping,
      grandTotal,
      date: new Date().toISOString(),
      status: "processing",
      paymentMethod: "Credit Card",
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    toast.success("Order placed successfully!")
    return newOrder
  }

  // Get all orders
  const getOrders = (): Order[] => {
    return orders
  }

  // Get order by ID
  const getOrderById = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        addSingleItemOrder,
        getOrders,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

// Custom hook to use orders context
export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
