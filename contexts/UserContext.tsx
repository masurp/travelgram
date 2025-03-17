"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type Condition = "condition1" | "condition2" | "condition3" | "condition4"

interface UserContextType {
  username: string
  condition: Condition | null
  setUsername: (username: string) => void
  setCondition: (condition: Condition) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("")
  const [condition, setCondition] = useState<Condition | null>(null)

  return (
    <UserContext.Provider value={{ username, condition, setUsername, setCondition }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

