"use client"

import type React from "react"
import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const conditionCodes = {
  "235": "condition1",
  "254": "condition2",
  "275": "condition3",
  "295": "condition4",
} as const

type ConditionCode = keyof typeof conditionCodes

export default function RegistrationForm() {
  const [inputUsername, setInputUsername] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [error, setError] = useState("")
  const { setUsername, setCondition } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUsername.trim() && inputCode.trim()) {
      if (inputCode in conditionCodes) {
        setUsername(inputUsername.trim())
        setCondition(conditionCodes[inputCode as ConditionCode])
      } else {
        setError("Invalid code. Please try again.")
      }
    } else {
      setError("Please enter both a username and a code.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <h1 className="logo-font text-4xl font-bold tracking-wider">
            Travelgram
            <span className="inline-block ml-2 text-2xl">✈️</span>
          </h1>
          <p className="mt-2 text-gray-600">Share your travel adventures</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Choose a username
            </label>
            <Input
              type="text"
              id="username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Enter your code
            </label>
            <Input
              type="text"
              id="code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Start Browsing
          </Button>
        </form>
      </div>
    </div>
  )
}

