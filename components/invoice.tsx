"use client"

import type { Order } from "@/hooks/use-orders"

export function Invoice({ order }: { order: Order }) {
  const orderDate = new Date(order.date || new Date())
  const formattedDate = orderDate.toLocaleDateString()
  const formattedTime = orderDate.toLocaleTimeString()

  // Safely access order ID
  const orderId = order.id ? order.id.split("-")[1] || order.id.slice(0, 8) : "Unknown"

  return (
    <div className="invoice-container">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">INVOICE</h1>
          <p className="text-muted-foreground">#{orderId}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold mb-1">Anime Store</h2>
          <p className="text-sm text-muted-foreground">123 Anime Street</p>
          <p className="text-sm text-muted-foreground">Tokyo, Japan 100-0001</p>
          <p className="text-sm text-muted-foreground">contact@animestore.com</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">Bill To:</h3>
          <p className="mb-1">{order.shippingAddress?.name || "Customer"}</p>
          {order.shippingAddress ? (
            <>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.country}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Digital Purchase - No Shipping Address</p>
          )}
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold">Invoice Number:</div>
            <div>#{orderId}</div>

            <div className="font-semibold">Date:</div>
            <div>{formattedDate}</div>

            <div className="font-semibold">Time:</div>
            <div>{formattedTime}</div>

            <div className="font-semibold">Payment Method:</div>
            <div>{order.paymentMethod || "Credit Card"}</div>

            <div className="font-semibold">Status:</div>
            <div className="capitalize">{order.status || "Processing"}</div>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-3 border-b">Item</th>
            <th className="text-center p-3 border-b">Quantity</th>
            <th className="text-right p-3 border-b">Unit Price</th>
            <th className="text-right p-3 border-b">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, index) => (
            <tr key={item.id || index}>
              <td className="p-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded overflow-hidden hidden sm:block">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>{item.name || "Unknown product"}</span>
                </div>
              </td>
              <td className="p-3 border-b text-center">{item.quantity || 1}</td>
              <td className="p-3 border-b text-right">${(item.price || 0).toFixed(2)}</td>
              <td className="p-3 border-b text-right">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>${(order.subtotal || order.total || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Tax (10%):</span>
            <span>${(order.tax || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Shipping:</span>
            <span>{(order.shipping || 0) === 0 ? "Free" : `$${(order.shipping || 0).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between py-2 border-t font-bold">
            <span>Total:</span>
            <span>${(order.grandTotal || order.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p className="mb-2">Thank you for your purchase!</p>
        <p>If you have any questions about this invoice, please contact us at support@animestore.com</p>
      </div>
    </div>
  )
}

export default Invoice
