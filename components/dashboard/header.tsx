"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { LogOut, Menu, Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <div className="rounded-lg bg-primary p-1.5">
            <Fuel className="h-4 w-4 text-primary-foreground" />
          </div>
        </Link>
        <h1 className="text-lg font-semibold text-foreground md:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:flex gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{user?.username?.charAt(0) ?? "U"}</span>
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace("-", " ")}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-0 left-0 border-b border-border bg-background p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{user?.username}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role?.replace("-", " ")}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
