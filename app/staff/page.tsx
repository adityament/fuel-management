"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { StatCard } from "@/components/ui/stat-card"
import { useAuth } from "@/lib/auth-context"
import { sales, attendanceRecords } from "@/lib/dummy-data"
import { ShoppingCart, Clock, TrendingUp, Calendar } from "lucide-react"

export default function StaffDashboard() {
  const { user } = useAuth()

  // Filter sales by current staff
  const staffSales = sales.filter((s) => s.staffId === "STF001")
  const totalSales = staffSales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalQuantity = staffSales.reduce((sum, sale) => sum + sale.quantity, 0)

  // Get today's attendance for current staff
  const todayAttendance = attendanceRecords.find((a) => a.staffId === "STF001" && a.date === "2026-01-16")

  return (
    <DashboardLayout title="Dashboard" requiredRole="staff">
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-1">
            Welcome back, {user?.username || "Staff Member"}!
          </h2>
          <p className="text-muted-foreground">
            {todayAttendance ? "You checked in at " + todayAttendance.checkInTime : "You haven't checked in today yet."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="My Sales Today"
            value={`₹${totalSales.toLocaleString()}`}
            icon={ShoppingCart}
            description="Total revenue"
          />
          <StatCard
            title="Fuel Dispensed"
            value={`${totalQuantity} L`}
            icon={TrendingUp}
            description="Total quantity"
          />
          <StatCard title="Transactions" value={staffSales.length} icon={Calendar} description="Today's count" />
          <StatCard
            title="Shift Status"
            value={todayAttendance?.logoutTime ? "Completed" : todayAttendance ? "On Duty" : "Not Started"}
            icon={Clock}
            description={todayAttendance?.notes || "Morning shift"}
          />
        </div>

        {/* Recent Sales */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">My Recent Sales</h2>
            <a href="/staff/sales" className="text-sm text-primary hover:underline">
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
                  <th className="pb-3 text-left font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staffSales.slice(0, 5).map((sale) => (
                  <tr key={sale.id}>
                    <td className="py-3 font-medium">{sale.id}</td>
                    <td className="py-3">{sale.fuelType}</td>
                    <td className="py-3">{sale.quantity} L</td>
                    <td className="py-3">₹{sale.amount.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground capitalize">{sale.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/staff/sales"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="rounded-lg bg-primary/10 p-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Add New Sale</p>
              <p className="text-sm text-muted-foreground">Record a fuel transaction</p>
            </div>
          </a>
          <a
            href="/staff/attendance"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="rounded-lg bg-chart-2/10 p-3">
              <Clock className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Check In/Out</p>
              <p className="text-sm text-muted-foreground">Record your attendance</p>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
