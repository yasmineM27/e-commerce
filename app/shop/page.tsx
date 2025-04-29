"use client"

import { useState } from "react"
import { Filter, Grid3X3, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { useProducts } from "@/hooks/use-products"
export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOrder, setSortOrder] = useState("featured")
  const { products } = useProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground">Browse our collection of premium anime products</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="md:w-1/4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  All Products
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Action Figures
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Manga
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Accessories
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Clothing
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  All Prices
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Under $25
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  $25 - $50
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  $50 - $100
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Over $100
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Series</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  All Series
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Naruto
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  One Piece
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Dragon Ball
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  My Hero Academia
                </Button>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                      <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-none rounded-l-md"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-none rounded-r-md"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}

            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
