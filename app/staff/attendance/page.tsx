"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { attendanceRecords as initialRecords } from "@/lib/dummy-data"
import type { Attendance } from "@/lib/types"
import { MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function StaffAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>(initialRecords.filter((r) => r.staffId === "STF001"))
  const [isCheckedIn, setIsCheckedIn] = useState(true) // Simulating already checked in
  const [notes, setNotes] = useState("Morning shift")
  const [locationStatus, setLocationStatus] = useState<"checking" | "valid" | "invalid">("valid")

  // Static location data
  const currentLocation = {
    latitude: 25.123456,
    longitude: 84.654321,
  }

  const pumpLocation = {
    latitude: 25.123456,
    longitude: 84.654321,
    radius: 150,
  }

  const handleCheckIn = () => {
    setLocationStatus("checking")

    // Simulate location check
    setTimeout(() => {
      setLocationStatus("valid")

      const newRecord: Attendance = {
        id: `ATT${String(records.length + 100).padStart(3, "0")}`,
        staffId: "STF001",
        username: "Staff One",
        checkInTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        notes: notes,
        date: new Date().toISOString().split("T")[0],
      }

      setRecords([newRecord, ...records])
      setIsCheckedIn(true)
    }, 1500)
  }

  const handleCheckOut = () => {
    // Update the latest record with logout time
    const updatedRecords = records.map((r, idx) =>
      idx === 0 && !r.logoutTime
        ? { ...r, logoutTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
        : r,
    )
    setRecords(updatedRecords)
    setIsCheckedIn(false)
  }

  const columns = [
    { key: "date", header: "Date" },
    { key: "checkInTime", header: "Check-in" },
    {
      key: "logoutTime",
      header: "Logout",
      render: (item: Attendance) => item.logoutTime || "-",
    },
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

  return (
    <DashboardLayout title="Attendance" requiredRole="staff">
      <div className="space-y-6">
        {/* Check-in Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Attendance Check-in</h2>

          {/* Location Status */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Current Location</p>
                <p className="text-xs text-muted-foreground">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {locationStatus === "checking" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">Verifying location...</span>
                </>
              ) : locationStatus === "valid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-chart-2" />
                  <span className="text-sm text-chart-2">Within pump radius ({pumpLocation.radius}m)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Outside pump radius</span>
                </>
              )}
            </div>
          </div>

          {/* Notes Input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="notes">Shift Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Morning shift"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                disabled={locationStatus === "checking" || locationStatus === "invalid"}
                className="flex-1"
              >
                <Clock className="mr-2 h-4 w-4" />
                Check In
              </Button>
            ) : (
              <Button onClick={handleCheckOut} variant="outline" className="flex-1 bg-transparent">
                <Clock className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            )}
          </div>

          {/* Current Status */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Status</span>
              {isCheckedIn ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-chart-2">
                  <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
                  On Duty
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  Off Duty
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">My Attendance History</h3>
          <DataTable
            data={records}
            columns={columns}
            searchPlaceholder="Search records..."
            searchKeys={["date", "notes"]}
            pageSize={5}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
