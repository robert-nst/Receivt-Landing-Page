"use client"

import { useEffect, useState } from "react"
import { Calendar, Download, Filter, Plus, Search } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Dialog, DialogTitle } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader } from "@/components/ui/dialog"

interface Campaign {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  audience: string;
  opens: number;
  redemptions: number;
  conversions: string;
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersSnapshot = await getDocs(collection(db, "mock_offers"));
        const offers = offersSnapshot.docs.map((doc) => doc.data());

        const mappedCampaigns = offers.map((offer) => ({
          id: offer.id_offer,
          name: offer.name,
          status: determineStatus(offer.start_date, offer.end_date),
          startDate: convertTimestampToDate(offer.start_date),
          endDate: convertTimestampToDate(offer.end_date),
          audience: offer.tier || "All Customers",
          opens: offer.usage_number || 0,
          redemptions: offer.usage_number,
          conversions: offer.percentage,
        }));

        setCampaigns(mappedCampaigns);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const determineStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Scheduled";
    if (now > end) return "Ended";
    return "Active";
  };

  const convertTimestampToDate = (timestamp: Timestamp | string): string => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return timestamp; // If it's already a string, return it as is
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("campaigns")}
        description={t("campaigns.description")}
        actions={
          <Button className="bg-[#940605] hover:bg-[#940605]/90 gap-1">
            <Plus className="h-4 w-4" />
            {t("campaigns.newCampaign")}
          </Button>
        }
      />

      <div className="p-6 pt-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("campaigns.searchCampaigns")}
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("campaigns.dateRange")}</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>{t("campaigns.filter")}</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>{t("campaigns.export")}</span>
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("campaigns.campaignId")}</TableHead>
                    <TableHead>{t("campaigns.name")}</TableHead>
                    <TableHead>{t("campaigns.status")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("campaigns.dateRange")}</TableHead>
                    <TableHead>{t("campaigns.redemptions")}</TableHead>
                    <TableHead className="text-right">{t("campaigns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            campaign.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell>{campaign.redemptions}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => setSelectedCampaign(campaign)} size="sm">
                          {t("campaigns.view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableBody>
              </Table>
              <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Campaign Details</DialogTitle>
                  </DialogHeader>
                  {selectedCampaign && (
                    <div className="space-y-4">
                      <p>
                        <strong>Name:</strong> {selectedCampaign.name}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedCampaign.status}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {selectedCampaign.startDate}
                      </p>
                      <p>
                        <strong>End Date:</strong> {selectedCampaign.endDate}
                      </p>
                      <p>
                        <strong>Audience:</strong> {selectedCampaign.audience}
                      </p>
                      <p>
                        <strong>Redemptions:</strong> {selectedCampaign.redemptions}
                      </p>
                      <p>
                        <strong>Conversions:</strong> {selectedCampaign.conversions}
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="text-sm text-muted-foreground">
                {t("campaigns.showing")} <strong>{filteredCampaigns.length}</strong> {t("campaigns.of")}{" "}
                <strong>{campaigns.length}</strong> {t("campaigns.campaigns")}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t("campaigns.previous")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("campaigns.next")}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Overview of your campaign metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  {/* This would be a real chart component in production */}
                  <div className="flex h-full items-end gap-2">
                    {campaigns.slice(0, 5).map((campaign, index) => (
                      <div
                        key={index}
                        className="relative flex-1 rounded-md bg-[#940605]/10 transition-all hover:bg-[#940605]/20"
                        style={{
                          height: `${Number.parseInt(campaign.conversions) * 2}%`,
                          minHeight: "20px",
                        }}
                      >
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs truncate max-w-[80px] text-center">
                          {campaign.name.split(" ").slice(0, 2).join(" ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
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
              <CardHeader>
                <CardTitle>Campaign Ideas</CardTitle>
                <CardDescription>Suggested campaigns based on customer behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-[#940605]/10 p-1 mt-0.5">
                      <Plus className="h-3 w-3 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Re-engagement Campaign</p>
                      <p className="text-sm text-muted-foreground">
                        Target customers who haven't made a purchase in 30+ days
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-[#940605]/10 p-1 mt-0.5">
                      <Plus className="h-3 w-3 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Tier Upgrade Promotion</p>
                      <p className="text-sm text-muted-foreground">
                        Encourage Bronze customers close to Silver tier to make additional purchases
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-[#940605]/10 p-1 mt-0.5">
                      <Plus className="h-3 w-3 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Referral Bonus</p>
                      <p className="text-sm text-muted-foreground">
                        Offer double points for customer referrals this month
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#940605] hover:bg-[#940605]/90">Create New Campaign</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
