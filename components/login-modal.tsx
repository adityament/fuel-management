"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Fuel } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
    if (!BASE_URL) {
      alert("Backend URL missing")
      return
    }
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Invalid credentials")
      return
    }
    login({ token: data.token, user: data.user })
    onClose()
    const role = data.user.role === "superadmin" ? "super-admin" : data.user.role
    const routes: Record<string, string> = {
      "super-admin": "/super-admin",
      admin: "/admin",
      staff: "/staff",
    }
    router.push(routes[role])
  } catch (err) {
    console.error(err)
    alert("Server not reachable")
  }
}
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Fuel className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Modal>
  );
}
