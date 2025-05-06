"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { User, MapPin, CreditCard, ShoppingBag, Heart, Settings, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // Simulate loading user data
    setTimeout(() => {
      setProfileData({
        username: user.username,
        email: user.email,
        fullName: "John Doe",
        phone: "+1 (555) 123-4567",
        address: {
          street: "123 Anime Street",
          city: "Tokyo",
          state: "Tokyo",
          zipCode: "100-0001",
          country: "Japan",
        },
      })
      setIsLoading(false)
    }, 1000)
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value,
        },
      }))
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate saving profile
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
      setIsSaving(false)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{profileData.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>

                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/profile/orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#wishlist">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#addresses">
                      <MapPin className="mr-2 h-4 w-4" />
                      Addresses
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#payment">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </Button>
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" name="fullName" value={profileData.fullName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Addresses</CardTitle>
                      <CardDescription>Manage your shipping and billing addresses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address.street">Street Address</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          value={profileData.address.street}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address.city">City</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            value={profileData.address.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address.state">State/Province</Label>
                          <Input
                            id="address.state"
                            name="address.state"
                            value={profileData.address.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address.zipCode">Zip/Postal Code</Label>
                          <Input
                            id="address.zipCode"
                            name="address.zipCode"
                            value={profileData.address.zipCode}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address.country">Country</Label>
                          <Input
                            id="address.country"
                            name="address.country"
                            value={profileData.address.country}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Update your password and security preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={() => {
                          toast({
                            title: "Password updated",
                            description: "Your password has been updated successfully.",
                          })
                        }}
                      >
                        Update Password
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Order history moved to /profile/orders page */}

              <div id="wishlist">
                <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-4">Save items you're interested in for later.</p>
                      <Button asChild>
                        <a href="/shop">Explore Products</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
