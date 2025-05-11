"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import { Sidebar } from "./components/sidebar"
import { LanguageProvider } from "./contexts/language-context"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <ThemeProvider defaultTheme="light" forcedTheme="light">
      <LanguageProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  )
}
