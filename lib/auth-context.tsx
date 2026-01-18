"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  role: UserRole | null
  token: string | null
  login: (data: { token: string; user: any }) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 🔁 Backend → Frontend role normalize
 */
const normalizeRole = (role: string): UserRole => {
  if (role === "superadmin") return "super-admin"
  return role as UserRole
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  /**
   * ✅ Login (API response directly)
   */
  const login = (data: { token: string; user: any }) => {
    const normalizedUser: User = {
      ...data.user,
      role: normalizeRole(data.user.role),
    }

    setUser(normalizedUser)
    setToken(data.token)

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(normalizedUser))
  }

  /**
   * ✅ Logout
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  /**
   * 🔁 Restore auth on refresh
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
