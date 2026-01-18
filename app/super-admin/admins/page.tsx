"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { AddAdminModal, type AdminFormData } from "@/components/forms/add-admin-modal"
import type { Admin } from "@/lib/types"
import { Plus, FileText, FileSpreadsheet } from "lucide-react"

export default function AdminManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [adminList, setAdminList] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

const fetchAdmins = async () => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
    if (!BASE_URL) {
      alert("Backend URL missing")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Token missing, please login again")
      return
    }

    const res = await fetch(`${BASE_URL}/api/listadmin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Failed to fetch admins")
      return
    }

    const admins = data.map((item: any) => ({
      id: item._id,
      username: item.username,
      email: item.email,
      phone: item.phone || "-",
      role: item.role,
      latitude: item.location?.latitude || 0,
      longitude: item.location?.longitude || 0,
      radius: item.location?.radius || 0,
    }))

    setAdminList(admins)
  } catch (err) {
    console.error(err)
    alert("Server not reachable")
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = (data: AdminFormData) => {
    const newAdmin: Admin = {
      id: `ADM${String(adminList.length + 1).padStart(3, "0")}`,
      username: data.username,
      email: data.email,
      phone: data.phone,
      role: "admin",
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
    }
    setAdminList([...adminList, newAdmin])
  }

  const handleDownloadPDF = () => {
    alert("PDF download initiated (static demo)")
  }

  const handleDownloadExcel = () => {
    alert("Excel download initiated (static demo)")
  }

  const columns = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "role",
      header: "Role",
      render: (item: Admin) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
          {item.role}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item: Admin) => (
        <span className="text-xs text-muted-foreground">
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </span>
      ),
    },
    {
      key: "radius",
      header: "Radius",
      render: (item: Admin) => <span>{item.radius}m</span>,
    },
  ]

  return (
    <DashboardLayout title="Admin Management" requiredRole="super-admin">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Admins</h2>
            <p className="text-sm text-muted-foreground">Manage pump administrators and their locations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="bg-transparent">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadExcel} className="bg-transparent">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading admins...</p>
          ) : (
            <DataTable
              data={adminList}
              columns={columns}
              searchPlaceholder="Search admins..."
              searchKeys={["username", "email", "phone"]}
              pageSize={5}
            />
          )}
        </div>
      </div>

      <AddAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddAdmin} />
    </DashboardLayout>
  )
}
