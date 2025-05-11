"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="flex-1"
      >
        <h1 className="text-2xl font-bold tracking-tight text-center sm:text-left">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-center sm:text-left">{description}</p>}
      </motion.div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="flex items-center gap-2 justify-end"
        >
          {actions}
        </motion.div>
      )}
    </div>
  )
}
