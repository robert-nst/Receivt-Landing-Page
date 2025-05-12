"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedMonthlyEngagementData = [
  { month: "January", active: 85000, total: 120000 },
  { month: "February", active: 95000, total: 130000 },
  { month: "March", active: 110000, total: 150000 },
  { month: "April", active: 105000, total: 145000 },
  { month: "May", active: 120000, total: 160000 },
  { month: "June", active: 115000, total: 155000 },
]

export default function MonthlyEngagementPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("Monthly Engagement Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Monthly Engagement Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedMonthlyEngagementData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-secondary transition-all hover:bg-secondary/10"
                    style={{ height: `${(item.active / 160000) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      {Math.round((item.active / item.total) * 100)}%
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Peak Months")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>May</span>
                  <span className="font-medium">75% (120,000/160,000)</span>
                </div>
                <div className="flex justify-between">
                  <span>June</span>
                  <span className="font-medium">74% (115,000/155,000)</span>
                </div>
                <div className="flex justify-between">
                  <span>March</span>
                  <span className="font-medium">73% (110,000/150,000)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("Total Active Users")}</span>
                  <span className="font-medium">630,000</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Total Users")}</span>
                  <span className="font-medium">860,000</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average Engagement Rate")}</span>
                  <span className="font-medium">73%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 