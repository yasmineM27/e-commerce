"use client"

import { useAuth } from "@/hooks/use-auth"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const { getUsers } = useAuth()
  const { products } = useProducts()

  const users = getUsers()
  const totalUsers = users.length
  const totalProducts = products.length
  const totalRevenue = products.reduce((acc, product) => acc + product.price, 0).toFixed(2)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users on the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products available in the store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">Potential revenue from all products</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">Recent Activity</h2>
      <p className="text-muted-foreground">
        Welcome to your admin dashboard. From here, you can manage users, products, and view store statistics.
      </p>
      <p className="text-muted-foreground">
        Use the sidebar navigation to access different sections of the admin panel.
      </p>
    </div>
  )
}
