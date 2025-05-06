"use client"

import Link from "next/link"
import { ShoppingBag, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchDialog } from "@/components/search-dialog"

export function Navbar({ transparent = false }) {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
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
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <span className={`text-xl font-bold ${transparent ? "text-white" : ""}`}>AnimeVerse</span>
        </Link>
        <nav className="hidden md:flex items-center justify-center flex-1 gap-6">
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
          <Link href="/blog" className={`font-medium ${transparent ? "text-white hover:text-white/80" : ""}`}>
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <SearchDialog>
            <Button
              variant="ghost"
              size="icon"
              className={`${transparent ? "text-white hover:text-white/80 hover:bg-transparent" : ""}`}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </Button>
          </SearchDialog>
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${transparent ? "text-white hover:text-white/80 hover:bg-transparent" : ""}`}
            asChild
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
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
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
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
