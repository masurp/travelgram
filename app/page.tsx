"use client"

import { useState, useEffect } from "react"
import Feed from "@/components/feed"
import RegistrationForm from "@/components/RegistrationForm"
import { UserProvider, useUser } from "@/contexts/UserContext"

function Home() {
  const { username, condition } = useUser()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // or a loading spinner
  }

  return <main className="min-h-screen bg-gray-50">{username && condition ? <Feed /> : <RegistrationForm />}</main>
}

export default function HomeWrapper() {
  return (
    <UserProvider>
      <Home />
    </UserProvider>
  )
}

