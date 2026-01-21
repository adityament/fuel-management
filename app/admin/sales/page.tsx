"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { FormSelect } from "@/components/ui/form-select"
import { StatusBadge } from "@/components/ui/status-badge"
import { SummaryCard } from "@/components/ui/summary-card"
import { DownloadButtons } from "@/components/download-buttons"
import { AddSaleModal, type SaleFormData } from "@/components/forms/add-sale-modal"
import type { Sale } from "@/lib/types"
import { Plus, Filter, IndianRupee, Droplets, Receipt } from "lucide-react"



const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

export default function AdminSalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [salesList, setSalesList] = useState<Sale[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    nozzleId: "all",
    fuelType: "all",
  })

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${BASE_URL}/api/sales/getall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch sales")

        const data = await res.json()

        const formatted: Sale[] = data.map((item: any) => ({
          id: item._id,
          nozzleId: item.nozzleId,
          fuelType: item.fuelType,
          openingReading: item.openingReading,
          closingReading: item.closingReading,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
          paymentMode: item.paymentMode,
          shift: item.shift,
          date: item.date,                      // ← full ISO string rakho (split mat karo)
          customerId: item.customerId,
          staffId: item.createdBy,
        }))

        setSalesList(formatted)
      } catch (err) {
        console.error("Sales fetch failed:", err)
      }
    }

    fetchSales()
  }, [])

  const handleAddSale = (data: SaleFormData) => {
    const qty = data.closingReading - data.openingReading

    const newSale: Sale = {
      id: crypto.randomUUID(),
      nozzleId: data.nozzleId,
      fuelType: data.fuelType,
      openingReading: data.openingReading,
      closingReading: data.closingReading,
      rate: data.rate,
      quantity: qty,
      amount: qty * data.rate,
      paymentMode: data.paymentMode,
      shift: "morning",
      date: new Date().toISOString(),           // ← full timestamp
      customerId: data.customerId,
      staffId: "STAFF",
    }

    setSalesList((prev) => [...prev, newSale])
  }

  const filteredSales = salesList.filter((sale) => {
    if (filters.nozzleId !== "all" && sale.nozzleId !== filters.nozzleId) return false
    if (filters.fuelType !== "all" && sale.fuelType !== filters.fuelType) return false
    return true
  })

  const nozzleOptions = [
    { value: "all", label: "All Nozzles" },
    ...Array.from(new Set(salesList.map((s) => s.nozzleId))).map((id) => ({
      value: id,
      label: id,
    })),
  ]

  const fuelTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
  ]

  const columns = [
    { key: "nozzleId", header: "Nozzle ID" },
    {
      key: "fuelType",
      header: "Fuel Type",
      render: (i: Sale) => (
        <StatusBadge variant={i.fuelType === "Petrol" ? "petrol" : "diesel"}>
          {i.fuelType}
        </StatusBadge>
      ),
    },
    { key: "openingReading", header: "Opening" },
    { key: "closingReading", header: "Closing" },
    { key: "rate", header: "Rate" },
    {
      key: "amount",
      header: "Total Amount",
      render: (i: Sale) => `₹${i.amount.toLocaleString("en-IN")}`,
    },
    // {
    //   key: "date",
    //   header: "Date & Time",
    //   render: (sale: Sale) => formatDateTime(sale.date),   // ← yahan helper use kar rahe hain
    // },
    {
      key: "actions",
      header: "Action",
      render: (row: Sale) => (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-500 text-white" variant="outline">
            Edit
          </Button>
          <Button size="sm" className="bg-red-500 text-white" variant="outline">
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout title="Sales" requiredRole="admin">
      <div className="space-y-6">
        {/* ACTION BAR */}
        <div className="flex flex-wrap justify-between gap-2">
          <DownloadButtons sales={filteredSales} variant="dropdown" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-transparent"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>

            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Sale
            </Button>
          </div>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormSelect
                label="Nozzle ID"
                options={nozzleOptions}
                value={filters.nozzleId}
                onValueChange={(v) => setFilters({ ...filters, nozzleId: v })}
              />
              <FormSelect
                label="Fuel Type"
                options={fuelTypeOptions}
                value={filters.fuelType}
                onValueChange={(v) => setFilters({ ...filters, fuelType: v })}
              />
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setFilters({ nozzleId: "all", fuelType: "all" })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Sales"
            value={`₹${filteredSales.reduce((s, i) => s + i.amount, 0).toLocaleString("en-IN")}`}
            icon={IndianRupee}
          />
          <SummaryCard
            title="Total Quantity"
            value={`${filteredSales.reduce((s, i) => s + i.quantity, 0).toFixed(2)} L`}
            icon={Droplets}
          />
          <SummaryCard
            title="Transactions"
            value={filteredSales.length}
            icon={Receipt}
          />
        </div>

        {/* TABLE */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <DataTable
            data={filteredSales}
            columns={columns}
            pageSize={5}
            searchPlaceholder="Search sales..."
            searchKeys={["nozzleId", "fuelType", "paymentMode"]}
          />
        </div>
      </div>

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSale}
      />
    </DashboardLayout>
  )
}