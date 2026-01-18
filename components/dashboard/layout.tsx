"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { DashboardHeader } from "./header"
import type { UserRole } from "@/lib/types"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  requiredRole?: UserRole
}

export function DashboardLayout({ children, title, requiredRole }: DashboardLayoutProps) {
  const { isAuthenticated, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (requiredRole && role !== requiredRole) {
      // Redirect to correct dashboard
      const routes: Record<UserRole, string> = {
        "super-admin": "/super-admin",
        admin: "/admin",
        staff: "/staff",
      }
      if (role) {
        router.push(routes[role])
      }
    }
  }, [isAuthenticated, role, requiredRole, router])

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="md:pl-64 transition-all duration-300">
        <DashboardHeader title={title} />
        <main className="p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
