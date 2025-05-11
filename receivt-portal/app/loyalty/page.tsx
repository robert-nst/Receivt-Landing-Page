"use client"

import {useEffect, useState} from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"
import {getTiers} from "@/lib/firebase";

export default function LoyaltyPage() {
  const [pointsPerDollar, setPointsPerDollar] = useState("10")
  const [dataTiers, setDataTiers] = useState([])
  const { t } = useLanguage()

  useEffect(() => {
    const getTiersData = async () => {
        const dataTiers = await getTiers()
        setDataTiers(dataTiers)
    }

    getTiersData()
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("loyalty")}
        description={t("loyalty.description")}
        actions={<Button className="bg-secondary hover:bg-secondary/90">{t("loyalty.saveChanges")}</Button>}
      />

      <div className="p-6 pt-0">
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">{t("loyalty.rules")}</TabsTrigger>
            <TabsTrigger value="tiers">{t("loyalty.tiers")}</TabsTrigger>
            <TabsTrigger value="redemption">{t("loyalty.redemption")}</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("loyalty.pointsEarningRules")}</CardTitle>
                  <CardDescription>{t("loyalty.pointsEarningDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="points-per-dollar">{t("loyalty.pointsPerDollar")}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="points-per-dollar"
                        type="number"
                        value={pointsPerDollar}
                        onChange={(e) => setPointsPerDollar(e.target.value)}
                        className="max-w-[120px]"
                      />
                      <span className="text-sm text-muted-foreground">{t("loyalty.pointsPer")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">{t("loyalty.resetToDefault")}</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">{t("loyalty.saveRules")}</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Points Expiration</CardTitle>
                  <CardDescription>Configure when earned points expire</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      <span>Enable points expiration</span>
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiration-months">Points expire after</Label>
                    <div className="flex items-center gap-2">
                      <Input id="expiration-months" type="number" defaultValue="12" className="max-w-[120px]" />
                      <span className="text-sm text-muted-foreground">months of inactivity</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Default</Button>
                  <Button className="bg-secondary hover:bg-secondary/90">Save Expiration Rules</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader className="bg-amber-50 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      Bronze
                      <span className="text-amber-800 text-sm bg-amber-100 px-2 py-1 rounded-full">Level 1</span>
                    </CardTitle>
                    <CardDescription>Entry level tier</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bronze-threshold">Qualification Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input id="bronze-threshold" type="number"
                               defaultValue={dataTiers[0]?.tiers[0].threshold !== null ? dataTiers[0]?.tiers[0].threshold.toString() : "Loading..."}
                               className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Edit Benefits
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      Silver
                      <span className="text-gray-800 text-sm bg-gray-200 px-2 py-1 rounded-full">Level 2</span>
                    </CardTitle>
                    <CardDescription>Mid-tier level</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="silver-threshold">Qualification Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input id="silver-threshold" type="number"
                               defaultValue={dataTiers[0]?.tiers[1].threshold !== null ? dataTiers[0]?.tiers[1].threshold.toString() : "Loading..."}
                               className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Edit Benefits
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="bg-yellow-50 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      Gold
                      <span className="text-yellow-800 text-sm bg-yellow-100 px-2 py-1 rounded-full">Level 3</span>
                    </CardTitle>
                    <CardDescription>Premium tier level</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gold-threshold">Qualification Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input id="gold-threshold" type="number"
                               defaultValue={dataTiers[0]?.tiers[2].threshold !== null ? dataTiers[0]?.tiers[2].threshold.toString() : "Loading..."}
                               className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Edit Benefits
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-secondary hover:bg-secondary/90">Add New Tier</Button>
            </div>
          </TabsContent>

          <TabsContent value="redemption" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>$5 Off Coupon</CardTitle>
                    <CardDescription>Standard discount reward</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="five-dollar-points">Points Required</Label>
                      <div className="flex items-center gap-2">
                        <Input id="five-dollar-points" type="number" defaultValue="100" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="five-dollar-expiry">Coupon Validity</Label>
                      <div className="flex items-center gap-2">
                        <Input id="five-dollar-expiry" type="number" defaultValue="30" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span>Active</span>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Delete</Button>
                    <Button className="bg-secondary hover:bg-secondary/90">Save</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Free Shipping</CardTitle>
                    <CardDescription>Free shipping on any order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-points">Points Required</Label>
                      <div className="flex items-center gap-2">
                        <Input id="shipping-points" type="number" defaultValue="75" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping-expiry">Coupon Validity</Label>
                      <div className="flex items-center gap-2">
                        <Input id="shipping-expiry" type="number" defaultValue="30" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span>Active</span>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Delete</Button>
                    <Button className="bg-secondary hover:bg-secondary/90">Save</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>10% Off Order</CardTitle>
                    <CardDescription>Percentage discount on entire order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="percent-points">Points Required</Label>
                      <div className="flex items-center gap-2">
                        <Input id="percent-points" type="number" defaultValue="200" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="percent-expiry">Coupon Validity</Label>
                      <div className="flex items-center gap-2">
                        <Input id="percent-expiry" type="number" defaultValue="30" className="max-w-[120px]" />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                        <span>Active</span>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Delete</Button>
                    <Button className="bg-secondary hover:bg-secondary/90">Save</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-full">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-secondary/10 p-3">
                      <Plus className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-medium">Add New Reward</h3>
                    <p className="text-sm text-muted-foreground">Create a new redemption option for your customers</p>
                    <Button className="mt-2 bg-secondary hover:bg-secondary/90">Add Reward</Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
