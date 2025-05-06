import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About AnimeVerse</h1>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              AnimeVerse is your premier destination for high-quality anime collectibles, merchandise, and exclusive
              items from your favorite series.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p>
                  Founded in 2023 by a group of passionate anime enthusiasts, AnimeVerse was born from a desire to
                  create a curated shopping experience for collectors and fans alike. What started as a small online
                  store has grown into a thriving community of anime lovers from around the world.
                </p>
                <p className="mt-4">
                  Our team personally selects each item in our inventory, ensuring that we only offer products that meet
                  our high standards for quality, authenticity, and craftsmanship.
                </p>
              </div>

              <div className="bg-muted rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="The AnimeVerse team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              At AnimeVerse, our mission is to connect fans with high-quality collectibles that celebrate the artistry
              and storytelling of anime. We believe that collectibles are more than just products—they're tangible
              connections to the stories and characters that have impacted our lives.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We carefully curate our collection to ensure every item meets our high standards.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Authenticity</h3>
                <p className="text-muted-foreground">
                  We only sell officially licensed products to support the creators and industry.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M17 6.1H3"></path>
                    <path d="M21 12.1H3"></path>
                    <path d="M15.1 18H3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We foster a community of collectors who share a passion for anime culture.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p>
              AnimeVerse is more than just an online store—it's a community of collectors and enthusiasts who share a
              passion for anime. Join us on social media to connect with fellow fans, stay updated on new releases, and
              participate in exclusive events.
            </p>

            <div className="flex justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/shop">Explore Our Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-muted py-12 mt-12">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">© 2025 AnimeVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
