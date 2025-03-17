import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GlobalStyles from "@/components/GlobalStyles"
import CloseTabScript from "@/components/CloseTabScript"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travelgram - A place to share your favorite travel photos",
  description: "Travelgram - Social Media",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100`}>
        <GlobalStyles />
        {children}
        <CloseTabScript />
      </body>
    </html>
  )
}



import './globals.css'