"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CollapsibleProps {
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
}

export function Collapsible({ title, content, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-6 py-4 flex justify-between items-center text-left font-medium text-xl text-green-900 hover:bg-green-50 transition-colors rounded-lg"
        >
            <h1 className={`font-semibold ${isOpen ? "text-2xl text-[#083118]" : "text-xl text-gray-600"}`}>{title}</h1>
            {isOpen ? (
                <ChevronUp className="h-6 w-6 text-[#083118] flex-shrink-0"/>
            ) : (
                <ChevronDown className="h-6 w-6 text-gray-500 flex-shrink-0"/>
            )}
        </button>

        {isOpen && <div className="px-6 pb-4">{content}</div>}
    </div>
  )
}
