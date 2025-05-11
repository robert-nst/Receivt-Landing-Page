"use client"

import {useEffect, useState} from "react"
import { Download, Filter, Search, UserPlus } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"
import {getTiers} from "@/lib/firebase";

// Mock data for customers
const customers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    pointsBalance: 450,
    tier: "Gold",
    joinDate: "2023-01-15",
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    pointsBalance: 320,
    tier: "Silver",
    joinDate: "2023-02-20",
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "m.brown@example.com",
    pointsBalance: 180,
    tier: "Bronze",
    joinDate: "2023-03-10",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    pointsBalance: 580,
    tier: "Gold",
    joinDate: "2022-11-05",
  },
  {
    id: "CUST-005",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    pointsBalance: 90,
    tier: "Bronze",
    joinDate: "2023-04-18",
  },
  {
    id: "CUST-006",
    name: "Jennifer Lee",
    email: "j.lee@example.com",
    pointsBalance: 410,
    tier: "Silver",
    joinDate: "2023-01-30",
  },
  {
    id: "CUST-007",
    name: "David Miller",
    email: "d.miller@example.com",
    pointsBalance: 280,
    tier: "Silver",
    joinDate: "2023-02-15",
  },
  {
    id: "CUST-008",
    name: "Lisa Anderson",
    email: "l.anderson@example.com",
    pointsBalance: 750,
    tier: "Gold",
    joinDate: "2022-09-22",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()
  const [dataTiers, setDataTiers] = useState([])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        title={t("customers")}
        description={t("customers.description")}
        actions={
          <Button className="bg-secondary hover:bg-secondary/90 gap-1">
            <UserPlus className="h-4 w-4" />
            {t("customers.addCustomer")}
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
                  placeholder={t("customers.searchCustomers")}
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>{t("customers.filter")}</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>{t("customers.export")}</span>
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("customers.customerId")}</TableHead>
                    <TableHead>{t("customers.name")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("customers.email")}</TableHead>
                    <TableHead>{t("customers.pointsBalance")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("customers.tier")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("customers.joinDate")}</TableHead>
                    <TableHead className="text-right">{t("customers.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    let tier = "";
                    let tierStyle = "";

                    if (customer.pointsBalance >= 1000) {
                      tier = "Gold";
                      tierStyle = "bg-yellow-100 text-yellow-800";
                    } else if (customer.pointsBalance >= 500) {
                      tier = "Silver";
                      tierStyle = "bg-gray-100 text-gray-800";
                    } else {
                      tier = "Bronze";
                      tierStyle = "bg-amber-100 text-amber-800";
                    }
                    return (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                          <TableCell>{customer.pointsBalance}</TableCell>
                          <TableCell className="hidden md:table-cell">
                          <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tierStyle}`}
                          >
                            {tier}
                          </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{customer.joinDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              {t("customers.view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="text-sm text-muted-foreground">
                {t("customers.showing")} <strong>{filteredCustomers.length}</strong> {t("customers.of")}{" "}
                <strong>{customers.length}</strong> {t("customers.customers")}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t("customers.previous")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("customers.next")}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
