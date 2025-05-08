"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";

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
        if (activeSection !== "contact") {
          setActiveSection("contact");
          trackEvent(GA_EVENTS.SECTION_VIEW, { section: "contact", trigger: "scroll" });
        }
        return;
      }

      // Highlight the section in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset - navbarHeight;

          if (window.scrollY >= offsetTop && window.scrollY < offsetTop + element.offsetHeight) {
            if (activeSection !== section) {
              setActiveSection(section);
              trackEvent(GA_EVENTS.SECTION_VIEW, { section, trigger: "scroll" });
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    trackEvent(GA_EVENTS.NAVIGATION_CLICK, {
      section: sectionId,
      trigger: "click"
    });

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
    { name: "Configurator", href: "#configurator-bg", id: "configurator-bg" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Receivt Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeSection === link.id
                    ? "text-[#083118]"
                    : "text-gray-600 hover:text-[#083118]"
                )}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              trackEvent(GA_EVENTS.NAVIGATION_CLICK, {
                action: isMenuOpen ? "close_menu" : "open_menu"
              });
            }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-[#083118]" />
            ) : (
              <Menu className="h-6 w-6 text-[#083118]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  scrollToSection(link.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm font-medium transition-colors",
                  activeSection === link.id
                    ? "text-[#083118]"
                    : "text-gray-600 hover:text-[#083118]"
                )}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}