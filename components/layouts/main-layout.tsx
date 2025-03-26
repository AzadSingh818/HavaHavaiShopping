"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
// import { Sidebar } from "@/components/sidebar"
import { CartSummary } from "@/components/cart-summary"
import { Footer } from "@/components/footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleCart = () => {
    if (!isAuthenticated) {
      // If not authenticated, don't open cart
      return
    }
    setCartOpen(!cartOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} toggleCart={toggleCart} />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>

      {cartOpen && isAuthenticated && <CartSummary onClose={() => setCartOpen(false)} />}
    </div>
  )
}

