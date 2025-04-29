import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"
import { OrdersProvider } from "@/lib/orders-context"
import { CartProvider } from "@/context/cart-context"
import { ProductsProvider } from "@/hooks/use-products"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AnimeVerse - Premium Anime Collectibles",
  description: "Discover our exclusive collection of premium anime figures and merchandise",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="anime-store-theme"
        >
          <AuthProvider>
            <CartProvider>
              <ProductsProvider>
                <OrdersProvider>
                  <Providers>
                    {children}
                    <Toaster />
                  </Providers>
                </OrdersProvider>
              </ProductsProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}