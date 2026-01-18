"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Fuel,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Clock,
  Package,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { UserRole } from "@/lib/types"

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

const navItems: Record<UserRole, NavItem[]> = {
  "super-admin": [
    { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/super-admin/admins", label: "Admin Management", icon: Shield },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sales", label: "Sales", icon: ShoppingCart },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/attendance", label: "Attendance", icon: Clock },
    { href: "/admin/stock", label: "Stock", icon: Package },
    { href: "/admin/profile", label: "My Profile", icon: UserCircle },
  ],
  staff: [
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/sales", label: "Sales", icon: ShoppingCart },
    { href: "/staff/attendance", label: "Attendance", icon: Clock },
    { href: "/staff/profile", label: "My Profile", icon: UserCircle },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const role = user?.role ?? "staff"
  const items = navItems[role]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-sidebar-primary p-1.5">
              <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">FuelFlow</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto rounded-lg bg-sidebar-primary p-1.5">
            <Fuel className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-2",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        {!isCollapsed && (
          <div className="mb-3 rounded-lg bg-sidebar-accent/50 px-3 py-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.username}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{role.replace("-", " ")}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors",
            isCollapsed && "justify-center px-2",
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
