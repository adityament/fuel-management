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
  timeOut?: string
  date: string
  workedHours: number;
}

export default function StaffAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [activeAttendance, setActiveAttendance] = useState<Attendance | null>(null)
  const [notes, setNotes] = useState("Morning shift")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BASE_URL}/api/attendance/getattendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.data || []

      setRecords(list)
      const latest = list[0]
      if (latest && !latest.timeOut) {
        setActiveAttendance(latest)
      } else {
        setActiveAttendance(null)
      }
    } catch (err) {
      console.error("Attendance fetch error", err)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])
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

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeAttendance) {
      interval = setInterval(() => {
        const start = new Date(activeAttendance.timeIn).getTime()
        const now = Date.now()
        setTimer(Math.floor((now - start) / 1000))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [activeAttendance])

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }
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
  const handleCheckOut = async () => {
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
          action: "checkout",
          latitude: location.latitude,
          longitude: location.longitude,
          notes: "Ending shift",
        }),
      })

      setActiveAttendance(null)
      setTimer(0)
      fetchAttendance()
    } catch (err) {
      alert("Checkout failed")
    } finally {
      setLoading(false)
    }
  }
const formatWorkedHours = (hours?: number) => {
  if (!hours) return "-"
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

 const columns = [
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
    key: "notes",
    header: "Notes",
    render: (item: Attendance) => item.notes || "-",
  },
]


  return (
    <DashboardLayout title="Attendance" requiredRole="staff">
      <div className="space-y-6">
        {/* CHECK-IN / CHECK-OUT CARD */}
        <div className="rounded-xl border bg-card p-6 md:w-125 w-full">
          <h2 className="text-lg font-semibold mb-4">
            Attendance
          </h2>

          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Live location will be captured
          </div>

          {!activeAttendance && (
            <div className="mb-4">
              <Label className="mb-2">Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}

          {activeAttendance ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                ⏱ Working Time: <b>{formatTime(timer)}</b>
              </div>

              <Button
                variant="destructive"
                onClick={handleCheckOut}
                disabled={loading}
              >
                Check Out
              </Button>
            </div>
          ) : (
            <Button onClick={handleCheckIn} disabled={loading}>
              <Clock className="mr-2 h-4 w-4" />
              {loading ? "Checking in..." : "Check In"}
            </Button>
          )}
        </div>

        {/* HISTORY */}
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
