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
    description: "High-quality action figure of Naruto Uzumaki from the popular anime series Naruto. This detailed figure captures Naruto in his iconic pose, ready for battle.",
    features: [
      "Premium quality PVC material",
      "Height: 25cm",
      "Highly detailed sculpting",
      "Includes interchangeable hands and accessories",
      "Official licensed product",
    ],
    modelPath: "/assets/3d/duck.glb",
  },
  {
    id: "product-2",
    name: "One Piece Luffy Statue",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    slug: "one-piece-luffy-statue",
    category: "Action Figures",
    series: "One Piece",
    description: "Premium statue of Monkey D. Luffy from One Piece. This highly detailed collectible captures Luffy in his Gear Fourth pose.",
    features: [
      "Hand-painted details",
      "Height: 30cm",
      "Premium resin material",
      "Limited edition",
      "Includes certificate of authenticity",
    ],
    modelPath: "/assets/3d/duck.glb",
  },
  {
    id: "product-3",
    name: "Dragon Ball Goku Figure",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    slug: "dragon-ball-goku-figure",
    category: "Action Figures",
    series: "Dragon Ball",
    description: "Collectible figure of Goku from Dragon Ball Z. Features Goku in Super Saiyan form with detailed sculpting and vibrant colors.",
    features: [
      "Articulated joints",
      "Height: 20cm",
      "Includes multiple accessories",
      "Authentic design",
      "Display stand included",
    ],
    modelPath: "/assets/3d/duck.glb",
  },
]

// Products provider component
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Load initial products on mount with enhanced validation
  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    
    try {
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed)
          return
        }
      }
      // If no valid products in localStorage, load initial data
      setProducts(initialProducts)
      localStorage.setItem("products", JSON.stringify(initialProducts))
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts(initialProducts)
      localStorage.setItem("products", JSON.stringify(initialProducts))
    }
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
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
      })
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