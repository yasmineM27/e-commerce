import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, Share2, Heart, MessageSquare, ChevronRight } from "lucide-react"

// Sample blog posts data
const blogPosts = [
  {
    id: "1",
    slug: "new-naruto-collection",
    title: "New Naruto Collection Just Arrived",
    excerpt:
      "Check out our latest collection of premium Naruto figures and merchandise, featuring your favorite characters from the Hidden Leaf Village.",
    content: `
      <p>We're thrilled to announce the arrival of our newest collection featuring characters from the beloved anime series Naruto! This exclusive collection includes premium quality figures, accessories, and merchandise that any Naruto fan would be proud to display.</p>
      
      <h2>Highlights of the Collection</h2>
      
      <p>Our new Naruto collection features meticulously crafted figures of your favorite characters, including:</p>
      
      <ul>
        <li>Naruto Uzumaki in various forms, including Sage Mode and Nine-Tails Chakra Mode</li>
        <li>Sasuke Uchiha with his Sharingan and Rinnegan</li>
        <li>Kakashi Hatake with his Sharingan eye</li>
        <li>Sakura Haruno in her medical ninja outfit</li>
        <li>And many more characters from the Hidden Leaf Village and beyond</li>
      </ul>
      
      <p>Each figure is crafted with attention to detail, capturing the essence of the characters as they appear in the anime and manga. The figures range in size from 15cm to 30cm tall, making them perfect for display on your shelf or desk.</p>
      
      <h2>Limited Edition Items</h2>
      
      <p>In addition to our standard collection, we're also offering a limited number of exclusive items that won't be available anywhere else. These include:</p>
      
      <ul>
        <li>A hand-painted diorama of the final battle between Naruto and Sasuke</li>
        <li>A collector's edition set featuring all members of Team 7</li>
        <li>Special variant figures with alternative costumes and poses</li>
      </ul>
      
      <p>These limited edition items are expected to sell out quickly, so be sure to grab yours while supplies last!</p>
      
      <h2>Pre-order Bonuses</h2>
      
      <p>Customers who pre-order items from the new collection will receive exclusive bonuses, including:</p>
      
      <ul>
        <li>A Naruto-themed art book featuring concept art and character designs</li>
        <li>A set of collectible pins featuring the symbols of the various ninja villages</li>
        <li>A discount on future purchases from the Naruto collection</li>
      </ul>
      
      <p>Pre-orders are open now and will close on June 15, 2025. Don't miss your chance to secure these exclusive bonuses!</p>
      
      <h2>Visit Our Store</h2>
      
      <p>The new Naruto collection is available both online and in our physical store. Visit us to see these amazing figures in person and take advantage of in-store exclusive offers.</p>
      
      <p>We're excited to bring this collection to Naruto fans everywhere and can't wait to see your reactions. Stay tuned for more anime collections coming soon!</p>
    `,
    date: "May 2, 2025",
    readTime: "5 min read",
    category: "New Arrivals",
    image: "/placeholder.svg?height=600&width=1200",
    featured: true,
    author: {
      name: "Yuki Tanaka",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["anime-convention-2025", "one-piece-anniversary", "summer-anime-releases"],
  },
  {
    id: "2",
    slug: "anime-convention-2025",
    title: "Join Us at Anime Convention 2025",
    excerpt:
      "We're excited to announce that AnimeVerse will be attending the upcoming Anime Convention 2025. Visit our booth for exclusive merchandise and special offers.",
    content: `
      <p>Mark your calendars, anime fans! AnimeVerse is thrilled to announce that we'll be exhibiting at the upcoming Anime Convention 2025, the biggest anime event of the year. This is your chance to meet our team, check out our latest products in person, and take advantage of convention-exclusive offers.</p>
      
      <h2>Event Details</h2>
      
      <p>Anime Convention 2025 will be held at the Tokyo International Exhibition Center from July 15-18, 2025. Our booth will be located in Hall B, Booth #423. We'll be open during all convention hours, from 10:00 AM to 7:00 PM each day.</p>
      
      <h2>Exclusive Convention Merchandise</h2>
      
      <p>We're bringing a range of exclusive merchandise that will only be available at the convention, including:</p>
      
      <ul>
        <li>Limited edition convention variant figures</li>
        <li>AnimeVerse x Anime Convention 2025 collaboration t-shirts and hoodies</li>
        <li>Exclusive art prints signed by popular anime artists</li>
        <li>Convention-only discount bundles on our most popular collections</li>
      </ul>
      
      <p>These items are produced in limited quantities and will not be available in our online store, so this is your only chance to add them to your collection!</p>
      
      <h2>Meet the Team</h2>
      
      <p>Our product designers and anime experts will be at the booth throughout the convention. Stop by to chat about your favorite series, get recommendations for your collection, or just geek out with fellow anime enthusiasts.</p>
      
      <p>We'll also be hosting daily giveaways and raffles at our booth, with prizes including high-end collectible figures, manga box sets, and AnimeVerse gift cards.</p>
      
      <h2>Special Events</h2>
      
      <p>In addition to our booth presence, we're sponsoring several events at the convention:</p>
      
      <ul>
        <li>Figure Collecting 101 Panel - July 16, 2:00 PM, Panel Room 3</li>
        <li>Anime Merchandise Photography Workshop - July 17, 11:00 AM, Workshop Area B</li>
        <li>AnimeVerse After Hours Party - July 17, 8:00 PM, Convention Center Ballroom (ticket required)</li>
      </ul>
      
      <p>Check the official convention schedule for more details on these events and how to participate.</p>
      
      <h2>Can't Make It to the Convention?</h2>
      
      <p>If you can't attend in person, don't worry! We'll be posting updates from the convention floor on our social media channels. Follow us to see our exclusive merchandise, booth activities, and maybe even some surprise announcements.</p>
      
      <p>We're counting down the days to Anime Convention 2025 and can't wait to meet our customers in person. See you there!</p>
    `,
    date: "April 28, 2025",
    readTime: "3 min read",
    category: "Events",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      name: "Hiroshi Nakamura",
      role: "Events Coordinator",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["new-naruto-collection", "interview-figure-designer", "collecting-guide-beginners"],
  },
  {
    id: "3",
    slug: "collecting-guide-beginners",
    title: "Anime Collecting Guide for Beginners",
    excerpt:
      "New to collecting anime figures? Our comprehensive guide covers everything you need to know to start your collection, from understanding scales to proper display and maintenance.",
    content: `<p>Sample content for Anime Collecting Guide for Beginners</p>`,
    date: "April 15, 2025",
    readTime: "8 min read",
    category: "Guides",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      name: "Akira Suzuki",
      role: "Collection Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["interview-figure-designer", "new-naruto-collection", "one-piece-anniversary"],
  },
  {
    id: "4",
    slug: "one-piece-anniversary",
    title: "Celebrating 25 Years of One Piece",
    excerpt:
      "Join us in celebrating 25 years of One Piece with our special anniversary collection, featuring limited edition figures and exclusive merchandise.",
    content: `<p>Sample content for Celebrating 25 Years of One Piece</p>`,
    date: "April 10, 2025",
    readTime: "4 min read",
    category: "Collections",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      name: "Mei Lin",
      role: "Content Writer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["new-naruto-collection", "summer-anime-releases", "collecting-guide-beginners"],
  },
  {
    id: "5",
    slug: "interview-figure-designer",
    title: "Interview with Master Figure Designer Takashi Yamada",
    excerpt:
      "We sat down with renowned figure designer Takashi Yamada to discuss his creative process, inspirations, and the future of anime figure design.",
    content: `<p>Sample content for Interview with Master Figure Designer Takashi Yamada</p>`,
    date: "March 25, 2025",
    readTime: "10 min read",
    category: "Interviews",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      name: "Sakura Tanaka",
      role: "Editor-in-Chief",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["collecting-guide-beginners", "one-piece-anniversary", "new-naruto-collection"],
  },
  {
    id: "6",
    slug: "summer-anime-releases",
    title: "Most Anticipated Summer 2025 Anime Releases",
    excerpt:
      "Get ready for the summer anime season with our preview of the most anticipated shows and the merchandise you can expect to see in our store.",
    content: `<p>Sample content for Most Anticipated Summer 2025 Anime Releases</p>`,
    date: "March 18, 2025",
    readTime: "6 min read",
    category: "News",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      name: "Kenji Watanabe",
      role: "Anime Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: ["anime-convention-2025", "new-naruto-collection", "one-piece-anniversary"],
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Find the post by slug
  const post = blogPosts.find((post) => post.slug === params.slug)

  // If post not found, return 404
  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = post.relatedPosts ? blogPosts.filter((p) => post.relatedPosts?.includes(p.slug)) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6 pl-0" asChild>
            <Link href="/blog">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            {post.author && (
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.role}</div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg overflow-hidden mb-8">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
          </div>

          <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="flex items-center justify-between py-6 border-t border-b mb-12">
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="rounded-lg overflow-hidden border bg-card shadow-sm">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {relatedPost.date}
                        </span>
                      </div>
                      <Button variant="link" className="px-0" asChild>
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read Article
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
