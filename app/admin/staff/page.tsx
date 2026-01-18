"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { AddStaffModal, type StaffFormData } from "@/components/forms/add-staff-modal"
import { staffMembers as initialStaff } from "@/lib/dummy-data"
import type { Staff } from "@/lib/types"
import { Plus } from "lucide-react"

export default function AdminStaffPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff)

  const handleAddStaff = (data: StaffFormData) => {
    const newStaff: Staff = {
      id: `STF${String(staffList.length + 1).padStart(3, "0")}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
    }
    setStaffList([...staffList, newStaff])
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
            <p className="text-2xl font-bold text-card-foreground">{staffList.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">On Duty Today</p>
            <p className="text-2xl font-bold text-card-foreground">3</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Off Duty</p>
            <p className="text-2xl font-bold text-card-foreground">{staffList.length - 3}</p>
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
          />
        </div>
      </div>

      <AddStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddStaff} />
    </DashboardLayout>
  )
}
