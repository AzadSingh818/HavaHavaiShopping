"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (name: string, email: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // In a real app, this would call an API
  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, accept any email/password
        // In a real app, this would validate credentials with a backend
        if (email && password) {
          const newUser = {
            id: Math.random().toString(36).substring(2),
            name: email.split("@")[0],
            email,
          }

          setUser(newUser)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(newUser))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, accept any valid input
        // In a real app, this would create a user in the backend
        if (name && email && password) {
          const newUser = {
            id: Math.random().toString(36).substring(2),
            name,
            email,
          }

          setUser(newUser)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(newUser))
          resolve()
        } else {
          reject(new Error("Invalid input"))
        }
      }, 500)
    })
  }

  const updateProfile = (name: string, email: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        name,
        email,
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

