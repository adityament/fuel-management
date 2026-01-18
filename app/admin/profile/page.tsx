"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Mail, Phone, User } from "lucide-react"

export default function AdminProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout title="My Profile" requiredRole="admin">
      <div className="max-w-2xl space-y-6">
        {/* Profile Header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{user?.username?.charAt(0) ?? "A"}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{user?.username}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role?.replace("-", " ")}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium text-card-foreground">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-card-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-card-foreground">{user?.phone || "9876543210"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Pump Location</p>
                <p className="font-medium text-card-foreground">
                  {user?.latitude?.toFixed(4) || "25.1235"}, {user?.longitude?.toFixed(4) || "84.6543"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Update Profile</h3>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user?.username} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={user?.phone || "9876543210"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" placeholder="Leave blank to keep current" />
            </div>
            <Button type="button" onClick={() => alert("Profile updated (static demo)")}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
