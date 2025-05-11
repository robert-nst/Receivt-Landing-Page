"use client"

import { useState } from "react"
import { Calendar, Download, Filter, LineChart, PieChart, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30days")
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("analytics")}
        description={t("analytics.description")}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{t("analytics.dateRange")}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>{t("analytics.filter")}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>{t("analytics.export")}</span>
            </Button>
          </>
        }
      />

      <div className="p-6 pt-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="overview" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="overview">{t("analytics.overview")}</TabsTrigger>
              <TabsTrigger value="customers">{t("analytics.customers")}</TabsTrigger>
              <TabsTrigger value="sales">{t("analytics.sales")}</TabsTrigger>
              <TabsTrigger value="loyalty">{t("analytics.loyalty")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">{t("analytics.last7days")}</SelectItem>
                <SelectItem value="30days">{t("analytics.last30days")}</SelectItem>
                <SelectItem value="90days">{t("analytics.last90days")}</SelectItem>
                <SelectItem value="year">{t("analytics.last12months")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>{t("analytics.revenueTrends")}</CardTitle>
                  <CardDescription>{t("analytics.revenueDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a real chart component in production */}
                  <div className="flex h-full items-end gap-2">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const height = Math.floor(Math.random() * 70) + 30
                      return (
                        <div
                          key={index}
                          className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{index + 1}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>{t("analytics.customerSegments")}</CardTitle>
                  <CardDescription>{t("analytics.segmentsDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  {/* This would be a real chart component in production */}
                  <div className="relative h-48 w-48">
                    <div className="absolute inset-0 rounded-full border-8 border-secondary/10" />
                    <div
                      className="absolute inset-0 rounded-full border-8 border-transparent border-t-secondary"
                      style={{ transform: "rotate(45deg)" }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-8 border-transparent border-r-secondary/60"
                      style={{ transform: "rotate(45deg)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">65%</span>
                      <span className="text-sm text-muted-foreground">Bronze</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                    <span className="text-sm">Bronze (65%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-secondary/60" />
                    <span className="text-sm">Silver (25%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-secondary/30" />
                    <span className="text-sm">Gold (10%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>{t("analytics.purchaseFrequency")}</CardTitle>
                  <CardDescription>{t("analytics.frequencyDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a real chart component in production */}
                  <div className="flex h-full items-end gap-2">
                    {["1", "2", "3", "4", "5+"].map((label, index) => {
                      const height = [70, 50, 30, 20, 10][index]
                      return (
                        <div
                          key={index}
                          className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">{height}%</div>
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>{t("analytics.basketSize")}</CardTitle>
                  <CardDescription>{t("analytics.basketDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a real chart component in production */}
                  <div className="flex h-full items-end gap-2">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const height = Math.floor(Math.random() * 50) + 30
                      return (
                        <div
                          key={index}
                          className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                            ${Math.floor(Math.random() * 50) + 30}
                          </div>
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0">
                  <CardTitle>{t("analytics.peakHours")}</CardTitle>
                  <CardDescription>{t("analytics.peakDesc")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a real chart component in production */}
                  <div className="flex h-full items-end gap-2">
                    {Array.from({ length: 24 }).map((_, index) => {
                      // Create a bell curve peaking at lunch and dinner times
                      let height = 10
                      if (index >= 11 && index <= 13)
                        height = 80 // Lunch peak
                      else if (index >= 17 && index <= 19)
                        height = 90 // Dinner peak
                      else if (index >= 8 && index <= 20) height = 30 + Math.floor(Math.random() * 30) // Business hours

                      return (
                        <div
                          key={index}
                          className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                          style={{ height: `${height}%` }}
                        >
                          {(index % 3 === 0 || index === 23) && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{index}:00</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
