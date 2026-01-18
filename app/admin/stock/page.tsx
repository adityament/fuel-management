"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { stockData } from "@/lib/dummy-data"
import type { Stock } from "@/lib/types"

export default function AdminStockPage() {
  const columns = [
    {
      key: "fuelType",
      header: "Fuel Type",
      render: (item: Stock) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.fuelType === "Petrol"
              ? "bg-chart-1/10 text-chart-1"
              : item.fuelType === "Diesel"
                ? "bg-chart-2/10 text-chart-2"
                : "bg-chart-4/10 text-chart-4"
          }`}
        >
          {item.fuelType}
        </span>
      ),
    },
    { key: "tankId", header: "Tank ID" },
    {
      key: "calculatedStock",
      header: "Calculated Stock",
      render: (item: Stock) => `${item.calculatedStock.toLocaleString()} L`,
    },
    {
      key: "dipReading",
      header: "Dip Reading",
      render: (item: Stock) => `${item.dipReading.toLocaleString()} L`,
    },
    {
      key: "receivedQuantity",
      header: "Received Qty",
      render: (item: Stock) => `${item.receivedQuantity.toLocaleString()} L`,
    },
    {
      key: "totalStock",
      header: "Total Stock",
      render: (item: Stock) => `${item.totalStock.toLocaleString()} L`,
    },
    {
      key: "closingStock",
      header: "Closing Stock",
      render: (item: Stock) => <span className="font-medium">{item.closingStock.toLocaleString()} L</span>,
    },
  ]

  const totalClosing = stockData.reduce((sum, s) => sum + s.closingStock, 0)
  const totalCapacity = stockData.reduce((sum, s) => sum + s.totalStock, 0)

  return (
    <DashboardLayout title="Stock Management" requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Stock Overview</h2>
          <p className="text-sm text-muted-foreground">Monitor fuel inventory levels</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Closing Stock</p>
            <p className="text-2xl font-bold text-card-foreground">{totalClosing.toLocaleString()} L</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Capacity</p>
            <p className="text-2xl font-bold text-card-foreground">{totalCapacity.toLocaleString()} L</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Fill Level</p>
            <p className="text-2xl font-bold text-primary">{((totalClosing / totalCapacity) * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active Tanks</p>
            <p className="text-2xl font-bold text-card-foreground">{stockData.length}</p>
          </div>
        </div>

        {/* Visual Stock Display */}
        <div className="grid gap-4 md:grid-cols-3">
          {stockData.map((stock) => (
            <div key={stock.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground">{stock.fuelType}</h3>
                  <p className="text-xs text-muted-foreground">{stock.tankId}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    stock.fuelType === "Petrol"
                      ? "text-chart-1"
                      : stock.fuelType === "Diesel"
                        ? "text-chart-2"
                        : "text-chart-4"
                  }`}
                >
                  {((stock.closingStock / stock.totalStock) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="h-4 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    stock.fuelType === "Petrol"
                      ? "bg-chart-1"
                      : stock.fuelType === "Diesel"
                        ? "bg-chart-2"
                        : "bg-chart-4"
                  }`}
                  style={{ width: `${(stock.closingStock / stock.totalStock) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium text-card-foreground">{stock.closingStock.toLocaleString()} L</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium text-card-foreground">{stock.totalStock.toLocaleString()} L</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <h3 className="text-md font-semibold text-card-foreground mb-4">Detailed Stock Data</h3>
          <DataTable
            data={stockData}
            columns={columns}
            searchPlaceholder="Search stock..."
            searchKeys={["fuelType", "tankId"]}
            pageSize={5}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
