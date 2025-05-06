import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ChevronRight } from "lucide-react"

// Sample blog posts data
const blogPosts = [
  {
    id: "1",
    slug: "new-naruto-collection",
    title: "New Naruto Collection Just Arrived",
    excerpt:
      "Check out our latest collection of premium Naruto figures and merchandise, featuring your favorite characters from the Hidden Leaf Village.",
    date: "May 2, 2025",
    readTime: "5 min read",
    category: "New Arrivals",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: "2",
    slug: "anime-convention-2025",
    title: "Join Us at Anime Convention 2025",
    excerpt:
      "We're excited to announce that AnimeVerse will be attending the upcoming Anime Convention 2025. Visit our booth for exclusive merchandise and special offers.",
    date: "April 28, 2025",
    readTime: "3 min read",
    category: "Events",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    slug: "collecting-guide-beginners",
    title: "Anime Collecting Guide for Beginners",
    excerpt:
      "New to collecting anime figures? Our comprehensive guide covers everything you need to know to start your collection, from understanding scales to proper display and maintenance.",
    date: "April 15, 2025",
    readTime: "8 min read",
    category: "Guides",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "4",
    slug: "one-piece-anniversary",
    title: "Celebrating 25 Years of One Piece",
    excerpt:
      "Join us in celebrating 25 years of One Piece with our special anniversary collection, featuring limited edition figures and exclusive merchandise.",
    date: "April 10, 2025",
    readTime: "4 min read",
    category: "Collections",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "5",
    slug: "interview-figure-designer",
    title: "Interview with Master Figure Designer Takashi Yamada",
    excerpt:
      "We sat down with renowned figure designer Takashi Yamada to discuss his creative process, inspirations, and the future of anime figure design.",
    date: "March 25, 2025",
    readTime: "10 min read",
    category: "Interviews",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "6",
    slug: "summer-anime-releases",
    title: "Most Anticipated Summer 2025 Anime Releases",
    excerpt:
      "Get ready for the summer anime season with our preview of the most anticipated shows and the merchandise you can expect to see in our store.",
    date: "March 18, 2025",
    readTime: "6 min read",
    category: "News",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function BlogPage() {
  // Get the featured post
  const featuredPost = blogPosts.find((post) => post.featured)

  // Get the rest of the posts
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            News, guides, and updates from the world of anime collectibles
          </p>

          {featuredPost && (
            <div className="mb-12">
              <div className="rounded-lg overflow-hidden border bg-card shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-auto">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-4 flex-grow">{featuredPost.excerpt}</p>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <div key={post.id} className="rounded-lg overflow-hidden border bg-card shadow-sm flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {post.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
                  <Button variant="outline" asChild className="mt-auto">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More Articles</Button>
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
