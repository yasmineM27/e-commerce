import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"
import { OrdersProvider } from "@/lib/orders-context";

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
          <OrdersProvider> 
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </OrdersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

