"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
//import { Breadcrumbs } from "@/components/seo/breadcrumbs"
//import { StructuredData } from "@/components/seo/structured-data"
import { Navbar } from "@/components/navbar"
export default function ContactPage() {
  const searchParams = useSearchParams()
  const productParam = searchParams.get("product")

  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: productParam ? "Product Quote" : "General Inquiry",
    message: productParam ? `I would like a quote for the product: ${productParam}` : "",
    contactPreference: "email",
    product: productParam || "",
    newsletter: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, contactPreference: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const breadcrumbItems = [{ label: "Contact", href: "/contact", isCurrent: true }]

  if (isSubmitted) {
    return (
            <div className="min-h-screen flex flex-col">
<div className="container py-8 mt-16 flex-1">
        
      <div className="container mx-auto px-6 py-12 lg:px-8">
                 <Navbar />
        

        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg">Thanks for reaching out. We'll respond shortly.</p>
        </div>

        <Card className="max-w-2xl mx-auto text-center p-8">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent</h2>
            <p className="mb-6">Thank you for contacting JUPY!</p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          </div>
        </Card>
      </div>
            </div>
</div>
    )
  }

  return (
        <div className="min-h-screen flex flex-col">
<div className="container py-8 mt-16 flex-1">
    <div className="container mx-auto px-6 py-12 lg:px-8">
      
                 <Navbar />

      <div className="mx-auto max-w-2xl text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg">
          You have a question about a product, a 3D customization, or want to collaborate with JUPY? Let’s talk!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Product Quote">Product Quote</SelectItem>
                  <SelectItem value="3D Customization">3D Customization</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.subject === "Product Quote" && (
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={formData.product} onValueChange={(value) => handleSelectChange("product", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="figurine-naruto">Naruto Action Figure</SelectItem>
                    <SelectItem value="tshirt-onepiece">One Piece T-Shirt</SelectItem>
                    <SelectItem value="poster-demon-slayer">Demon Slayer Poster</SelectItem>
                    <SelectItem value="manga-pack-attack-titan">Attack on Titan Manga Pack</SelectItem>
                    <SelectItem value="other">Other / Custom Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <RadioGroup
                value={formData.contactPreference}
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone">Phone</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="newsletter" className="text-sm font-normal">
                Subscribe to our newsletter for anime drops & deals
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Contact Info</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      Technopole – Route M'saken <br /> Sousse, Tunisia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+216 50 000 999</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contact@jupy.tn</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Monday - Friday</div>
                  <div>9:00 AM - 6:00 PM</div>
                  <div>Saturday - Sunday</div>
                  <div>By appointment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 h-64 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.274409539433!2d10.5835022!3d35.8191312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302756898de71c9%3A0xfd71ac4a45e7bd74!2sNOVATION%20CITY!5e0!3m2!1sen!2stn!4v1714410849996!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="JUPY Google Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
        </div>
</div>
  )
}
