"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { attendanceRecords } from "@/lib/dummy-data"
import type { Attendance } from "@/lib/types"

export default function AdminAttendancePage() {
  const columns = [
    { key: "username", header: "Username" },
    { key: "checkInTime", header: "Check-in Time" },
    {
      key: "logoutTime",
      header: "Logout Time",
      render: (item: Attendance) => item.logoutTime || "-",
    },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (item: Attendance) =>
        item.logoutTime ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-chart-2/10 px-2.5 py-0.5 text-xs font-medium text-chart-2">
            On Duty
          </span>
        ),
    },
    {
      key: "location",
      header: "Location",
      render: (item: Attendance) => (
        <span className="text-xs text-muted-foreground">
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (item: Attendance) => item.notes || "-",
    },
  ]

  const todayAttendance = attendanceRecords.filter((r) => r.date === "2026-01-16")
  const onDuty = todayAttendance.filter((r) => !r.logoutTime).length

  return (
    <DashboardLayout title="Attendance" requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Attendance Records</h2>
          <p className="text-sm text-muted-foreground">Track staff check-in and logout times</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold text-card-foreground">{attendanceRecords.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Today&apos;s Check-ins</p>
            <p className="text-2xl font-bold text-card-foreground">{todayAttendance.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Currently On Duty</p>
            <p className="text-2xl font-bold text-chart-2">{onDuty}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Completed Shifts</p>
            <p className="text-2xl font-bold text-card-foreground">{todayAttendance.length - onDuty}</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <DataTable
            data={attendanceRecords}
            columns={columns}
            searchPlaceholder="Search attendance..."
            searchKeys={["username"]}
            pageSize={5}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
