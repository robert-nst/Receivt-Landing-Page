"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, Filter, Search, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { collection, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"

interface Product {
  id_product: number
  name: string
  price: number
  description: string
  category: string
  barcode: string
  image_url: string
}

interface Receipt {
  id_receipt: number
  id_user: number
  timestamp: Timestamp
  total: number
  products: Array<{
    id_product: number
    name: string
    price: number
    quantity: number
  }>
}

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [amountRange, setAmountRange] = useState<{ min: number; max: number } | undefined>()
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const { t } = useLanguage()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [usersMap, setUsersMap] = useState<Record<number, any>>({})
  const [productsMap, setProductsMap] = useState<Record<number, Product>>({})
  const [modalSortField, setModalSortField] = useState<string>("product")
  const [modalSortDirection, setModalSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    async function fetchData() {
      // Fetch receipts
      const receiptsSnapshot = await getDocs(collection(db, "mock_receipts"))
      const receiptsData = receiptsSnapshot.docs.map(doc => doc.data() as Receipt)
      setReceipts(receiptsData)

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "mock_users"))
      const usersData: Record<number, any> = {}
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data()
        usersData[data.id_user] = data
      })
      setUsersMap(usersData)

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, "mock_products"))
      const productsData: Record<number, Product> = {}
      productsSnapshot.docs.forEach(doc => {
        const data = doc.data() as Product
        productsData[data.id_product] = data
      })
      setProductsMap(productsData)
    }
    fetchData()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleModalSort = (field: string) => {
    if (modalSortField === field) {
      setModalSortDirection(modalSortDirection === "asc" ? "desc" : "asc")
    } else {
      setModalSortField(field)
      setModalSortDirection("asc")
    }
  }

  const filteredReceipts = receipts
    .filter((receipt) => {
      const user = usersMap[receipt.id_user]
      const customer = user ? `${user.first_name} ${user.last_name}` : "-"
      const email = user ? user.email : "-"
      const matchesSearch = 
        customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(receipt.id_receipt).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDateRange = !dateRange || (
        dateRange.from && dateRange.to && 
        receipt.timestamp.toDate() >= dateRange.from &&
        receipt.timestamp.toDate() <= dateRange.to
      )

      const matchesAmountRange = !amountRange || (
        receipt.total >= amountRange.min &&
        receipt.total <= amountRange.max
      )

      return matchesSearch && matchesDateRange && matchesAmountRange
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "id_receipt":
          comparison = a.id_receipt - b.id_receipt
          break
        case "customer":
          const customerA = usersMap[a.id_user] ? `${usersMap[a.id_user].first_name} ${usersMap[a.id_user].last_name}` : "-"
          const customerB = usersMap[b.id_user] ? `${usersMap[b.id_user].first_name} ${usersMap[b.id_user].last_name}` : "-"
          comparison = customerA.localeCompare(customerB)
          break
        case "email":
          const emailA = usersMap[a.id_user]?.email || "-"
          const emailB = usersMap[b.id_user]?.email || "-"
          comparison = emailA.localeCompare(emailB)
          break
        case "total":
          comparison = a.total - b.total
          break
        case "items":
          comparison = a.products.length - b.products.length
          break
        case "timestamp":
          comparison = a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
          break
        default:
          comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  const handleExport = () => {
    const headers = ["Receipt ID", "Customer", "Email", "Date", "Amount", "Items"]
    const csvContent = [
      headers.join(","),
      ...filteredReceipts.map(receipt => {
        const user = usersMap[receipt.id_user]
        const customer = user ? `${user.first_name} ${user.last_name}` : "-"
        const email = user ? user.email : "-"
        return [
          receipt.id_receipt,
          customer,
          email,
          receipt.timestamp.toDate().toLocaleDateString(),
          receipt.total,
          receipt.products.length
        ].join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "receipts-export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadReceipt = (receipt: Receipt) => {
    const user = usersMap[receipt.id_user]
    const customer = user ? `${user.first_name} ${user.last_name}` : "-"
    const email = user ? user.email : "-"
    
    const receiptContent = `
Receipt #${receipt.id_receipt}
Date: ${receipt.timestamp.toDate().toLocaleDateString()}
Customer: ${customer}
Email: ${email}

Items:
${receipt.products.map(p => `${p.name} x${p.quantity} - ${p.price} RON`).join("\n")}

Total: ${receipt.total} RON
    `.trim()

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipt-${receipt.id_receipt}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("receipts")}
        description={t("receipts.description")}
        actions={<Button className="bg-[#940605] hover:bg-[#940605]/90" onClick={handleExport}>{t("receipts.exportAll")}</Button>}
      />

      <div className="p-6 pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                  />
                  <Select
                    value={amountRange ? `${amountRange.min}-${amountRange.max}` : "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setAmountRange(undefined)
                        return
                      }
                      const [min, max] = value.split("-").map(Number)
                      setAmountRange({ min, max })
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Amount Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Amounts</SelectItem>
                      <SelectItem value="0-100">0 - 100 RON</SelectItem>
                      <SelectItem value="100-500">100 - 500 RON</SelectItem>
                      <SelectItem value="500-1000">500 - 1000 RON</SelectItem>
                      <SelectItem value="1000-999999">1000+ RON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("id_receipt")}>
                        {t("receipts.receiptId")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("customer")}>
                        {t("receipts.customer")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" onClick={() => handleSort("email")}>
                        {t("receipts.email")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("timestamp")}>
                        {t("receipts.date")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("total")}>
                        {t("receipts.amount")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" onClick={() => handleSort("items")}>
                        {t("receipts.items")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">{t("receipts.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => {
                    const user = usersMap[receipt.id_user]
                    const customer = user ? `${user.first_name} ${user.last_name}` : "-"
                    const email = user ? user.email : "-"
                    return (
                      <TableRow key={receipt.id_receipt}>
                        <TableCell className="font-medium">{receipt.id_receipt}</TableCell>
                        <TableCell>{customer}</TableCell>
                        <TableCell className="hidden md:table-cell">{email}</TableCell>
                        <TableCell>{receipt.timestamp.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>{receipt.total} RON</TableCell>
                        <TableCell className="hidden md:table-cell">{receipt.products.length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(receipt)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(receipt)}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                {t("receipts.showing")} <strong>{filteredReceipts.length}</strong> {t("receipts.of")} <strong>{receipts.length}</strong> {t("receipts.receipts")}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Receipt Details #{selectedReceipt?.id_receipt}</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {usersMap[selectedReceipt.id_user]?.first_name} {usersMap[selectedReceipt.id_user]?.last_name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {usersMap[selectedReceipt.id_user]?.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Receipt Information</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground">Date:</span> {selectedReceipt.timestamp.toDate().toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground">Total Items:</span> {selectedReceipt.products.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleModalSort("product")}
                            className="flex items-center gap-1 p-0">
                            Product
                            {modalSortField === "product" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleModalSort("category")}
                            className="flex items-center gap-1 p-0">
                            Category
                            {modalSortField === "category" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleModalSort("barcode")}
                            className="flex items-center gap-1 p-0">
                            Barcode
                            {modalSortField === "barcode" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleModalSort("quantity")}
                            className="flex items-center gap-1 p-0">
                            Quantity
                            {modalSortField === "quantity" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button variant="ghost" onClick={() => handleModalSort("price")}
                            className="flex items-center gap-1 p-0">
                            Price
                            {modalSortField === "price" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button variant="ghost" onClick={() => handleModalSort("total")}
                            className="flex items-center gap-1 p-0">
                            Total
                            {modalSortField === "total" ? (
                              modalSortDirection === "asc" ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...selectedReceipt.products]
                        .map((product, index) => {
                          const productDetails = productsMap[product.id_product]
                          // Debug log
                          if (index === 0) {
                            console.log('Product:', product, 'ProductDetails:', productDetails)
                          }
                          const imageUrl = productDetails?.image_url || ''
                          const name = product.name || productDetails?.name || '-'
                          const description = productDetails?.description || ''
                          const category = productDetails?.category || '-'
                          const barcode = productDetails?.barcode || '-'
                          const quantity = typeof product.quantity === 'number' && !isNaN(product.quantity) ? product.quantity : '-'
                          const price = typeof product.price === 'number' && !isNaN(product.price) ? product.price : (typeof productDetails?.price === 'number' && !isNaN(productDetails.price) ? productDetails.price : '-')
                          const total = (typeof price === 'number' && typeof quantity === 'number') ? (price * quantity) : '-'
                          return {
                            product,
                            productDetails,
                            imageUrl,
                            name,
                            description,
                            category,
                            barcode,
                            quantity,
                            price,
                            total,
                            index
                          }
                        })
                        .sort((a, b) => {
                          let comparison = 0
                          switch (modalSortField) {
                            case "product":
                              comparison = a.name.localeCompare(b.name)
                              break
                            case "category":
                              comparison = a.category.localeCompare(b.category)
                              break
                            case "barcode":
                              comparison = a.barcode.localeCompare(b.barcode)
                              break
                            case "quantity":
                              comparison = (typeof a.quantity === 'number' ? a.quantity : 0) - (typeof b.quantity === 'number' ? b.quantity : 0)
                              break
                            case "price":
                              comparison = (typeof a.price === 'number' ? a.price : 0) - (typeof b.price === 'number' ? b.price : 0)
                              break
                            case "total":
                              comparison = (typeof a.total === 'number' ? a.total : 0) - (typeof b.total === 'number' ? b.total : 0)
                              break
                            default:
                              comparison = 0
                          }
                          return modalSortDirection === "asc" ? comparison : -comparison
                        })
                        .map(({product, productDetails, imageUrl, name, description, category, barcode, quantity, price, total, index}) => (
                          <TableRow key={index}>
                            {/* Product Image */}
                            <TableCell>
                              {imageUrl ? (
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                                  <img
                                    src={imageUrl}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
                                  />
                                </div>
                              ) : (
                                <div className="h-12 w-12 flex items-center justify-center bg-muted text-muted-foreground rounded-md border">-</div>
                              )}
                            </TableCell>
                            {/* Product Name */}
                            <TableCell>
                              <Button
                                variant="link"
                                className="p-0 h-auto font-medium hover:underline"
                                onClick={() => window.open(`/products/${product.id_product}`, '_blank')}
                              >
                                {name}
                              </Button>
                              {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                              )}
                            </TableCell>
                            {/* Category */}
                            <TableCell>
                              <Badge variant="secondary">{category}</Badge>
                            </TableCell>
                            {/* Barcode */}
                            <TableCell>
                              {barcode !== '-' ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono">{barcode}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      navigator.clipboard.writeText(barcode)
                                    }}
                                  >
                                    <span className="sr-only">Copy barcode</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                  </Button>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            {/* Quantity */}
                            <TableCell>{quantity}</TableCell>
                            {/* Price (linked) */}
                            <TableCell className="text-right">
                              {price !== '-' ? (
                                <Button
                                  variant="link"
                                  className="p-0 h-auto font-medium hover:underline"
                                  onClick={() => window.open(`/products/${product.id_product}`, '_blank')}
                                >
                                  {price} RON
                                </Button>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            {/* Total */}
                            <TableCell className="text-right">{total !== '-' ? `${total} RON` : '-'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold">Total: {selectedReceipt.total} RON</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
