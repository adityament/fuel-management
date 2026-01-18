"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { AddStaffModal, type StaffFormData } from "@/components/forms/add-staff-modal"
import type { Staff } from "@/lib/types"
import { Plus } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

export default function AdminStaffPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)

  /* =========================
     FETCH STAFF LIST
  ========================== */
  const fetchStaff = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        console.error(data.message || "Failed to fetch staff")
        return
      }

      // API ➜ Table format
      const formatted: Staff[] = data.map((item: any) => ({
        id: item._id,
        username: item.username,
        email: item.email,
        phone: item.phone,
      }))

      setStaffList(formatted)
    } catch (err) {
      console.error("Server error")
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     INITIAL LOAD
  ========================== */
  useEffect(() => {
    fetchStaff()
  }, [])

  /* =========================
     ADD STAFF (AFTER MODAL)
  ========================== */
  const handleAddStaff = (data: StaffFormData) => {
    // staff create API modal me already hit ho rahi hogi
    // isliye sirf list refresh
    fetchStaff()
  }

  const columns = [
    { key: "id", header: "Staff ID" },
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "status",
      header: "Status",
      render: () => (
        <span className="inline-flex items-center rounded-full bg-chart-2/10 px-2.5 py-0.5 text-xs font-medium text-chart-2">
          Active
        </span>
      ),
    },
  ]

  return (
    <DashboardLayout title="Staff Management" requiredRole="admin">
      <div className="space-y-6">

        {/* Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Staff Members</h2>
            <p className="text-sm text-muted-foreground">Manage your pump staff</p>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-2xl font-bold text-card-foreground">
              {staffList.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">On Duty Today</p>
            <p className="text-2xl font-bold text-card-foreground">3</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Off Duty</p>
            <p className="text-2xl font-bold text-card-foreground">
              {Math.max(staffList.length - 3, 0)}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <DataTable
            data={staffList}
            columns={columns}
            searchPlaceholder="Search staff..."
            searchKeys={["username", "email", "phone"]}
            pageSize={5}
            loading={loading}
          />
        </div>
      </div>

      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStaff}
      />
    </DashboardLayout>
  )
}
