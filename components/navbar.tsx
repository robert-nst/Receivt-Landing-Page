"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const pathname = usePathname()

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "how-it-helps", "features", "configurator", "contact"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 84 && rect.bottom >= 84) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Solution", href: "#how-it-helps", id: "how-it-helps" },
    { name: "Features", href: "#features", id: "features" },
    { name: "Configurator", href: "#configurator", id: "configurator" },
    { name: "Contact", href: "#contact", id: "contact" },
  ]

  return (
    <header className="sticky top-0 z-50 pt-4 w-full bg-gradient-to-br from-green-100 to-white">
      <div>
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-32 h-16">
              <Link href="#home" className="flex items-center">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:space-x-8">
              {navLinks.map((link) => (
                  <Link
                      key={link.id}
                      href={link.href}
                      className={cn(
                          "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200",
                          activeSection === link.id ? "font-bold text-green-800" : "text-gray-500 hover:text-gray-700",
                      )}
                      onClick={() => setActiveSection(link.id)}
                  >
                    {link.name}
                  </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-green-100 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true"/>
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true"/>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
                <Link
                    key={link.id}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  activeSection === link.id
                    ? "bg-green-50 text-green-800 font-bold"
                    : "text-gray-500 hover:bg-green-50 hover:text-green-700",
                )}
                onClick={() => {
                  setActiveSection(link.id)
                  setIsMenuOpen(false)
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
