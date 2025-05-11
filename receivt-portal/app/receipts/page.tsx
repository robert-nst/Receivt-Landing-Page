"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Search } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"

// Mock data for receipts
const receipts = [
  {
    id: "REC-001",
    customer: "John Smith",
    email: "john.smith@example.com",
    date: "2023-05-10",
    amount: "$125.99",
    items: 3,
  },
  {
    id: "REC-002",
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    date: "2023-05-09",
    amount: "$78.50",
    items: 2,
  },
  {
    id: "REC-003",
    customer: "Michael Brown",
    email: "m.brown@example.com",
    date: "2023-05-08",
    amount: "$245.00",
    items: 5,
  },
  {
    id: "REC-004",
    customer: "Emily Davis",
    email: "emily.d@example.com",
    date: "2023-05-07",
    amount: "$32.99",
    items: 1,
  },
  {
    id: "REC-005",
    customer: "Robert Wilson",
    email: "r.wilson@example.com",
    date: "2023-05-06",
    amount: "$189.75",
    items: 4,
  },
  {
    id: "REC-006",
    customer: "Jennifer Lee",
    email: "j.lee@example.com",
    date: "2023-05-05",
    amount: "$56.25",
    items: 2,
  },
  {
    id: "REC-007",
    customer: "David Miller",
    email: "d.miller@example.com",
    date: "2023-05-04",
    amount: "$112.50",
    items: 3,
  },
  {
    id: "REC-008",
    customer: "Lisa Anderson",
    email: "l.anderson@example.com",
    date: "2023-05-03",
    amount: "$67.80",
    items: 2,
  },
]

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("receipts")}
        description={t("receipts.description")}
        actions={<Button className="bg-secondary hover:bg-secondary/90">{t("receipts.exportAll")}</Button>}
      />

      <div className="p-6 pt-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("receipts.searchReceipts")}
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{t("receipts.dateRange")}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>{t("receipts.filter")}</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("receipts.receiptId")}</TableHead>
                    <TableHead>{t("receipts.customer")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("receipts.email")}</TableHead>
                    <TableHead>{t("receipts.date")}</TableHead>
                    <TableHead>{t("receipts.amount")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("receipts.items")}</TableHead>
                    <TableHead className="text-right">{t("receipts.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.id}</TableCell>
                      <TableCell>{receipt.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{receipt.email}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>{receipt.amount}</TableCell>
                      <TableCell className="hidden md:table-cell">{receipt.items}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="text-sm text-muted-foreground">
                {t("receipts.showing")} <strong>{filteredReceipts.length}</strong> {t("receipts.of")}{" "}
                <strong>{receipts.length}</strong> {t("receipts.receipts")}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  {t("receipts.previous")}
                </Button>
                <Button variant="outline" size="sm">
                  {t("receipts.next")}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
