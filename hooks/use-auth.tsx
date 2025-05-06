"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Define user type
interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin"
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signUp: (username: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
  getUsers: () => User[]
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample users data (in a real app, this would be in a database)
const ADMIN_USER = {
  id: "admin-id",
  username: "admin",
  email: "admin@example.com",
  password: "admin", // In a real app, this would be hashed
  role: "admin" as const,
}

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<Array<User & { password: string }>>([ADMIN_USER])

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Sign in function
  const signIn = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = users.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  // Sign up function
  const signUp = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if username or email already exists
    const userExists = users.some((u) => u.username === username || u.email === email)

    if (userExists) {
      return false
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      role: "user" as const,
    }

    setUsers((prev) => [...prev, newUser])
    return true
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Get all users (for admin)
  const getUsers = (): User[] => {
    return users.map(({ password, ...user }) => user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
