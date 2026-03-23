"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  IndianRupee,
  Calendar,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { format, startOfMonth, startOfWeek, endOfDay, startOfDay } from "date-fns";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface Expense {
  _id: string;
  name: string;
  amount: number;
  createdAt: string;
  status: "paid" | "unpaid";
}

interface OnlineEntry {
  _id: string;
  totalSale: number;
  onlinePayment: number;
  createdAt: string;
}

// Reusable Total Card
const TotalCard = ({
  title,
  amount,
  color = "default",
}: {
  title: string;
  amount: number;
  color?: "default" | "green" | "orange";
}) => (
  <div className="rounded-xl border bg-card p-5 text-center shadow-sm transition-all hover:shadow">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p
      className={`mt-1 text-2xl font-bold ${
        color === "green"
          ? "text-green-600 dark:text-green-400"
          : color === "orange"
          ? "text-orange-600 dark:text-orange-400"
          : ""
      }`}
    >
      ₹{amount.toLocaleString("en-IN")}
    </p>
  </div>
);

// Expense Item Component
const ExpenseItem = ({
  exp,
  onEdit,
  onDelete,
}: {
  exp: Expense;
  onEdit: (exp: Expense) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between transition-colors">
    <div className="flex-1">
      <p className="font-medium">{exp.name}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {format(new Date(exp.createdAt), "dd MMM yyyy • hh:mm a")}
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-6">
      <p className="text-lg font-semibold tabular-nums">
        ₹{exp.amount.toLocaleString("en-IN")}
      </p>

      <div className="flex items-center gap-2">
        {exp.status === "paid" ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <CircleDashed className="h-5 w-5 text-orange-600" />
        )}
        <span
          className={`text-sm font-medium capitalize hidden sm:block ${
            exp.status === "paid" ? "text-green-600" : "text-orange-600"
          }`}
        >
          {exp.status}
        </span>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(exp)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(exp._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default function ExpensesPage() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [onlineEntries, setOnlineEntries] = useState<OnlineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState<
    "all" | "today" | "yesterday" | "this-week" | "this-month" | "custom"
  >("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Expense Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"paid" | "unpaid">("unpaid");
  const [submitting, setSubmitting] = useState(false);

  // Online Modal
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);
  const [onlineTotalSale, setOnlineTotalSale] = useState("");
  const [onlinePaymentAmt, setOnlinePaymentAmt] = useState("");

  // ── Fetch Expenses ──
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/expenses/getall`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setAllExpenses(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch Online Entries ──
  const fetchOnlineEntries = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/online/getall`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch online entries");
      const data = await res.json();
      setOnlineEntries(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load online entries");
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchOnlineEntries();
  }, [fetchExpenses, fetchOnlineEntries]);

  // ── Filtered Expenses ──
  const filteredExpenses = useMemo(() => {
    if (filterType === "all") return allExpenses;

    const now = new Date();
    let start: Date | null = null;
    let end = endOfDay(now);

    if (filterType === "today") start = startOfDay(now);
    else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      start = startOfDay(yesterday);
      end = endOfDay(yesterday);
    } else if (filterType === "this-week") {
      start = startOfWeek(now, { weekStartsOn: 1 });
    } else if (filterType === "this-month") {
      start = startOfMonth(now);
    } else if (filterType === "custom" && customStart && customEnd) {
      start = new Date(customStart);
      end = endOfDay(new Date(customEnd));
    }

    if (!start) return allExpenses;

    return allExpenses.filter((exp) => {
      const expDate = new Date(exp.createdAt);
      return expDate >= start && expDate <= end;
    });
  }, [allExpenses, filterType, customStart, customEnd]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );
  const totalPaid = useMemo(
    () =>
      filteredExpenses
        .filter((exp) => exp.status === "paid")
        .reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );
  const totalUnpaid = useMemo(
    () =>
      filteredExpenses
        .filter((exp) => exp.status === "unpaid")
        .reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );

  const totalSales = useMemo(
    () => onlineEntries.reduce((sum, e) => sum + e.totalSale, 0),
    [onlineEntries]
  );
  const totalOnlineReceived = useMemo(
    () => onlineEntries.reduce((sum, e) => sum + e.onlinePayment, 0),
    [onlineEntries]
  );

  // ── Handlers ──
  const openAddExpense = () => {
    setIsEditMode(false);
    setEditingId(null);
    setName("");
    setAmount("");
    setStatus("unpaid");
    setModalOpen(true);
  };

  const openEditExpense = (exp: Expense) => {
    setIsEditMode(true);
    setEditingId(exp._id);
    setName(exp.name);
    setAmount(exp.amount.toString());
    setStatus(exp.status);
    setModalOpen(true);
  };

  const handleSaveExpense = async () => {
    const amountNum = Number(amount);
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter valid values");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      amount: amountNum,
      status,
    };

    try {
      const url = isEditMode
        ? `${BASE_URL}/api/expenses/updateexpense/${editingId}`
        : `${BASE_URL}/api/expenses/create`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      toast.success(
        isEditMode ? "Expense updated" : "Expense added successfully"
      );

      if (isEditMode) {
        setAllExpenses((prev) =>
          prev.map((e) => (e._id === editingId ? { ...e, ...payload } : e))
        );
      } else {
        setAllExpenses((prev) => [data.expense, ...prev]);
      }

      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/deleteexpense/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }
      toast.success("Expense deleted");
      setAllExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleAddOnline = async () => {
    const totalSaleNum = Number(onlineTotalSale);
    const onlineNum = Number(onlinePaymentAmt);

    if (
      isNaN(totalSaleNum) ||
      totalSaleNum <= 0 ||
      isNaN(onlineNum) ||
      onlineNum < 0 ||
      onlineNum > totalSaleNum
    ) {
      toast.error("Please enter valid values");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/online/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          totalSale: totalSaleNum,
          onlinePayment: onlineNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add online entry");
      }

      setOnlineEntries((prev) => [data.entry, ...prev]);
      toast.success("Online entry added successfully");
      setOnlineModalOpen(false);
      setOnlineTotalSale("");
      setOnlinePaymentAmt("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const resetCustomFilter = () => {
    setCustomStart("");
    setCustomEnd("");
    setFilterType("all");
  };

  return (
    <DashboardLayout title="My Expenses & Online" requiredRole="admin">
      <div className="space-y-6 pb-3">
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-muted p-1 mb-2">
            <TabsTrigger
              value="expenses"
              className="rounded-lg data-[state=active]:bg-[#E46212] data-[state=active]:text-[#ffffff] data-[state=active]:shadow-sm"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="online"
              className="rounded-lg data-[state=active]:bg-[#E46212] data-[state=active]:text-[#ffffff] data-[state=active]:shadow-sm"
            >
              Online Payments
            </TabsTrigger>
          </TabsList>

          {/* ── EXPENSES TAB ── */}
          <TabsContent value="expenses" className="space-y-6 mt-2 focus-visible:outline-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
                <p className="text-muted-foreground">Track daily & monthly kharcha</p>
              </div>
              <Button onClick={openAddExpense} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <TotalCard title="Total Amount" amount={totalAmount} />
              <TotalCard title="Total Paid" amount={totalPaid} color="green" />
              <TotalCard title="Total Unpaid" amount={totalUnpaid} color="orange" />
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                <div className="w-full sm:w-48">
                  <Label className="mb-2">Filter Period</Label>
                  <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filterType === "custom" && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div>
                      <Label className="mb-2">From</Label>
                      <Input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-2">To</Label>
                      <Input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetCustomFilter}
                      className="mt-6 sm:mt-8"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading...</div>
              ) : filteredExpenses.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No expenses in this period
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenses.map((exp) => (
                    <ExpenseItem
                      key={exp._id}
                      exp={exp}
                      onEdit={openEditExpense}
                      onDelete={handleDeleteExpense}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── ONLINE TAB ── */}
          <TabsContent value="online" className="space-y-6 mt-2 focus-visible:outline-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Online Payments</h2>
                <p className="text-muted-foreground">Track online payments</p>
              </div>
              <Button onClick={() => setOnlineModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TotalCard title="Total Sales" amount={totalSales} />
              <TotalCard title="Online Received" amount={totalOnlineReceived} color="green" />
            </div>

            <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
              {onlineEntries.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  There are no online entries
                </div>
              ) : (
                <div className="space-y-3">
                  {onlineEntries.map((entry) => {
                    const cash = entry.totalSale - entry.onlinePayment;
                    return (
                      <div
                        key={entry._id}
                        className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">Sales Entry</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(entry.createdAt), "dd MMM yyyy • hh:mm a")}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 justify-between sm:justify-end">
                          <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-lg font-semibold">
                              ₹{entry.totalSale.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Online</p>
                            <p className="text-lg font-semibold text-green-600">
                              ₹{entry.onlinePayment.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cash</p>
                            <p className="text-lg font-semibold">
                              ₹{cash.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Expense Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Purpose / Name</Label>
              <Input
                placeholder="Fuel / Stationery / Lunch"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="1250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExpense} disabled={submitting}>
              {submitting ? "Saving..." : isEditMode ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Online Modal */}
      <Dialog open={onlineModalOpen} onOpenChange={setOnlineModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Online Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Total Sale (₹)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={onlineTotalSale}
                onChange={(e) => setOnlineTotalSale(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Online Received (₹)</Label>
              <Input
                type="number"
                placeholder="3200"
                value={onlinePaymentAmt}
                onChange={(e) => setOnlinePaymentAmt(e.target.value)}
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOnlineModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOnline} disabled={submitting}>
              {submitting ? "Saving..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}