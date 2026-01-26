"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, User, EyeOff, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function AdminProfilePage() {
  const { user, token } = useAuth();

  /* ================= PASSWORD STATES ================= */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  /* ================= PROFILE STATES ================= */
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

  /* ================= TANK STATES ================= */
  const [tankName, setTankName] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [capacity, setCapacity] = useState<number>(0);
  const [tanks, setTanks] = useState<any[]>([]);
  const [tankLoading, setTankLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };
  const handleLocationChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  /* ================= PASSWORD UPDATE ================= */
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

  /* ================= FETCH ALL TANKS ================= */
  const fetchTanks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/tanks/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTanks(data);
      else toast.error(data.message || "Failed to fetch tanks");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tanks");
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  /* ================= ADD NEW TANK ================= */
  const handleAddTank = async () => {
    if (!tankName.trim() || !fuelType || isNaN(capacity) || capacity < 0) {
      toast.error("Please fill all fields correctly. Capacity cannot be negative.");
      return;
    }

    setTankLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/tanks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tankName, fuelType, capacity }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Tank added successfully");
        setTankName("");
        setFuelType("petrol");
        setCapacity(0);
        fetchTanks();
      } else {
        toast.error(data.message || "Failed to add tank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add tank");
    } finally {
      setTankLoading(false);
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
            <h3 className="text-lg font-semibold mb-4">Update Your Password</h3>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center">
                <User size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p>{user?.username}</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg items-center">
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

          {/* Update Profile Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Username</Label>
                <Input
                  value={profile.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2">Latitude</Label>
                  <Input
                    value={profile.location.latitude}
                    onChange={(e) => handleLocationChange("latitude", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-2">Longitude</Label>
                  <Input
                    value={profile.location.longitude}
                    onChange={(e) => handleLocationChange("longitude", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-2">Radius (m)</Label>
                  <Input
                    value={profile.location.radius}
                    onChange={(e) => handleLocationChange("radius", e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={profileLoading}>
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= TANK MANAGEMENT GRID ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Add Tank Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Tank</h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Tank Name</Label>
                <Input
                  value={tankName}
                  onChange={(e) => setTankName(e.target.value)}
                  placeholder="Main Tank 1"
                />
              </div>

              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Capacity (Liters)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 5000"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                  required
                />
              </div>

              <Button
                onClick={handleAddTank}
                disabled={tankLoading || !tankName.trim() || capacity < 0 || isNaN(capacity)}
              >
                {tankLoading ? "Adding..." : "Add Tank"}
              </Button>
            </div>
          </div>

          {/* All Tanks Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">All Tanks</h3>
            {tanks.length === 0 ? (
              <p className="text-muted-foreground">No tanks found.</p>
            ) : (
              <div className="space-y-4">
                {tanks.map((tank) => (
                  <div
                    key={tank._id}
                    className="p-4 border border-border rounded-lg bg-muted/10 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{tank.tankName}</p>
                      <p className="text-sm text-muted-foreground">
                        Fuel: {tank.fuelType} | Capacity: {tank.capacity}L
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tank ID: {tank.tankId}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Created: {new Date(tank.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}