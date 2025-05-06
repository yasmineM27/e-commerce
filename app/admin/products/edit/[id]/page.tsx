"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ImageIcon, CuboidIcon as Cube, Upload, X, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProductViewer3D } from "@/components/product-viewer-3d"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Simple custom select component to avoid Radix UI issues
function SimpleSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { getProduct, updateProduct } = useProducts()
  const { toast } = useToast()
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const additionalImageInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const modelInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    series: "",
    description: "",
    modelPath: "",
    additionalImages: ["", "", ""],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [modelFileName, setModelFileName] = useState("")
  const [modelUploadError, setModelUploadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("image")

  // Load product data
  useEffect(() => {
    // Create a flag to prevent state updates after unmount
    let isMounted = true

    // Load product data only once on component mount
    const product = getProduct(productId)

    if (product && isMounted) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        series: product.series,
        description: product.description || "",
        modelPath: product.modelPath || "/assets/3d/duck.glb",
        additionalImages: product.additionalImages || ["", "", ""],
      })

      // If the model path is a data URL, extract the filename
      if (product.modelPath && product.modelPath.startsWith("data:")) {
        const fileName = product.modelFileName || "uploaded-model.glb"
        setModelFileName(fileName)
      }

      setIsLoading(false)
    } else if (isMounted) {
      toast({
        title: "Product not found",
        description: "The product you're trying to edit doesn't exist",
        variant: "destructive",
      })
      router.push("/admin/products")
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }

    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, image: event.target?.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAdditionalImages = [...formData.additionalImages]
          newAdditionalImages[index] = event.target?.result as string
          setFormData((prev) => ({ ...prev, additionalImages: newAdditionalImages }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setModelFileName(file.name)
      setModelUploadError(null)

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setModelUploadError("File size exceeds 10MB limit. Please choose a smaller file.")
        return
      }

      // Check if the file is a valid 3D model format
      if (file.name.toLowerCase().endsWith(".glb") || file.name.toLowerCase().endsWith(".gltf")) {
        const reader = new FileReader()

        reader.onload = (event) => {
          if (event.target?.result) {
            // Store the data URL in the form data
            const dataUrl = event.target.result as string
            console.log("Model loaded as data URL, length:", dataUrl.length)

            // Update formData
            setFormData((prev) => ({ ...prev, modelPath: dataUrl }))

            // Switch to 3D tab after a short delay
            setTimeout(() => {
              setActiveTab("3d")
            }, 100)
          }
        }

        reader.onerror = (error) => {
          console.error("Error reading file:", error)
          setModelUploadError("Error reading file. Please try again with a different file.")
          toast.error("Error reading file", {
            description: "There was a problem reading the 3D model file.",
          })
        }

        // Read the file as a data URL
        reader.readAsDataURL(file)
      } else {
        setModelUploadError("Invalid file format. Please upload a .glb or .gltf file.")
        toast.error("Invalid file format", {
          description: "Please upload a .glb or .gltf file.",
        })
      }
    }
  }

  const removeAdditionalImage = (index: number) => {
    const newAdditionalImages = [...formData.additionalImages]
    newAdditionalImages[index] = ""
    setFormData((prev) => ({ ...prev, additionalImages: newAdditionalImages }))

    // Reset the file input
    if (additionalImageInputRefs[index].current) {
      additionalImageInputRefs[index].current!.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category || !formData.series) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Filter out empty additional images
      const additionalImages = formData.additionalImages.filter((img) => img.trim() !== "")

      // Update product
      updateProduct(productId, {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        series: formData.series,
        description: formData.description,
        modelPath: formData.modelPath,
        additionalImages,
        modelFileName: modelFileName || undefined,
      })

      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModelSelection = (value: string) => {
    if (value !== "custom") {
      setFormData((prev) => ({ ...prev, modelPath: value }))
      setModelFileName("")

      // Switch to 3D tab after a short delay
      setTimeout(() => {
        setActiveTab("3d")
      }, 100)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Category options
  const categoryOptions = [
    { value: "Action Figures", label: "Action Figures" },
    { value: "Manga", label: "Manga" },
    { value: "Accessories", label: "Accessories" },
    { value: "Clothing", label: "Clothing" },
  ]

  // Series options
  const seriesOptions = [
    { value: "Naruto", label: "Naruto" },
    { value: "One Piece", label: "One Piece" },
    { value: "Dragon Ball", label: "Dragon Ball" },
    { value: "My Hero Academia", label: "My Hero Academia" },
    { value: "Attack on Titan", label: "Attack on Titan" },
    { value: "Demon Slayer", label: "Demon Slayer" },
  ]

  // Model options
  const modelOptions = [{ value: "/assets/3d/duck.glb", label: "Duck (Sample)" }]

  // Add custom model option if we have one
  if (formData.modelPath?.startsWith("data:")) {
    modelOptions.push({ value: "custom", label: "Custom Uploaded Model" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <SimpleSelect
              label="Category *"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleSelectChange("category", value)}
            />

            <SimpleSelect
              label="Series *"
              options={seriesOptions}
              value={formData.series}
              onChange={(value) => handleSelectChange("series", value)}
            />

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Media</h3>

            <div className="space-y-2">
              <Label htmlFor="mainImage" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Main Product Image *
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="mainImage"
                  ref={mainImageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => mainImageInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {formData.image ? "Change Image" : "Upload Image"}
                </Button>
                {formData.image && (
                  <div className="h-10 w-10 rounded-md overflow-hidden border">
                    <img src={formData.image || "/placeholder.svg"} alt="Main" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Additional Images
              </Label>
              <div className="grid gap-2">
                {formData.additionalImages.map((image, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`additionalImage${index}`}
                      ref={additionalImageInputRefs[index]}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAdditionalImageUpload(index, e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => additionalImageInputRefs[index].current?.click()}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {image ? "Change Image" : "Upload Image"}
                    </Button>
                    {image ? (
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md overflow-hidden border">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Additional ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAdditionalImage(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelUpload" className="flex items-center gap-2">
                <Cube className="h-4 w-4" /> 3D Model
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="modelUpload"
                  ref={modelInputRef}
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={handleModelUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => modelInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {modelFileName ? "Change 3D Model" : "Upload 3D Model"}
                </Button>
                {modelFileName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cube className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">{modelFileName}</span>
                  </div>
                )}
              </div>

              {modelUploadError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{modelUploadError}</AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground mt-1">Supported formats: GLB, GLTF (max 10MB)</div>

              <div className="mt-2">
                <Label>Or select a sample model:</Label>
                <SimpleSelect
                  label=""
                  options={modelOptions}
                  value={formData.modelPath?.startsWith("data:") ? "custom" : formData.modelPath}
                  onChange={handleModelSelection}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Preview</h3>

          <Tabs defaultValue="image" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="3d">3D Model</TabsTrigger>
            </TabsList>

            <TabsContent value="image">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                    {formData.image ? (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt={formData.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image provided
                      </div>
                    )}
                  </div>

                  {formData.additionalImages.some((img) => img.trim() !== "") && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.additionalImages.map(
                        (image, index) =>
                          image.trim() !== "" && (
                            <div key={index} className="aspect-square rounded-md overflow-hidden border bg-muted">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${formData.name} - ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=100"
                                }}
                              />
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="3d">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    {formData.modelPath ? (
                      <div className="w-full h-full">
                        <ProductViewer3D key={formData.modelPath} modelPath={formData.modelPath} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No 3D model provided
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
