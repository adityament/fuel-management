"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTable } from "@/components/ui/data-table";
import type { Stock } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, History, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  AddStockModal,
} from "@/components/forms/add-stock-modal";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface EnrichedStock extends Stock {
  fuelTypeDisplay?: string;
  tankName?: string;
  totalStock: number;
}

interface HistoryRow {
  date: string;
  tank: string;
  fuel: string;
  received: string;
  dip: string;
  calculated: string;
  closing: string;
}

interface CurrentRow {
  tankName: string;
  fuelType: string;
  currentLevel: string;
  capacity: string;
  fillPercent: string;
}

export default function AdminStockPage() {
  const [stocks, setStocks] = useState<EnrichedStock[]>([]);
  const [allRawStocks, setAllRawStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/stocks/getallstocks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: Stock[] = await res.json();
      setAllRawStocks(data);

      // Enrich with tank info
      const enrichedStocks = await Promise.all(
        data.map(async (item) => {
          try {
            if (!item.tankId) return item as EnrichedStock;
            const tankRes = await fetch(
              `${BASE_URL}/api/tanks/tankbyid/${item.tankId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
              }
            );
            if (!tankRes.ok) return item as EnrichedStock;
            const tank = await tankRes.json();
            return {
              ...item,
              tankName: tank.tankName,
              totalStock: tank.capacity,
            } as EnrichedStock;
          } catch (err) {
            console.error("Tank fetch error:", err);
            return item as EnrichedStock;
          }
        })
      );

      // Group by tankId → keep only the latest entry per tank
      const tankMap = new Map<string, EnrichedStock>();

      enrichedStocks.forEach((item) => {
        if (!item.tankId) return;
        const date = new Date(item.updatedAt || item.createdAt || 0);
        const existing = tankMap.get(item.tankId);
        if (!existing || date > new Date(existing.updatedAt || existing.createdAt || 0)) {
          tankMap.set(item.tankId, item);
        }
      });

      const uniqueLatest = Array.from(tankMap.values());

      const formatted = uniqueLatest.map((item) => ({
        ...item,
        fuelTypeDisplay: item.fuelType
          ? item.fuelType.charAt(0).toUpperCase() + item.fuelType.slice(1)
          : "Unknown",
      }));

      setStocks(formatted);
    } catch (err: any) {
      console.error("Stock fetch failed:", err);
      setError(err.message || "Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const totalClosing = stocks.reduce((sum, s) => sum + (s.closingStock || 0), 0);
  const totalCapacity = stocks.reduce((sum, s) => sum + (s.totalStock || 0), 0);
  const fillPercentage =
    totalCapacity > 0 ? ((totalClosing / totalCapacity) * 100).toFixed(1) : "0.0";
  const currentTableData: CurrentRow[] = stocks.map((stock) => {
    const percentage =
      stock.totalStock && stock.totalStock > 0
        ? ((stock.closingStock / stock.totalStock) * 100).toFixed(1) + "%"
        : "0.0%";

    return {
      tankName: stock.tankName || "—",
      fuelType: stock.fuelTypeDisplay || "—",
      currentLevel: (stock.closingStock ?? 0).toLocaleString() + " L",
      capacity: (stock.totalStock ?? 0).toLocaleString() + " L",
      fillPercent: percentage,
    };
  });

  // History table data
  const historyTableData: HistoryRow[] = allRawStocks
    .map((item) => {
      const tankName =
        stocks.find((s) => s.tankId === item.tankId)?.tankName ||
        item.tankId?.slice(0, 8) ||
        "Unknown";

      const fuelDisplay = item.fuelType
        ? item.fuelType.charAt(0).toUpperCase() + item.fuelType.slice(1)
        : "Unknown";

      const date = new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return {
        date,
        tank: tankName,
        fuel: fuelDisplay,
        received: (item.receivedQuantity ?? 0).toLocaleString() + " L",
        dip: (item.dipReading ?? 0).toLocaleString() + " L",
        calculated: (item.calculatedStock ?? 0).toLocaleString() + " L",
        closing: (item.closingStock ?? 0).toLocaleString() + " L",
      };
    })
    .sort((a, b) => {
      // Latest first (we'll sort by date string, but better to use original dates if needed)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <DashboardLayout title="Stock Management" requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="">
          
          <div className="flex flex-col md:flex-row gap-3 justify-end w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="mr-2 h-4 w-4" />
              {showHistory ? "Hide" : "View"} Full Stock History
              {showHistory ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>

            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Stock
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
            <p className="font-medium">Error loading stocks</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center">   <Loader2 className="h-4 w-4 animate-spin" /></div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tanks or stock entries found
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Total Current Level</p>
                <p className="text-2xl font-bold">{totalClosing.toLocaleString()} L</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">{totalCapacity.toLocaleString()} L</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Overall Fill Level</p>
                <p className="text-2xl font-bold text-primary">{fillPercentage}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Active Tanks</p>
                <p className="text-2xl font-bold">{stocks.length}</p>
              </div>
            </div>

            {/* Visual Cards */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
              {stocks.map((stock) => {
                const percentage =
                  stock.totalStock && stock.totalStock > 0
                    ? Math.min(Math.max((stock.closingStock / stock.totalStock) * 100, 0), 100)
                    : 0;

                return (
                  <div
                    key={stock.tankId || stock._id}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-base">
                          {stock.tankName || `Tank ${stock.tankId?.slice(-6) || "Unknown"}`}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {stock.fuelTypeDisplay}
                        </p>
                      </div>
                      <span
                        className={`text-lg font-bold ${
                          stock.fuelType?.includes("petrol")
                            ? "text-chart-1"
                            : stock.fuelType?.includes("diesel")
                            ? "text-chart-2"
                            : "text-chart-4"
                        }`}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-5 rounded-full bg-muted overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          stock.fuelType?.includes("petrol")
                            ? "bg-chart-1"
                            : stock.fuelType?.includes("diesel")
                            ? "bg-chart-2"
                            : "bg-chart-4"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Current Level</p>
                        <p className="font-medium">
                          {(stock.closingStock ?? 0).toLocaleString()} L
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Capacity</p>
                        <p className="font-medium">
                          {(stock.totalStock ?? 0).toLocaleString()} L
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Tank Status Table */}
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <h3 className="text-md font-semibold mb-4">Current Tank Status</h3>
              <DataTable
                data={currentTableData}
                columns={[
                  { key: "tankName", header: "Tank Name" },
                  {
                    key: "fuelType",
                    header: "Fuel Type",
                    render: (item: CurrentRow) => (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.fuelType.includes("Petrol")
                            ? "bg-chart-1/10 text-chart-1"
                            : item.fuelType.includes("Diesel")
                            ? "bg-chart-2/10 text-chart-2"
                            : "bg-chart-4/10 text-chart-4"
                        }`}
                      >
                        {item.fuelType}
                      </span>
                    ),
                  },
                  { key: "currentLevel", header: "Current Level" },
                  { key: "capacity", header: "Capacity" },
                  { key: "fillPercent", header: "Fill %" },
                ]}
                searchPlaceholder="Search current status..."
                searchKeys={["fuelType", "tankName"]}
                pageSize={5}
              />
            </div>

            {/* Full History Section */}
            {showHistory && (
              <div className="rounded-xl border border-border bg-card p-4 md:p-6 mt-6">
                <h3 className="text-md font-semibold mb-4">Full Stock History (All Entries)</h3>
                <DataTable
                  data={historyTableData}
                  columns={[
                    { key: "date", header: "Date / Time" },
                    { key: "tank", header: "Tank" },
                    { key: "fuel", header: "Fuel" },
                    { key: "received", header: "Received" },
                    { key: "dip", header: "Dip Reading" },
                    { key: "calculated", header: "Calculated" },
                    { key: "closing", header: "Closing Level" },
                  ]}
                  searchPlaceholder="Search history..."
                  searchKeys={["fuel", "tank", "date"]}
                  pageSize={10}
                />
              </div>
            )}
          </>
        )}
      </div>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchStocks();
        }}
      />
    </DashboardLayout>
  );
}