"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedMonthlyRevenueData = [
  { month: "January", value: 120000 },
  { month: "February", value: 140000 },
  { month: "March", value: 160000 },
  { month: "April", value: 150000 },
  { month: "May", value: 180000 },
  { month: "June", value: 170000 },
]

export default function MonthlyRevenuePage() {
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
        <h1 className="text-2xl font-bold">{t("Monthly Revenue Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Monthly Revenue Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedMonthlyRevenueData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-[#940605] transition-all hover:bg-[#940605]/10"
                    style={{ height: `${(item.value / 180000) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      ${item.value}
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
                  <span className="font-medium">$180,000</span>
                </div>
                <div className="flex justify-between">
                  <span>June</span>
                  <span className="font-medium">$170,000</span>
                </div>
                <div className="flex justify-between">
                  <span>March</span>
                  <span className="font-medium">$160,000</span>
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
                  <span>{t("Total Revenue")}</span>
                  <span className="font-medium">$920,000</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average per Month")}</span>
                  <span className="font-medium">$153,333</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Highest Month")}</span>
                  <span className="font-medium">May ($180,000)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 