//"use client"

import Image from "next/image"
import { CheckCircle, Users, Building, Award } from "lucide-react"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "À propos - Brand Jupy",
  description:
    "Discover the story, mission, and team behind JUPY – a unique anime e-commerce platform with 3D customization and a passion for youth creativity.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
         <Navbar />
      <div className="container py-8 mt-16 flex-1">
        <div className="flex flex-col gap-2 mb-12 text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-muted-foreground text-lg">
            JUPY is a dynamic anime e-commerce platform built by passionate students, combining 3D customization and youth-focused creativity.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="jupy story"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              JUPY was born from our love for anime and passion for web development. We saw a need for personalized anime products in Tunisia and set out to build a platform combining tech and creativity.
            </p>
            <p className="mb-4">
              With SketchUp 3D integration, our users can preview and customize products in real-time. We go beyond e-commerce—we sponsor events and connect with youth communities to promote creativity.
            </p>
            <p>
              From idea to execution, JUPY is a student-driven project aiming to empower local innovation through the world of anime.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" />
                Our Mission
              </h2>
              <p>
                To deliver a unique shopping experience for anime fans with creative 3D customization, while promoting local payment methods and student innovation in Tunisia.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Building className="mr-2 h-6 w-6 text-primary" />
                Our Vision
              </h2>
              <p>
                To become the leading anime-inspired e-commerce platform in North Africa, connecting fans, creators, and technology in one immersive environment.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p>We deliver top-notch products and design, with a focus on durability and satisfaction.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p>From 3D previews to interactive product pages, we embrace modern technologies for anime fans.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Satisfaction</h3>
              <p>We listen, we improve, and we always put the customer first. Your feedback shapes JUPY.</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <p className="text-center max-w-3xl mx-auto mb-12">
            Meet the passionate students behind JUPY, bringing together design, development, and anime fandom.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/yasmine.jpg" alt="Yasmine Massaoudi" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Yasmine Massaoudi</h3>
              <p className="text-muted-foreground">UI/UX Designer & Marketing Lead</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/walid.jpg" alt="Masri Walid Khalifa" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Masri Walid Khalifa</h3>
              <p className="text-muted-foreground">Full-Stack Developer</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/haythem.jpg" alt="Khalifa Haythem" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Khalifa Haythem</h3>
              <p className="text-muted-foreground">3D Integration & Frontend</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/mehdi.jpg" alt="Souid Mehdi" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Souid Mehdi</h3>
              <p className="text-muted-foreground">Backend & Payment Integration</p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Our Facilities</h2>
          <p className="text-center max-w-3xl mx-auto mb-12">
            JUPY is developed across remote workspaces, university labs, and creative collaboration tools like Figma, GitHub, and SketchUp.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={`/facility-${i}.jpg`}
                  alt={`Facility ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
