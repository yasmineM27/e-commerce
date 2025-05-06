"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, ChevronLeft, FileText, Download, Clock, Truck, CheckCircle, ShoppingBag } from "lucide-react"
import { useOrders, type Order } from "@/hooks/use-orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Invoice } from "@/components/invoice"

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showInvoice, setShowInvoice] = useState(false)

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-8">Please sign in to view your orders.</p>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    )
  }

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order)
    setShowInvoice(true)
  }

  const handleCloseInvoice = () => {
    setShowInvoice(false)
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4">
          <div className="flex items-center mb-8">
            <Button variant="ghost" className="pl-0 mr-4" onClick={() => router.push("/profile")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-3xl font-bold">My Orders</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-6xl mx-auto pt-24 pb-16 px-4">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="pl-0 mr-4" onClick={() => router.push("/profile")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.split("-")[1]}
                    </CardTitle>
                    <CardDescription>
                      Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                      {new Date(order.date).toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 px-3 py-1 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>${order.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-end gap-2">
                <Button variant="outline" className="flex items-center gap-2" onClick={() => handleViewInvoice(order)}>
                  <FileText className="h-4 w-4" />
                  View Invoice
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Invoice #{selectedOrder.id.split("-")[1]}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    const invoiceElement = document.getElementById("invoice-content")
                    if (invoiceElement) {
                      const printWindow = window.open("", "_blank")
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Invoice #${selectedOrder.id.split("-")[1]}</title>
                              <style>
                                body { font-family: Arial, sans-serif; }
                                .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
                                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                                th { background-color: #f8f9fa; }
                              </style>
                            </head>
                            <body>
                              ${invoiceElement.innerHTML}
                            </body>
                          </html>
                        `)
                        printWindow.document.close()
                        printWindow.print()
                      }
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCloseInvoice}>
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6" id="invoice-content">
              <Invoice order={selectedOrder} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
