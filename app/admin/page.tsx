"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { StatCard } from "@/components/ui/stat-card"
import { sales, staffMembers, stockData } from "@/lib/dummy-data"
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0)
  const totalStock = stockData.reduce((sum, stock) => sum + stock.closingStock, 0)

  return (
    <DashboardLayout title="Dashboard" requiredRole="admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales"
            value={`₹${totalSales.toLocaleString()}`}
            icon={ShoppingCart}
            description="This month"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard title="Total Staff" value={staffMembers.length} icon={Users} description="Active employees" />
          <StatCard
            title="Fuel Sold"
            value={`${totalQuantity.toLocaleString()} L`}
            icon={TrendingUp}
            description="This month"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Current Stock"
            value={`${totalStock.toLocaleString()} L`}
            icon={Package}
            description="All tanks"
          />
        </div>

        {/* Stock Overview */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Stock Overview</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {stockData.map((stock) => (
              <div key={stock.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-card-foreground">{stock.fuelType}</span>
                  <span className="text-xs text-muted-foreground">{stock.tankId}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Stock</span>
                    <span className="font-medium">{stock.closingStock.toLocaleString()} L</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(stock.closingStock / stock.totalStock) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Capacity: {stock.totalStock.toLocaleString()} L</span>
                    <span>{((stock.closingStock / stock.totalStock) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Sales</h2>
            <a href="/admin/sales" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="pb-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Fuel</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Qty</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id}>
                    <td className="py-3 font-medium">{sale.id}</td>
                    <td className="py-3">{sale.fuelType}</td>
                    <td className="py-3">{sale.quantity} L</td>
                    <td className="py-3">₹{sale.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                        {sale.paymentMode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
