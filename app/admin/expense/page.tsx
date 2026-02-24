"use client";

import { useState, useMemo, useEffect } from "react";
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

export default function ExpensesPage() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState<
    "all" | "today" | "yesterday" | "this-week" | "this-month" | "custom"
  >("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"paid" | "unpaid">("unpaid");
  const [submitting, setSubmitting] = useState(false);

  // ────────────────────────────────────────────────
  // Fetch all expenses on mount
  // ────────────────────────────────────────────────
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/expenses/getall`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // adjust if you use different token storage
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await res.json();
      setAllExpenses(data || []);
    } catch (err) {
      console.error("Fetch expenses error:", err);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ────────────────────────────────────────────────
  // Filtered expenses (client-side filter)
  // ────────────────────────────────────────────────
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date = endOfDay(now);

    if (filterType === "today") {
      start = startOfDay(now);
    } else if (filterType === "yesterday") {
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
      return expDate >= start! && expDate <= end;
    });
  }, [allExpenses, filterType, customStart, customEnd]);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPaid = filteredExpenses
    .filter((exp) => exp.status === "paid")
    .reduce((sum, exp) => sum + exp.amount, 0);
  const totalUnpaid = filteredExpenses
    .filter((exp) => exp.status === "unpaid")
    .reduce((sum, exp) => sum + exp.amount, 0);

  // ────────────────────────────────────────────────
  // Add new expense
  // ────────────────────────────────────────────────
  const handleAddExpense = async () => {
    const amountNum = Number(amount);
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter valid name and amount");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: amountNum,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add expense");
      }

      toast.success("Expense added successfully");
      setAllExpenses((prev) => [data.expense, ...prev]); // optimistic update
      setModalOpen(false);
      setName("");
      setAmount("");
      setStatus("unpaid");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  // Update expense
  // ────────────────────────────────────────────────
  const handleUpdateExpense = async () => {
    const amountNum = Number(amount);
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter valid name and amount");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/updateexpense/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: amountNum,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update expense");
      }

      toast.success("Expense updated successfully");
      setAllExpenses((prev) =>
        prev.map((exp) =>
          exp._id === editingId ? { ...exp, name: name.trim(), amount: amountNum, status } : exp
        )
      );
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  // Delete expense
  // ────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/deleteexpense/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }

      toast.success("Expense deleted successfully");
      setAllExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete expense");
    }
  };

  // ────────────────────────────────────────────────
  // Modal handlers
  // ────────────────────────────────────────────────
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setName("");
    setAmount("");
    setStatus("unpaid");
    setModalOpen(true);
  };

  const openEditModal = (exp: Expense) => {
    setIsEditMode(true);
    setEditingId(exp._id);
    setName(exp.name);
    setAmount(exp.amount.toString());
    setStatus(exp.status);
    setModalOpen(true);
  };

  const handleSaveExpense = () => {
    if (isEditMode) {
      handleUpdateExpense();
    } else {
      handleAddExpense();
    }
  };

  const resetCustomDates = () => {
    setCustomStart("");
    setCustomEnd("");
    setFilterType("all");
  };

  return (
    <DashboardLayout title="My Expenses" requiredRole="admin">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between overflow-hidden">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
            <p className="text-muted-foreground">
              Track your daily and monthly expenses
            </p>
          </div>

          <Button onClick={openAddModal} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="mt-1 text-2xl font-bold">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">Total Unpaid</p>
            <p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
              ₹{totalUnpaid.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="w-full sm:w-48">
              <Label className="mb-2">Filter Period</Label>
              <Select
                value={filterType}
                onValueChange={(v) =>
                  setFilterType(
                    v as
                      | "all"
                      | "today"
                      | "yesterday"
                      | "this-week"
                      | "this-month"
                      | "custom"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
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
                <div className="w-full sm:w-auto">
                  <Label className="mb-2">From Date</Label>
                  <Input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Label className="mb-2">To Date</Label>
                  <Input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetCustomDates}
                  className="mt-6 sm:mt-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading expenses...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No expenses found in the selected date range
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((exp) => (
                <div
                  key={exp._id}
                  className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium">{exp.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(exp.createdAt), "dd MMM yyyy • hh:mm a")}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:gap-6">
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
                        className={`text-sm font-medium capitalize ${
                          exp.status === "paid" ? "text-green-600" : "text-orange-600"
                        } hidden sm:block`}
                      >
                        {exp.status}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(exp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(exp._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Add / Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Expense Name / Purpose</Label>
              <Input
                placeholder="Office stationery / Fuel / Lunch"
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
              <Label>Payment Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "paid" | "unpaid")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
            <Button onClick={handleSaveExpense} disabled={submitting || loading}>
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Expense"
                : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}