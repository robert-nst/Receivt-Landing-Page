"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/app/contexts/language-context"

// Mock data for the detailed view
const detailedRevenueData = [
  { name: "00:00", value: 1200 },
  { name: "02:00", value: 800 },
  { name: "04:00", value: 600 },
  { name: "06:00", value: 900 },
  { name: "08:00", value: 2500 },
  { name: "10:00", value: 3200 },
  { name: "12:00", value: 3800 },
  { name: "14:00", value: 3500 },
  { name: "16:00", value: 4200 },
  { name: "18:00", value: 4800 },
  { name: "20:00", value: 3500 },
  { name: "22:00", value: 2200 },
]

export default function DailyRevenuePage() {
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
        <h1 className="text-2xl font-bold">{t("Daily Revenue Details")}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Hourly Revenue Breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <div className="flex h-full items-end gap-2">
                {detailedRevenueData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex-1 rounded-md bg-[#940605] transition-all hover:bg-[#940605]/10"
                    style={{ height: `${(item.value / 4800) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      ${item.value}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{item.name}</div>
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
                  <span className="font-medium">$4,800</span>
                </div>
                <div className="flex justify-between">
                  <span>10:00 - 12:00</span>
                  <span className="font-medium">$3,800</span>
                </div>
                <div className="flex justify-between">
                  <span>16:00 - 18:00</span>
                  <span className="font-medium">$4,200</span>
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
                  <span className="font-medium">$31,200</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Average per Hour")}</span>
                  <span className="font-medium">$2,600</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Highest Hour")}</span>
                  <span className="font-medium">18:00 ($4,800)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 