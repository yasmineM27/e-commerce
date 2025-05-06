"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { AuthProvider } from "@/hooks/use-auth"
import { ReviewsProvider } from "@/hooks/use-reviews"
import { OrdersProvider } from "@/hooks/use-orders"
import { Toaster } from "sonner"
import { ProductsProvider } from "@/hooks/use-products"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ProductsProvider>
          <OrdersProvider>
            <CartProvider>
              <WishlistProvider>
                <ReviewsProvider>
                  {children}
                  <Toaster position="top-right" />
                </ReviewsProvider>
              </WishlistProvider>
            </CartProvider>
          </OrdersProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
