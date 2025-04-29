"use client"

import Link from "next/link"
import { ShoppingBag, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar({ transparent = false }) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on auth pages
  if (pathname.startsWith("/auth/")) {
    return null
  }

  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin/")) {
    return null
  }

  return (
    <header
      className={`absolute top-0 z-50 w-full ${!transparent ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : ""}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className={`text-xl font-bold ${transparent ? "text-white" : ""}`}>AnimeVerse</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className={`font-medium ${transparent ? "text-white hover:text-white/80" : ""}`}>
            Home
          </Link>
          <Link href="/shop" className={`font-medium ${transparent ? "text-white hover:text-white/80" : ""}`}>
            Shop
          </Link>
          <Link href="/about" className={`font-medium ${transparent ? "text-white hover:text-white/80" : ""}`}>
            About
          </Link>
          <Link href="/contact" className={`font-medium ${transparent ? "text-white hover:text-white/80" : ""}`}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={transparent ? "text-white hover:text-white/80 hover:bg-transparent" : ""}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={transparent ? "text-white hover:text-white/80 hover:bg-transparent" : ""}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <Link href="/user/edit">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link href="/orders" className="font-medium">My Orders</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className={transparent ? "bg-white text-black hover:bg-white/90" : ""}
              variant={transparent ? "default" : "outline"}
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
