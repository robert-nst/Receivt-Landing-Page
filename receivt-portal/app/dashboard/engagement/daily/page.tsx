"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedEngagementData = [
  { hour: "00:00", active: 120, total: 180 },
  { hour: "02:00", active: 80, total: 120 },
  { hour: "04:00", active: 60, total: 90 },
  { hour: "06:00", active: 90, total: 150 },
  { hour: "08:00", active: 250, total: 400 },
  { hour: "10:00", active: 320, total: 500 },
  { hour: "12:00", active: 380, total: 600 },
  { hour: "14:00", active: 350, total: 550 },
  { hour: "16:00", active: 420, total: 650 },
  { hour: "18:00", active: 480, total: 700 },
  { hour: "20:00", active: 350, total: 550 },
  { hour: "22:00", active: 220, total: 350 },
]

export default function DailyEngagementPage() {
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
        <h1 className="text-2xl font-bold">{t("Daily Engagement Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Hourly Engagement Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedEngagementData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-secondary transition-all hover:bg-secondary/10"
                    style={{ height: `${(item.active / 480) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      {Math.round((item.active / item.total) * 100)}%
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{item.hour}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Peak Hours")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>18:00 - 20:00</span>
                  <span className="font-medium">68.6% (480/700)</span>
                </div>
                <div className="flex justify-between">
                  <span>16:00 - 18:00</span>
                  <span className="font-medium">64.6% (420/650)</span>
                </div>
                <div className="flex justify-between">
                  <span>12:00 - 14:00</span>
                  <span className="font-medium">63.3% (380/600)</span>
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
                  <span className="font-medium">3,120</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average Engagement Rate")}</span>
                  <span className="font-medium">65.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Highest Engagement")}</span>
                  <span className="font-medium">18:00 (68.6%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 