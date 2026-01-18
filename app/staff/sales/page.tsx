"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
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

export default function StaffSalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesList, setSalesList] = useState<Sale[]>([]);
  const [filters, setFilters] = useState({
    date: "",
    fuelType: "all",
    paymentMode: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch sales from API
useEffect(() => {
  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/sales/getall`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch sales data");

      const data: any[] = await res.json();
      console.log(data, "Fetched sales");

      // Map _id to id for DataTable
      const mappedData: Sale[] = data.map((s) => ({
        id: s._id,              // <- fix here
        nozzleId: s.nozzleId,
        fuelType: s.fuelType,
        openingReading: s.openingReading,
        closingReading: s.closingReading,
        rate: s.rate,
        paymentMode: s.paymentMode,
        customerId: s.customerId,
        quantity: s.quantity,
        amount: s.amount,
        shift: s.shift,
        date: s.date.split("T")[0], // optional: show only date
        staffId: s.staffId || "STF001",
      }));

      // Staff-specific filter (agar chahiye)
      const staffSales = mappedData.filter((s) => s.staffId === "STF001");
      setSalesList(staffSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  fetchSales();
}, []);


  const handleAddSale = (data: SaleFormData) => {
    const quantity = data.closingReading - data.openingReading;
    const newSale: Sale = {
      id: `SALE${String(salesList.length + 100).padStart(3, "0")}`,
      nozzleId: data.nozzleId,
      fuelType: data.fuelType,
      openingReading: data.openingReading,
      closingReading: data.closingReading,
      rate: data.rate,
      paymentMode: data.paymentMode,
      customerId: data.customerId,
      quantity: quantity,
      amount: quantity * data.rate,
      shift:
        new Date().getHours() < 14
          ? "morning"
          : new Date().getHours() < 22
            ? "evening"
            : "night",
      date: new Date().toISOString().split("T")[0],
      staffId: "STF001",
    };
    setSalesList([...salesList, newSale]);
  };

  const filteredSales = salesList.filter((sale) => {
    if (filters.date && sale.date !== filters.date) return false;
    if (filters.fuelType !== "all" && sale.fuelType !== filters.fuelType)
      return false;
    if (
      filters.paymentMode !== "all" &&
      sale.paymentMode !== filters.paymentMode
    )
      return false;
    return true;
  });

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
      render: (i: Sale) => `₹${i.amount}`,
    },
    { key: "date", header: "Date" },
  ]

  const fuelTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Premium", label: "Premium" },
  ];

  const paymentModeOptions = [
    { value: "all", label: "All Modes" },
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "upi", label: "UPI" },
  ];

  return (
    <DashboardLayout title="My Sales" requiredRole="staff">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Sales Records
            </h2>
            <p className="text-sm text-muted-foreground">
              Your sales transactions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DownloadButtons sales={filteredSales} variant="dropdown" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-transparent"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <FormInput
                label="Date"
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
              <FormSelect
                label="Fuel Type"
                options={fuelTypeOptions}
                value={filters.fuelType}
                onValueChange={(value) =>
                  setFilters({ ...filters, fuelType: value })
                }
              />
              <FormSelect
                label="Payment Mode"
                options={paymentModeOptions}
                value={filters.paymentMode}
                onValueChange={(value) =>
                  setFilters({ ...filters, paymentMode: value })
                }
              />
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      date: "",
                      fuelType: "all",
                      paymentMode: "all",
                    })
                  }
                  className="w-full bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Sales"
            value={`₹${filteredSales.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}`}
            icon={IndianRupee}
          />
          <SummaryCard
            title="Total Quantity"
            value={`${filteredSales.reduce((sum, s) => sum + s.quantity, 0).toLocaleString()} L`}
            icon={Droplets}
          />
          <SummaryCard
            title="Transactions"
            value={filteredSales.length}
            icon={Receipt}
          />
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <DataTable
            data={filteredSales}
            columns={columns}
            searchPlaceholder="Search sales..."
            searchKeys={["id", "nozzleId", "customerId"]}
            pageSize={5}
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
