"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  delay?: number
}

export function StatCard({ title, value, icon, description, trend, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-md bg-secondary/10 p-1.5 text-secondary">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {(description || trend) && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trend && (
                <span className={cn("mr-1 flex items-center", trend.isPositive ? "text-green-600" : "text-red-600")}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
