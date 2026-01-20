"use client";

import type React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminFormData) => void;
}

export interface AdminFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export function AddAdminModal({
  isOpen,
  onClose,
  onSubmit,
}: AddAdminModalProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    latitude: 0,
    longitude: 0,
    radius: 0,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      latitude: 0,
      longitude: 0,
      radius: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      if (!BASE_URL) return alert("Backend URL missing");

      const token = localStorage.getItem("token");
      if (!token) return alert("Please login again");

      const res = await fetch(`${BASE_URL}/api/registeradmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to create admin");
        return;
      }
      toast.success("Admin created successfully");
      onSubmit(formData);
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Admin"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        {/* PASSWORD WITH EYE */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* LOCATION (NO COUNTERS) */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="text"
              inputMode="decimal"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="text"
              inputMode="decimal"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Radius (m)</Label>
            <Input
              id="radius"
              type="text"
              inputMode="numeric"
              value={formData.radius}
              onChange={(e) =>
                setFormData({ ...formData, radius: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>

          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Adding..." : "Add Admin"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
