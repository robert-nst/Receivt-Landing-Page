"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "how-it-helps", "features", "configurator", "contact"];
      const navbarHeight = document.querySelector("header")?.clientHeight || 0;

      // Check if page is scrolled more than 20px
      setScrolled(window.scrollY > 20);

      // Check if the user is at the bottom of the page
      const isBottom =
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;

      if (isBottom) {
        setActiveSection("contact");
        return;
      }

      // Highlight the section in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset - navbarHeight;

          if (window.scrollY >= offsetTop && window.scrollY < offsetTop + element.offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = document.querySelector("header")?.clientHeight || 0;
      const yOffset = -navbarHeight;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Solution", href: "#how-it-helps", id: "how-it-helps" },
    { name: "Features", href: "#features", id: "features" },
    { name: "Configurator", href: "#configurator", id: "configurator" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
      <header
          className={cn(
              "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
              scrolled ? "bg-white shadow-sm pt-2 pb-2" : "bg-transparent pt-4 pb-4"
          )}
      >
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-32 h-16">
              <button
                  onClick={() => scrollToSection("home")}
                  className="flex items-center focus:outline-none"
              >
                <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:space-x-8">
              {navLinks.map((link) => (
                  <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={cn(
                          "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 focus:outline-none",
                          activeSection === link.id
                              ? "font-bold text-[#083118]"
                              : "text-[#083118]/70 hover:text-[#083118]/90"
                      )}
                  >
                    {link.name}
                  </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-[#083118]/70 hover:bg-[#083118]/10 hover:text-[#083118] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#083118]/50"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div
              className={cn(
                  "space-y-1 px-2 pb-3 pt-2 rounded-lg mt-2 mx-6",
                  scrolled ? "bg-white" : "backdrop-blur-sm bg-white/30"
              )}
          >
            {navLinks.map((link) => (
                <button
                    key={link.id}
                    onClick={() => {
                      scrollToSection(link.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                        "block w-full text-left px-3 py-2 rounded-md text-base font-medium focus:outline-none",
                        activeSection === link.id
                            ? "bg-transparent text-[#083118] font-bold"
                            : "text-[#083118]/70 hover:text-[#083118]"
                    )}
                >
                  {link.name}
                </button>
            ))}
          </div>
        </div>
      </header>
  );
}