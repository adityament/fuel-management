"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/ui/summary-card";
import { DownloadButtons } from "@/components/download-buttons";
import {
  AddSaleModal,
  type SaleFormData,
} from "@/components/forms/add-sale-modal";

import type { Sale } from "@/lib/types";
import { Plus, Filter, IndianRupee, Droplets, Receipt } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function AdminSalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesList, setSalesList] = useState<Sale[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    nozzleId: "all",
    fuelType: "all",
    startDate: "", // ← new
    endDate: "", // ← new
  });

  // ================= FETCH SALES =================
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/sales/getall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch sales");

        const data = await res.json();

        const formatted: Sale[] = data.map((item: any) => ({
          id: item._id,
          nozzleId: item.nozzleId,
          fuelType:
            item.fuelType.charAt(0).toUpperCase() +
            item.fuelType.slice(1).toLowerCase(),
          openingReading: item.openingReading,
          closingReading: item.closingReading,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
          paymentMode: item.paymentMode,
          shift: item.shift,
          date: item.createdAt,
          customerId: item.customerId,
          staffId: item.createdBy,
        }));

        setSalesList(formatted);
      } catch (err) {
        console.error("Sales fetch failed:", err);
      }
    };

    fetchSales();
  }, []);

  // ================= ADD SALE =================
  const handleAddSale = (data: SaleFormData) => {
    const qty = data.closingReading - data.openingReading;

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
      date: new Date().toISOString(),
      customerId: data.customerId,
      staffId: "STAFF",
    };

    setSalesList((prev) => [...prev, newSale]);
  };

  // ================= FILTERS =================
  const filteredSales = salesList.filter((sale) => {
    // Nozzle filter
    if (filters.nozzleId !== "all" && sale.nozzleId !== filters.nozzleId)
      return false;

    // Fuel type filter
    if (filters.fuelType !== "all" && sale.fuelType !== filters.fuelType)
      return false;

    // Date filter — new
    if (filters.startDate || filters.endDate) {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0); // only date part compare karne ke liye

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        if (saleDate < start) return false;
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999); // pura din include ho
        if (saleDate > end) return false;
      }
    }

    return true;
  });

  const nozzleOptions = [
    { value: "all", label: "All Nozzles" },
    ...Array.from(new Set(salesList.map((s) => s.nozzleId))).map((id) => ({
      value: id,
      label: id,
    })),
  ];

  const fuelTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
  ];

  // ================= TABLE COLUMNS =================
  // (bilkul same rakha hai – no change)
  const columns = [
    {
      key: "date",
      header: "Date",
      render: (row: Sale) => {
        const d = new Date(row.date);
        return d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
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
  ];

  // ================= UI =================
  return (
    <DashboardLayout title="Sales" requiredRole="admin">
      <div className="space-y-6">
        {/* ACTION BAR – same */}
        <div className="flex justify-end">
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* FILTERS – yahan date inputs add kiye */}
        {/* FILTERS */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

              {/* Start Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() =>
                  setFilters({
                    nozzleId: "all",
                    fuelType: "all",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
        {/* SUMMARY – same */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
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

        {/* TABLE – bilkul same */}
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
  );
}
