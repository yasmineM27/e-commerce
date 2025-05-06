"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ImageIcon, CuboidIcon as Cube, Upload, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProductViewer3D } from "@/components/product-viewer-3d"

// Add this SimpleSelect component at the top of the file, after the imports
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

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useProducts()
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
    modelPath: "/assets/3d/duck.glb", // Default model path
    additionalImages: ["", "", ""],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [modelFileName, setModelFileName] = useState("")
  const [activeTab, setActiveTab] = useState("image")

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
      setModelFile(file)
      setModelFileName(file.name)

      // Check if the file is a valid 3D model format
      if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            // Store the data URL in the form data
            const dataUrl = event.target.result as string
            console.log("Model loaded as data URL, length:", dataUrl.length)
            setFormData((prev) => ({ ...prev, modelPath: dataUrl }))
          }
        }
        reader.onerror = (error) => {
          console.error("Error reading file:", error)
          toast.error("Error reading file", {
            description: "There was a problem reading the 3D model file.",
          })
        }
        // Read the file as a data URL
        reader.readAsDataURL(file)
      } else {
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
      if (!formData.name || !formData.price || !formData.category || !formData.series || !formData.image) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields and upload a main product image",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Filter out empty additional images
      const additionalImages = formData.additionalImages.filter((img) => img.trim() !== "")

      // Add product
      addProduct({
        name: formData.name,
        price: Number.parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        series: formData.series,
        description: formData.description,
        modelPath: formData.modelPath,
        additionalImages,
        modelFileName: modelFileName || undefined,
        features: ["Premium quality material", "Highly detailed sculpting", "Official licensed product"],
      })

      toast({
        title: "Product added",
        description: "The product has been added successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
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
              options={[
                { value: "Action Figures", label: "Action Figures" },
                { value: "Manga", label: "Manga" },
                { value: "Accessories", label: "Accessories" },
                { value: "Clothing", label: "Clothing" },
              ]}
              value={formData.category}
              onChange={(value) => handleSelectChange("category", value)}
            />

            <SimpleSelect
              label="Series *"
              options={[
                { value: "Naruto", label: "Naruto" },
                { value: "One Piece", label: "One Piece" },
                { value: "Dragon Ball", label: "Dragon Ball" },
                { value: "My Hero Academia", label: "My Hero Academia" },
                { value: "Attack on Titan", label: "Attack on Titan" },
                { value: "Demon Slayer", label: "Demon Slayer" },
              ]}
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
              <div className="text-sm text-muted-foreground mt-1">Supported formats: GLB, GLTF</div>

              <div className="mt-2">
                <Label>Or select a sample model:</Label>
                <SimpleSelect
                  label=""
                  options={[
                    { value: "/assets/3d/duck.glb", label: "Duck (Sample)" },
                    ...(formData.modelPath.startsWith("data:")
                      ? [{ value: "custom", label: "Custom Uploaded Model" }]
                      : []),
                  ]}
                  value={formData.modelPath.startsWith("data:") ? "custom" : formData.modelPath}
                  onChange={(value) => {
                    if (value !== "custom") {
                      setFormData((prev) => ({ ...prev, modelPath: value }))
                      setModelFileName("")
                      // Set the tab after a short delay to avoid render conflicts
                      setTimeout(() => {
                        setActiveTab("3d")
                      }, 100)
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Preview</h3>

          <Tabs defaultValue="image">
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
                        alt={formData.name || "Product preview"}
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
                                alt={`Additional image ${index + 1}`}
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
