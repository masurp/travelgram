"use client"

import type React from "react"
import { Search, Heart, PlusSquare, Compass, Home } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onSearch: (keyword: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value)
  }

  return (
    <header className="w-full bg-white border-b fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="relative h-8 w-24 sm:h-10 sm:w-28">
          <h1 className="logo-font text-xl sm:text-2xl font-bold tracking-wider">
            Travelgram
            <span className="absolute -top-1 -right-1 text-base sm:text-lg">✈️</span>
          </h1>
        </div>

        {/* Search - hidden on mobile */}
        <div className="hidden md:flex relative max-w-xs w-full mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="w-full bg-gray-100 pl-10 rounded-lg border-none"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Home className="h-5 w-5 sm:h-6 sm:w-6" />
          <PlusSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          <Compass className="h-5 w-5 sm:h-6 sm:w-6 hidden sm:block" />
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 hidden sm:block" />
          <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
            <AvatarImage src="/placeholder.svg?height=28&width=28" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

