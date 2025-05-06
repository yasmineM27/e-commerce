"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  BarChart2,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Separator } from "@/components/ui/separator"
import { ProductsProvider } from "@/hooks/use-products"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Protect admin routes
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    } else if (user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  // If not admin or not authenticated, don't render anything
  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <ProductsProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/40">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <span className="text-lg font-bold">Admin Dashboard</span>
            </Link>
          </div>
          <div className="px-3 py-4">
            <nav className="space-y-1">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/reviews">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reviews
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </nav>
            <Separator className="my-4" />
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              View Store
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </ProductsProvider>
  )
}
