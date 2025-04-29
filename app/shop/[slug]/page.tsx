"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductViewer3D } from "@/components/product-viewer-3d"
import { Label } from "@/components/ui/label"
import { useProducts, Product } from "@/hooks/use-products"
import { Navbar } from "@/components/navbar"
import { useOrders } from "@/lib/orders-context"
import { useCart } from "@/context/cart-context"

export default function ProductPage() {
  const { addToCart } = useCart()
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { products } = useProducts()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addOrder } = useOrders();
  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.slug === slug) || null
      setProduct(found)
      if (!found) router.push("/shop")
      setLoading(false)
    }
  }, [products, slug, router])

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen">Product not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 mt-16 flex-1">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="3d" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="3d">3D View</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              <TabsContent value="3d" className="border rounded-lg overflow-hidden">
                <div className="aspect-square">
                  <ProductViewer3D modelPath={product.modelPath || "/assets/3d/duck.glb"} />
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                </div>
                {product.additionalImages?.length && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {product.additionalImages.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img src={img} alt={`${product.name} view ${idx + 1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementQuantity}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={incrementQuantity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
  <Button
  className="h-12 w-full sm:w-1/2"
  onClick={() =>
    addToCart({
      ...product,
      quantity,
    })
  }
>
  <ShoppingCart className="h-5 w-5 mr-2" />
  Add to Cart
</Button>

  <Button
    variant="outline"
    className="h-12 w-full sm:w-1/2"
    onClick={() => {
      addOrder({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
      router.push("/orders");
    }}
  >
    Buy Now
  </Button>
</div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(product.features ?? [
                  "Premium quality material",
                  "Highly detailed sculpting",
                  "Official licensed product",
                ]).map((feat: string, i: number) => (
                  <li key={i} className="text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
