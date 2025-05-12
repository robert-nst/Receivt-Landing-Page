"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedWeeklyRevenueData = [
  { day: "Monday", value: 25000 },
  { day: "Tuesday", value: 28000 },
  { day: "Wednesday", value: 32000 },
  { day: "Thursday", value: 30000 },
  { day: "Friday", value: 35000 },
  { day: "Saturday", value: 42000 },
  { day: "Sunday", value: 38000 },
]

export default function WeeklyRevenuePage() {
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
        <h1 className="text-2xl font-bold">{t("Weekly Revenue Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Daily Revenue Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedWeeklyRevenueData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-secondary transition-all hover:bg-secondary/10"
                    style={{ height: `${(item.value / 42000) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      ${item.value}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{item.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Peak Days")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">$42,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">$38,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium">$35,000</span>
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
                  <span>{t("Total Weekly Revenue")}</span>
                  <span className="font-medium">$248,000</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average per Day")}</span>
                  <span className="font-medium">$35,429</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Highest Day")}</span>
                  <span className="font-medium">Saturday ($42,000)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 