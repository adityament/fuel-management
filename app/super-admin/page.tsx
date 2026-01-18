"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { StatCard } from "@/components/ui/stat-card"
import { admins, sales, staffMembers, stockData } from "@/lib/dummy-data"
import { Users, ShoppingCart, Package, TrendingUp } from "lucide-react"

export default function SuperAdminDashboard() {
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalStock = stockData.reduce((sum, stock) => sum + stock.totalStock, 0)

  return (
    <DashboardLayout title="Super Admin Dashboard" requiredRole="super-admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Admins"
            value={admins.length}
            icon={Users}
            description="Active pump admins"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Staff"
            value={staffMembers.length}
            icon={Users}
            description="Across all pumps"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Sales"
            value={`₹${totalSales.toLocaleString()}`}
            icon={ShoppingCart}
            description="This month"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Total Stock"
            value={`${totalStock.toLocaleString()} L`}
            icon={Package}
            description="All fuel types"
          />
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "New admin added", pump: "Pump Station 4", time: "2 hours ago" },
                { action: "Stock received", pump: "Pump Station 1", time: "5 hours ago" },
                { action: "High sales alert", pump: "Pump Station 2", time: "1 day ago" },
                { action: "Staff attendance issue", pump: "Pump Station 3", time: "2 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.pump} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">System Overview</h2>
            <div className="space-y-4">
              {[
                { label: "Active Pump Stations", value: admins.length, status: "operational" },
                { label: "Today's Transactions", value: sales.length, status: "operational" },
                { label: "Staff On Duty", value: 3, status: "operational" },
                { label: "Low Stock Alerts", value: 0, status: "good" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                    <div
                      className={`h-2 w-2 rounded-full ${item.status === "operational" ? "bg-chart-2" : "bg-chart-4"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/super-admin/admins"
              className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Manage Admins</p>
                <p className="text-xs text-muted-foreground">Add or edit pump admins</p>
              </div>
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">View Reports</p>
                <p className="text-xs text-muted-foreground">Sales & performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="rounded-lg bg-chart-4/10 p-2">
                <Package className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Stock Overview</p>
                <p className="text-xs text-muted-foreground">All pump inventory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
