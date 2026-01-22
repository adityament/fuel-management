"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, User, EyeOff, Eye } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function AdminProfilePage() {
  const { user, token } = useAuth();

  /* ================= PASSWORD STATES (UNCHANGED) ================= */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  /* ================= PROFILE SINGLE STATE ================= */
  const [profile, setProfile] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    location: {
      latitude: user?.location?.latitude || "",
      longitude: user?.location?.longitude || "",
      radius: user?.location?.radius || 100,
    },
  });

  const [profileLoading, setProfileLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  /* ================= PASSWORD UPDATE (UNCHANGED) ================= */
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
        toast.error(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PROFILE UPDATE ================= */
  const handleProfileUpdate = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          phone: profile.phone,
          location: {
            latitude: Number(profile.location.latitude),
            longitude: Number(profile.location.longitude),
            radius: Number(profile.location.radius),
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Profile" requiredRole="admin">
      <div className="grid grid-cols-1 space-y-6">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 min-[1240px]:grid-cols-2 gap-6">

          {/* Profile Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user?.username?.charAt(0) ?? "A"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Update Password */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              Update Your Password
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordUpdate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                <div className="space-y-2">
                  <Label>Old Password</Label>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= BOTTOM GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profile Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>

            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center items-center">
                <User size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p>{user?.username}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center ">
                <Mail size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center">
                <Phone size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{profile.phone || "-"}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center">
                <MapPin size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Pump Location</p>
                  <p>
                    {profile.location.latitude || "-"},{" "}
                    {profile.location.longitude || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Update Profile */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">Username</Label>
                <Input
                  value={profile.username}
                  onChange={(e) =>
                    handleChange("username", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="mb-2">Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2">Latitude</Label>
                  <Input
                    value={profile.location.latitude}
                    onChange={(e) =>
                      handleLocationChange("latitude", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2">Longitude</Label>
                  <Input
                    value={profile.location.longitude}
                    onChange={(e) =>
                      handleLocationChange("longitude", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2">Radius (m)</Label>
                  <Input
                    value={profile.location.radius}
                    onChange={(e) =>
                      handleLocationChange("radius", e.target.value)
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleProfileUpdate}
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
