"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronLeft,
  CreditCard,
  Gift,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useLanguage } from "../contexts/language-context"
import LanguagePicker from "./language-picker"

const navItems = [
  {
    title: (t: (key: string) => string) => t("sidebar.dashboard"),
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.receipts"),
    href: "/receipts",
    icon: CreditCard,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.customers"),
    href: "/customers",
    icon: Users,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.loyaltyProgram"),
    href: "/loyalty",
    icon: Gift,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.campaigns"),
    href: "/campaigns",
    icon: Mail,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.analytics"),
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: (t: (key: string) => string) => t("sidebar.settings"),
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-2 border-b">
              <div className="flex justify-center items-center min-h-[300px]">
                <img src="/images/logo.png" alt="Receivt Logo" className="h-48 w-auto max-w-full" />
              </div>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <ul className="grid gap-1 px-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href ? "bg-[#940605] text-white" : "hover:bg-[#940605]/10",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {typeof item.title === "function" ? item.title(t) : item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <LanguagePicker />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: isCollapsed ? 80 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:block border-r bg-white h-screen relative"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {!isCollapsed && <img src="/images/logo.png" alt="Receivt Logo" className="h-16 w-auto max-w-full" />}
              {isCollapsed && <ShoppingBag className="h-6 w-6 text-secondary" />}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="grid gap-1 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-[#940605] text-white" : "hover:bg-[#940605]/10",
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{typeof item.title === "function" ? item.title(t) : item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <div className="mb-2">
              <p className="text-xs text-muted-foreground mb-1">{t("sidebar.language")}</p>
              <LanguagePicker />
            </div>
            <Button variant="outline" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center")}>
              <LogOut className="h-4 w-4" />
              {!isCollapsed && t("sidebar.logout")}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
