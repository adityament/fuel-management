"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, MapPin } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

interface Attendance {
  _id: string
  employeeId: string
  action: "checkin" | "checkout"
  latitude?: number
  longitude?: number
  notes?: string
  timeIn: string
  date: string
}

export default function StaffAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [notes, setNotes] = useState("Morning shift")
  const [loading, setLoading] = useState(false)

  /* ================= GET ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
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
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  /* ================= LIVE LOCATION ================= */
  const getLiveLocation = (): Promise<{
    latitude: number
    longitude: number
  }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        reject
      )
    })
  }

  /* ================= CHECK-IN ================= */
  const handleCheckIn = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const location = await getLiveLocation()

      await fetch(`${BASE_URL}/api/attendance/markattendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "checkin",
          latitude: location.latitude,
          longitude: location.longitude,
          notes,
        }),
      })

      fetchAttendance()
    } catch (err) {
      alert("Location access denied")
    } finally {
      setLoading(false)
    }
  }

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      key: "date",
      header: "Date",
      render: (item: Attendance) =>
        new Date(item.date).toLocaleDateString(),
    },
    {
      key: "timeIn",
      header: "Check-in Time",
      render: (item: Attendance) =>
        new Date(item.timeIn).toLocaleTimeString(),
    },
    {
      key: "action",
      header: "Action",
      render: (item: Attendance) => (
        <span className="capitalize">{item.action}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item: Attendance) =>
        item.latitude && item.longitude ? (
          <span className="text-xs">
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (item: Attendance) => item.notes || "-",
    },
  ]

  return (
    <DashboardLayout title="Attendance" requiredRole="staff">
      <div className="space-y-6">
        {/* CHECK-IN CARD */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Attendance Check-in
          </h2>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Live location will be captured
          </div>

          <div className="mb-4">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleCheckIn} disabled={loading}>
            <Clock className="mr-2 h-4 w-4" />
            {loading ? "Checking in..." : "Check In"}
          </Button>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Attendance History
          </h3>
          <DataTable data={records} columns={columns} />
        </div>
      </div>
    </DashboardLayout>
  )
}
