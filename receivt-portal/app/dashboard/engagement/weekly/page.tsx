"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedWeeklyEngagementData = [
  { day: "Monday", active: 2800, total: 4000 },
  { day: "Tuesday", active: 3200, total: 4500 },
  { day: "Wednesday", active: 3500, total: 5000 },
  { day: "Thursday", active: 3300, total: 4800 },
  { day: "Friday", active: 3800, total: 5200 },
  { day: "Saturday", active: 4200, total: 5500 },
  { day: "Sunday", active: 4000, total: 5300 },
]

export default function WeeklyEngagementPage() {
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
        <h1 className="text-2xl font-bold">{t("Weekly Engagement Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Daily Engagement Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedWeeklyEngagementData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-secondary transition-all hover:bg-secondary/10"
                    style={{ height: `${(item.active / 5500) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      {Math.round((item.active / item.total) * 100)}%
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
                  <span className="font-medium">76% (4,200/5,500)</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">75% (4,000/5,300)</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium">73% (3,800/5,200)</span>
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
                  <span className="font-medium">24,800</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Total Users")}</span>
                  <span className="font-medium">34,300</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average Engagement Rate")}</span>
                  <span className="font-medium">72%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 