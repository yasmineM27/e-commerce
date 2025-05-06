"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, ArrowRight } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

interface SearchDialogProps {
  children: React.ReactNode
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { products } = useProducts()
  const router = useRouter()

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.series.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 5) // Limit to 5 results

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleProductClick = (slug: string) => {
    setOpen(false)
    router.push(`/shop/${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for products..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {searchQuery && (
          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.category} • {product.series}
                      </div>
                    </div>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    setOpen(false)
                    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
                  }}
                >
                  View all results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No products found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
          to open search
        </div>
      </DialogContent>
    </Dialog>
  )
}
