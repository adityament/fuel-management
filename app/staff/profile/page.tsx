"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, User, Briefcase, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function StaffProfilePage() {
  const { user, token } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill both fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/password/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
       toast.error(data.message || "Failed to create admin")
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Profile" requiredRole="staff">
      <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Profile Header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user?.username?.charAt(0) ?? "S"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {user?.username}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">
                {user?.role}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Update Your Password
          </h3>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordUpdate();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Old Password */}
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex md:justify-start">
                <Button
                  type="submit"
                  disabled={loading}
                  className={loading ? "opacity-70 cursor-not-allowed" : ""}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </form>
        </div>
       </div>

        {/* Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Staff ID</p>
                  <p className="font-medium text-card-foreground">STF001</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium text-card-foreground">
                    {user?.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-card-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-card-foreground">
                    {user?.phone || "7777777777"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium text-card-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form + Update Password */}

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Update Profile
            </h3>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    defaultValue={user?.phone || "7777777777"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <Button
                type="button"
                onClick={() => alert("Profile updated (static demo)")}
              >
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
