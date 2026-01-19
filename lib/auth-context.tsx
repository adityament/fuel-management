"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User, UserRole } from "./types"
import { useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

interface AuthContextType {
  user: User | null
  role: UserRole | null
  token: string | null
  login: (data: { token: string; user: any }) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const normalizeRole = (role: string): UserRole => {
  if (role === "superadmin") return "super-admin"
  return role as UserRole
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  )
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const login = (data: { token: string; user: any }) => {
    const normalizedUser: User = {
      ...data.user,
      role: normalizeRole(data.user.role),
    }

    setUser(normalizedUser)
    setToken(data.token)
    localStorage.setItem("token", data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    router.push("/") 
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const restoreAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Unauthorized")

        const data = await res.json()
        const normalizedUser: User = {
          ...data.user,
          role: normalizeRole(data.user.role),
        }

        setUser(normalizedUser)
      } catch (error) {
        console.error("Failed to restore auth:", error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    restoreAuth()
  }, [token])

  // ✅ Don't render children until loading is done
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
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
