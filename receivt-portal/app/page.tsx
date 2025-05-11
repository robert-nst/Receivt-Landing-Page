"use client"

import { useEffect, useState } from "react"
import { ArrowBigRight, ArrowRightIcon, ArrowUpRight, Calendar, CreditCard, DollarSign, Download, LineChart, RefreshCcw, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "./components/page-header"
import { StatCard } from "./components/stat-card"
import { useLanguage } from "./contexts/language-context"
import {getTotalPointsForAllUsers, getTotalUsersFromDatabase} from "@/lib/firebase";

// Mock data for the charts
const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
  { name: "Aug", value: 8000 },
  { name: "Sep", value: 7500 },
  { name: "Oct", value: 9000 },
  { name: "Nov", value: 8500 },
  { name: "Dec", value: 10000 },
]

const engagementData = [
  { name: "Mon", active: 400, total: 600 },
  { name: "Tue", active: 300, total: 500 },
  { name: "Wed", active: 500, total: 700 },
  { name: "Thu", active: 450, total: 650 },
  { name: "Fri", active: 600, total: 800 },
  { name: "Sat", active: 550, total: 750 },
  { name: "Sun", active: 700, total: 900 },
]

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState<number | null>(null);
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true);

    const fetchTotalUsers = async () => {
      const total = await getTotalUsersFromDatabase();
      setTotalUsers(total);
    };

    const fetchTotalLoyaltyPoints = async () => {
        const totalPoints = await getTotalPointsForAllUsers();
        setTotalLoyaltyPoints(totalPoints);
    }

    fetchTotalUsers();
    fetchTotalLoyaltyPoints();
  }, []);

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("dashboard")}
        description={t("dashboard.description")}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{t("dashboard.filter")}</span>
            </Button>

            <Button size="sm" className="h-8 gap-1 bg-secondary hover:bg-secondary/90">
              <Download className="h-3.5 w-3.5" />
              <span>{t("dashboard.export")}</span>
            </Button>
          </>
        }
      />

      <div className="p-6 pt-0 grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("dashboard.totalCustomers")}
            //numar clienti care au aplicatie
            value={totalUsers !== null ? totalUsers.toString() : "Loading..."}
            icon={<Users className="h-5 w-5" />}
            description={t("dashboard.vsPreviousMonth")}
            //aici trebuie functie care calculeaza trendul
            //trebuie luata valoarea dupa care se compara din filtrare
            trend={{ value: 12, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title={t("dashboard.receiptsProcessed")}
            // de pus valoare nemockuita
            value="789"
            icon={<CreditCard className="h-5 w-5" />}
            description={t("dashboard.vsPreviousMonth")}
            trend={{ value: 8, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title={t("dashboard.pointsAwarded")}
            // de pus valoare nemockuita
            value={totalLoyaltyPoints !== null ? totalLoyaltyPoints.toString() : "Loading..."}
            icon={<ArrowUpRight className="h-5 w-5" />}
            description={t("dashboard.vsPreviousMonth")}
            trend={{ value: 15, isPositive: true }}
            delay={0.3}
          />
          <StatCard
            title={t("dashboard.totalRevenue")}
            // de pus valoare nemockuita
            value={"9.432" + " RON"}
            icon={<DollarSign className="h-5 w-5" />}
            description={t("dashboard.vsPreviousMonth")}
            trend={{ value: 5, isPositive: true }}
            delay={0.4}
          />
        </div>

        {/* selector timp */}
        <Tabs defaultValue="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">{t("dashboard.daily")}</TabsTrigger>
              <TabsTrigger value="weekly">{t("dashboard.weekly")}</TabsTrigger>
              <TabsTrigger value="monthly">{t("dashboard.monthly")}</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              {t("dashboard.downloadReport")}
            </Button>
          </div>
          <TabsContent value="daily" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0">
                      <CardTitle>{t("dashboard.revenue")}</CardTitle>
                      <CardDescription>{t("dashboard.revenueOverview")}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px] w-full">
                      {/* This would be a real chart component in production */}
                      <div className="flex h-full items-end gap-2">
                        {revenueData.slice(-7).map((item, index) => (
                          <div
                            key={index}
                            className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                            style={{ height: `${(item.value / 10000) * 100}%` }}
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
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="bg-secondary text-white flex items-center">
                      {t("dashboard.seeMore")}
                      <ArrowRightIcon></ArrowRightIcon>
                    </Button>
                  </div>
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
                      <CardTitle>{t("dashboard.engagementRate")}</CardTitle>
                      <CardDescription>{t("dashboard.activeVsTotal")}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px] w-full">
                      {/* This would be a real chart component in production */}
                      <div className="flex h-full items-end gap-2">
                        {revenueData.slice(-7).map((item, index) => (
                          <div
                            key={index}
                            className="relative flex-1 rounded-md bg-secondary/10 transition-all hover:bg-secondary/20"
                            style={{ height: `${(item.value / 10000) * 100}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                              {item.value / 100}%
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">{item.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="bg-secondary text-white flex items-center">
                      {t("dashboard.seeMore")}
                      <ArrowRightIcon></ArrowRightIcon>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {t("dashboard.weeklyChart")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {t("dashboard.weeklyEngagement")}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {t("dashboard.monthlyChart")}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {t("dashboard.monthlyEngagement")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
