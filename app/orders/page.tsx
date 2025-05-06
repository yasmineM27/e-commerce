"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOrders } from "@/hooks/use-orders"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Truck, Package, CheckCircle, Clock, ArrowRight, FileText, Download } from "lucide-react"
import Invoice from "@/components/invoice"

export default function OrdersPage() {
  const { orders } = useOrders()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showInvoice, setShowInvoice] = useState(false)

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your orders</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const viewInvoice = (order: any) => {
    setSelectedOrder(order)
    setShowInvoice(true)
  }

  // Ensure we have orders array
  const safeOrders = orders || []

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage your order history</p>
        </div>
        <ShoppingBag className="h-8 w-8" />
      </div>

      {safeOrders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>
              You haven't placed any orders yet. Start shopping to see your orders here.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/shop")}>Browse Products</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {safeOrders.map((order: any) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id ? order.id.slice(0, 8) : "Unknown"}</CardTitle>
                    <CardDescription>Placed on {order.date ? formatDate(order.date) : "Unknown date"}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status || "processing")} variant="outline">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status || "processing")}
                      {(order.status || "processing").charAt(0).toUpperCase() + (order.status || "processing").slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(order.items || []).map((item: any, index: number) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name || "Unknown product"}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <p className="font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${(order.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>${(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex flex-wrap gap-3 justify-between">
                <Button variant="outline" size="sm" onClick={() => viewInvoice(order)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/shop/${order.items && order.items[0] ? order.items[0].slug || "" : ""}`}>
                    Buy Again
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">
                Invoice #{selectedOrder.id ? selectedOrder.id.slice(0, 8) : "Unknown"}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowInvoice(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              <Invoice order={selectedOrder} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
