"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingCart, Clock, Package, UserCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

const navItems: Record<UserRole, NavItem[]> = {
  "super-admin": [
    { href: "/super-admin", label: "Home", icon: LayoutDashboard },
    { href: "/super-admin/admins", label: "Admins", icon: Shield },
  ],
  admin: [
    { href: "/admin", label: "Home", icon: LayoutDashboard },
    { href: "/admin/sales", label: "Sales", icon: ShoppingCart },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/attendance", label: "Attend", icon: Clock },
    { href: "/admin/stock", label: "Stock", icon: Package },
    { href: "/admin/profile", label: "Profile", icon: UserCircle }, // ← Added this
  ],
  staff: [
    { href: "/staff", label: "Home", icon: LayoutDashboard },
    { href: "/staff/sales", label: "Sales", icon: ShoppingCart },
    { href: "/staff/attendance", label: "Attend", icon: Clock },
    { href: "/staff/profile", label: "Profile", icon: UserCircle },
  ],
}

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const role = user?.role ?? "staff"
  const items = navItems[role].slice(0, 6) // Changed to 6 so Profile shows for admin

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background md:hidden">
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}