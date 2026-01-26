"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

/* ================= TYPES ================= */
interface Attendance {
  _id: string
  employeeId: {
    _id: string
    username: string
  }
  date: string
  timeIn: string
  timeOut?: string
  workedHours?: number
  latitude: number
  longitude: number
  notes?: string
}

/* ================= COMPONENT ================= */
export default function AdminAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  /* ================= FETCH ================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const res = await fetch(`${BASE_URL}/api/attendance/getattendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setRecords(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      console.error("Attendance fetch error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  /* ================= HELPERS ================= */
  const formatWorkedHours = (hours?: number) => {
    if (!hours) return "-"
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  /* ================= DATE FILTER ================= */
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const recordDate = new Date(r.date).toISOString().split("T")[0]
      if (fromDate && recordDate < fromDate) return false
      if (toDate && recordDate > toDate) return false
      return true
    })
  }, [records, fromDate, toDate])

  /* ================= STATS ================= */
  const today = new Date().toLocaleDateString()

  const todayAttendance = filteredRecords.filter(
    (r) => new Date(r.date).toLocaleDateString() === today
  )

  const onDuty = todayAttendance.filter((r) => !r.timeOut).length

  /* ================= TOTAL HOURS PER EMPLOYEE ================= */
  const totalHoursPerEmployee = useMemo(() => {
    return filteredRecords.reduce((acc, r) => {
      if (!r.workedHours) return acc
      const name = r.employeeId.username
      acc[name] = (acc[name] || 0) + r.workedHours
      return acc
    }, {} as Record<string, number>)
  }, [filteredRecords])

  /* ================= CSV EXPORT ================= */
  const exportCSV = () => {
    const headers = [
      "Employee",
      "Date",
      "Check-in",
      "Check-out",
      "Worked Hours",
      "Notes",
    ]

    const rows = filteredRecords.map((r) => [
      r.employeeId.username,
      new Date(r.date).toLocaleDateString(),
      new Date(r.timeIn).toLocaleTimeString(),
      r.timeOut ? new Date(r.timeOut).toLocaleTimeString() : "-",
      r.workedHours ?? "-",
      r.notes ?? "",
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.join(",") + "\n"
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "attendance.csv"
    a.click()
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (item: Attendance) => item.employeeId.username,
    },
    {
      key: "date",
      header: "Date",
      render: (item: Attendance) =>
        new Date(item.date).toLocaleDateString(),
    },
    {
      key: "timeIn",
      header: "Check-in",
      render: (item: Attendance) =>
        new Date(item.timeIn).toLocaleTimeString(),
    },
    {
      key: "timeOut",
      header: "Check-out",
      render: (item: Attendance) =>
        item.timeOut
          ? new Date(item.timeOut).toLocaleTimeString()
          : "-",
    },
    {
      key: "workedHours",
      header: "Worked Hours",
      render: (item: Attendance) =>
        formatWorkedHours(item.workedHours),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Attendance) =>
        item.timeOut ? (
          <span className="rounded-full bg-muted px-2 py-1 text-xs">
            Completed
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
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

  /* ================= UI ================= */
  return (
    <DashboardLayout title="Attendance" requiredRole="admin">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold">Attendance Records</h2>
          <p className="text-sm text-muted-foreground">
            Track staff attendance, hours & reports
          </p>
        </div>

        {/* Filters + Export */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <Button onClick={exportCSV}>Export CSV / Excel</Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold">{filteredRecords.length}</p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Today&apos;s Check-ins</p>
            <p className="text-2xl font-bold">{todayAttendance.length}</p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Currently On Duty</p>
            <p className="text-2xl font-bold text-green-600">{onDuty}</p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Completed Shifts</p>
            <p className="text-2xl font-bold">
              {todayAttendance.length - onDuty}
            </p>
          </div>
        </div>

        {/* Total Hours Per Employee */}
        

        {/* Table */}
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <DataTable
            data={filteredRecords}
            columns={columns}
            searchPlaceholder="Search by employee name..."
            searchKeys={["employeeId.username"]}
            pageSize={8}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
