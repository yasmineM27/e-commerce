"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define product type
export interface Product {
  id: string
  name: string
  price: number
  image: string
  slug: string
  category: string
  series: string
  description?: string
  features?: string[]
  modelPath?: string
  additionalImages?: string[]
  modelFileName?: string
}

// Define products context type
interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "slug">) => void
  updateProduct: (id: string, updates: Partial<Omit<Product, "id" | "slug">>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

// Create products context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

// Initial products data
const initialProducts: Product[] = [
  {
    id: "product-1",
    name: "Naruto Uzumaki Figure",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    slug: "naruto-uzumaki-figure",
    category: "Action Figures",
    series: "Naruto",
    description:
      "High-quality action figure of Naruto Uzumaki from the popular anime series Naruto. This detailed figure captures Naruto in his iconic pose, ready for battle.",
    features: [
      "Premium quality PVC material",
      "Height: 25cm",
      "Highly detailed sculpting",
      "Includes interchangeable hands and accessories",
      "Official licensed product",
    ],
    modelPath: "/assets/3d/duck.glb", // Using a sample model for demonstration
    additionalImages: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
  },
]

// Products provider component
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Load initial products on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      setProducts(initialProducts)
      localStorage.setItem("products", JSON.stringify(initialProducts))
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  // Add a new product
  const addProduct = (product: Omit<Product, "id" | "slug">) => {
    const id = `product-${Date.now()}`
    const slug = product.name.toLowerCase().replace(/\s+/g, "-")
    const newProduct = { ...product, id, slug }
    setProducts((prev) => [...prev, newProduct])
  }

  // Update an existing product
  const updateProduct = (id: string, updates: Partial<Omit<Product, "id" | "slug">>) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          return { ...product, ...updates }
        }
        return product
      }),
    )
  }

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  // Get a product by ID
  const getProduct = (id: string) => {
    return products.find((product) => product.id === id)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

// Custom hook to use products context
export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
