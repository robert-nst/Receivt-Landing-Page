"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Download, Filter, Search, UserPlus, ChevronUp, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "../components/page-header"
import { useLanguage } from "../contexts/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types
interface Tier {
  threshold: number;
  tier: number;
}

interface User {
  id: string;
  id_user: number;
  first_name: string;
  last_name: string;
  email: string;
  loyalty_points: number;
  birthday: string;
  active_offers?: number[];
  receipts?: number[];
}

function calculateAge(birthday: any): number | string {
  if (!birthday) return "-";
  let date: Date;
  if (typeof birthday === "string") {
    date = new Date(birthday.split(" at ")[0]);
  } else if (birthday && typeof birthday.toDate === "function") {
    date = birthday.toDate();
  } else {
    return "-";
  }
  if (isNaN(date.getTime())) return "-";
  const diff = Date.now() - date.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getTier(points: number, tiers: Tier[]): string {
  let tierName = "Bronze"
  if (!tiers || !Array.isArray(tiers) || tiers.length === 0) return tierName
  for (const t of tiers) {
    if (points >= t.threshold) {
      if (t.tier === 2) tierName = "Silver"
      if (t.tier === 3) tierName = "Gold"
    }
  }
  return tierName
}

function formatTimestamp(ts: any): string {
  if (!ts) return "-";
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toLocaleString();
  if (typeof ts.seconds === "number") {
    return new Date(ts.seconds * 1000).toLocaleString();
  }
  return "-";
}

function formatDate(date: any): string {
  if (!date) return "-";
  if (typeof date === "string") {
    const d = new Date(date.split(" at ")[0]);
    if (!isNaN(d.getTime())) return d.toLocaleDateString();
    return date;
  }
  if (date.toDate) return date.toDate().toLocaleDateString();
  if (typeof date.seconds === "number") {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  return String(date);
}

function safeRender(value: any): React.ReactNode {
  if (value == null) return "-";
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.join(", ");
    return JSON.stringify(value);
  }
  return String(value);
}

function SortIcon({ active, direction }: { active: boolean, direction: 'asc' | 'desc' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center ml-1 ${active ? 'text-secondary' : 'text-muted-foreground'}`}
      style={{ fontSize: '0.9em' }}>
      <ChevronUp className={`w-3 h-3 ${active && direction === 'asc' ? 'opacity-100' : 'opacity-50'}`} />
      <ChevronDown className={`w-3 h-3 -mt-1 ${active && direction === 'desc' ? 'opacity-100' : 'opacity-50'}`} />
    </span>
  );
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()
  const [customers, setCustomers] = useState<User[]>([])
  const [tiers, setTiers] = useState<Tier[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterTier, setFilterTier] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterMinAge, setFilterMinAge] = useState<string>("")
  const [filterMaxAge, setFilterMaxAge] = useState<string>("")
  const exportRef = useRef<HTMLAnchorElement>(null)
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function fetchData() {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "mock_users"))
      const users: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
      setCustomers(users)
      // Fetch tiers
      const adminSnapshot = await getDocs(collection(db, "mock_admin"))
      let allTiers: Tier[] = []
      adminSnapshot.forEach(doc => {
        if (doc.data().tiers) allTiers = doc.data().tiers
      })
      setTiers(allTiers)
    }
    fetchData()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      (customer.first_name + " " + customer.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(customer.id_user).toLowerCase().includes(searchTerm.toLowerCase())
    const tier = getTier(customer.loyalty_points, tiers)
    const matchesTier = !filterTier || tier === filterTier
    const age = Number(calculateAge(customer.birthday))
    const matchesMinAge = !filterMinAge || (age >= Number(filterMinAge))
    const matchesMaxAge = !filterMaxAge || (age <= Number(filterMaxAge))
    return matchesSearch && matchesTier && matchesMinAge && matchesMaxAge
  })

  function handleSort(col: string) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  }

  let sortedCustomers = [...filteredCustomers];
  if (sortBy) {
    sortedCustomers.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'points':
          aValue = a.loyalty_points;
          bValue = b.loyalty_points;
          break;
        case 'tier':
          aValue = getTier(a.loyalty_points, tiers);
          bValue = getTier(b.loyalty_points, tiers);
          break;
        case 'age':
          aValue = Number(calculateAge(a.birthday));
          bValue = Number(calculateAge(b.birthday));
          break;
        default:
          aValue = '';
          bValue = '';
      }
      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function handleExport() {
    if (filteredCustomers.length === 0) return
    const headers = ["Customer ID", "Name", "Email", "Points Balance", "Tier", "Age"]
    const rows = filteredCustomers.map((customer) => {
      const tier = getTier(customer.loyalty_points, tiers)
      return [
        customer.id_user,
        `${customer.first_name} ${customer.last_name}`,
        customer.email,
        customer.loyalty_points,
        tier,
        calculateAge(customer.birthday),
      ]
    })
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    if (exportRef.current) {
      exportRef.current.href = url
      exportRef.current.download = "customers.csv"
      exportRef.current.click()
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={t("customers")}
        description={t("customers.description")}
        actions={
          <Button className="bg-[#940605] hover:bg-[#940605]/90 gap-1">
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
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>{t("Filter")}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="font-semibold mb-2">Filter by Tier</div>
                    <div className="flex flex-col gap-2 mb-4">
                      <Button variant={!filterTier ? "secondary" : "outline"} size="sm" onClick={() => setFilterTier(null)}>
                        All
                      </Button>
                      <Button variant={filterTier === "Bronze" ? "secondary" : "outline"} size="sm" onClick={() => setFilterTier("Bronze")}>Bronze</Button>
                      <Button variant={filterTier === "Silver" ? "secondary" : "outline"} size="sm" onClick={() => setFilterTier("Silver")}>Silver</Button>
                      <Button variant={filterTier === "Gold" ? "secondary" : "outline"} size="sm" onClick={() => setFilterTier("Gold")}>Gold</Button>
                    </div>
                    <div className="font-semibold mb-2">Filter by Age</div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min={0}
                        value={filterMinAge}
                        onChange={e => setFilterMinAge(e.target.value)}
                        placeholder="Min"
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min={0}
                        value={filterMaxAge}
                        onChange={e => setFilterMaxAge(e.target.value)}
                        placeholder="Max"
                        className="w-16 px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button variant="ghost" size="sm" onClick={() => { setFilterTier(null); setFilterMinAge(""); setFilterMaxAge(""); }}>Clear</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  <span>{t("Export csv")}</span>
                </Button>
                <a ref={exportRef} style={{ display: "none" }} />
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
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">{t("customers.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.map((customer) => {
                    const tier = getTier(customer.loyalty_points, tiers)
                    return (
                      <TableRow key={customer.id_user}>
                        <TableCell className="font-medium">{customer.id_user}</TableCell>
                        <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                        <TableCell>{customer.loyalty_points}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tier === "Gold"
                              ? "bg-yellow-400 text-yellow-900"
                              : tier === "Silver"
                              ? "bg-gray-300 text-gray-900"
                              : "bg-yellow-900 text-white"
                          }`}>{tier}</span>
                        </TableCell>
                        <TableCell>{calculateAge(customer.birthday)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog open={modalOpen && selectedUser?.id_user === customer.id_user} onOpenChange={open => { setModalOpen(open); if (!open) setSelectedUser(null) }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(customer); setModalOpen(true) }}>
                                {t("customers.view")}
                              </Button>
                            </DialogTrigger>
                            {selectedUser?.id_user === customer.id_user && (
                              <UserDetailsModal user={selectedUser} />
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <div className="text-sm text-muted-foreground">
                {t("customers.showing")} <strong>{filteredCustomers.length}</strong> {t("customers.of")} <strong>{customers.length}</strong> {t("customers.customers")}
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

function UserDetailsModal({ user }: { user: User }) {
  const [offers, setOffers] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    // Fetch offers
    let offersData: any[] = [];
    if (user.active_offers && user.active_offers.length > 0) {
      const offersSnapshot = await getDocs(collection(db, "mock_offers"));
      offersData = offersSnapshot.docs
        .map(doc => doc.data())
        .filter(offer => user.active_offers?.includes(offer.id_offer));
    }
    setOffers(offersData);

    // Fetch receipts
    let receiptsData: any[] = [];
    let allProductIds: number[] = [];
    if (user.receipts && user.receipts.length > 0) {
      const receiptsSnapshot = await getDocs(collection(db, "mock_receipts"));
      receiptsData = receiptsSnapshot.docs
        .map(doc => doc.data())
        .filter(receipt => user.receipts?.includes(receipt.id_receipt));
      // Collect all product IDs from receipts
      receiptsData.forEach(r => {
        if (Array.isArray(r.products)) allProductIds.push(...r.products);
      });
    }
    setReceipts(receiptsData);

    // Fetch products
    let productsData: Record<number, any> = {};
    if (allProductIds.length > 0) {
      const productsSnapshot = await getDocs(collection(db, "mock_products"));
      productsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (allProductIds.includes(data.id)) {
          productsData[data.id] = data;
        }
      });
    }
    setProductsMap(productsData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-2 text-secondary flex items-center gap-2">
          <span className="inline-block w-2 h-6 rounded bg-[#940605] mr-2"></span>
          Customer Profile: {user.first_name} {user.last_name}
        </DialogTitle>
        <DialogDescription className="mb-4 text-base text-muted-foreground">
          Here you can view all the details and activity for this customer.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 space-y-8">
        <div className="flex flex-col gap-2 p-4 bg-white rounded-lg border border-secondary/30 shadow-sm">
          <div><span className="font-semibold text-secondary">Email address:</span> <span className="text-gray-700">{safeRender(user.email)}</span></div>
          <div><span className="font-semibold text-secondary">Loyalty points balance:</span> <span className="text-gray-700">{safeRender(user.loyalty_points)}</span></div>
          <div><span className="font-semibold text-secondary">Age:</span> <span className="text-gray-700">{safeRender(calculateAge(user.birthday))} years</span></div>
        </div>
        <div className="border-t pt-6">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><span className="w-2 h-6 rounded bg-[#940605]"></span><span className="text-secondary">Active Loyalty Offers</span></h4>
          {loading ? (
            <div>Loading offers and receipts...</div>
          ) : offers.length === 0 ? (
            <div className="text-muted-foreground">This customer does not have any active loyalty offers at the moment.</div>
          ) : (
            <ul className="space-y-4">
              {offers.map((offer, idx) => {
                let tierBadge = <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-900 text-white text-xs font-semibold">Bronze</span>;
                if (offer.tier === 2) tierBadge = <span className="inline-block px-2 py-0.5 rounded-full bg-gray-300 text-gray-900 text-xs font-semibold">Silver</span>;
                if (offer.tier === 3) tierBadge = <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold">Gold</span>;
                return (
                  <li key={idx} className="border-l-4 border-secondary rounded-lg p-4 bg-white shadow-lg">
                    <div className="font-bold text-base mb-1 flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded-full border border-secondary text-secondary text-xs font-semibold">OFFER</span>
                      {safeRender(offer.name)}
                    </div>
                    <div className="mb-1 text-sm text-muted-foreground">{safeRender(offer.short_description)}</div>
                    <div className="flex flex-wrap gap-4 text-sm items-center">
                      <div><span className="font-semibold text-secondary">Discount/Benefit:</span> {safeRender(offer.percent)}%</div>
                      <div className="flex items-center gap-1"><span className="font-semibold text-secondary">Eligible Tier:</span> {tierBadge}</div>
                      <div><span className="font-semibold text-secondary">Valid period:</span> {formatDate(offer.start_date)} - {formatDate(offer.end_date)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t pt-6">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><span className="w-2 h-6 rounded bg-[#940605]"></span><span className="text-secondary">Receipts</span></h4>
          {loading ? (
            <div>Loading offers and receipts...</div>
          ) : receipts.length === 0 ? (
            <div className="text-muted-foreground">No receipts found for this customer.</div>
          ) : (
            <ul className="space-y-6">
              {receipts.map((receipt, idx) => (
                <li key={idx} className="border-l-4 border-secondary rounded-lg p-4 bg-white shadow-lg">
                  <div className="flex flex-wrap gap-4 mb-2 text-sm items-center">
                    <div><span className="inline-block px-2 py-0.5 rounded-full border border-secondary text-secondary text-xs font-semibold">RECEIPT</span></div>
                    <div><span className="font-semibold text-secondary">Receipt ID:</span> {safeRender(receipt.id_receipt)}</div>
                    <div><span className="font-semibold text-secondary">Date:</span> {formatTimestamp(receipt.timestamp)}</div>
                    <div className="font-bold text-lg text-secondary flex items-center gap-1"><span>Total:</span> <span>{safeRender(receipt.total)} RON</span></div>
                  </div>
                  <div className="font-semibold mb-1 text-secondary">Products purchased:</div>
                  <ul className="ml-4 list-disc">
                    {Array.isArray(receipt.products) ? receipt.products.map((pid: number) => {
                      const prod = productsMap[pid];
                      return prod ? (
                        <li key={pid} className="mb-1">
                          <div className="flex items-center justify-between gap-2 bg-[#940605]/10 rounded p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              {prod.picture && <img src={prod.picture} alt={prod.name} className="w-8 h-8 object-cover rounded border border-secondary" />}
                              <span className="font-semibold text-secondary">{safeRender(prod.name)}</span>
                            </div>
                            <span className="font-semibold text-secondary text-right min-w-[60px]">{safeRender(prod.price)} RON</span>
                          </div>
                        </li>
                      ) : (
                        <li key={pid}>Product ID: {safeRender(pid)}</li>
                      );
                    }) : null}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DialogContent>
  )
}
