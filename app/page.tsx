import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Spline from "@splinetool/react-spline/next"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar transparent={true} />

      <main className="flex-1 relative">
        {/* Spline scene zoomed to 125% */}
        <div className="h-screen w-full overflow-hidden">
          <div className="scale-125 h-full w-full">
            <Spline scene="https://prod.spline.design/6sW8Lpqh04bwua3H/scene.splinecode" />
          </div>
        </div>

        {/* Overlay with text and button positioned lower on the page */}
        <div className="absolute inset-x-0 bottom-20 z-10 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            Anime Collectibles
          </h1>
          <p className="mt-4 text-xl text-white max-w-md drop-shadow-md">
            Discover our exclusive collection of premium anime figures and merchandise
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
