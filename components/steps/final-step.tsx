"use client"

import {
  Home,
  Gift,
  FileText,
  User,
  ShoppingBag,
  Sun,
  Footprints,
  LogOut,
  Contact,
  Search,
  Calendar,
  Filter,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Barcode from 'react-barcode'
import React, {ReactNode, useEffect} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface FinalStepProps {
  logo: string | null
  primaryColor: string
  secondaryColor: string
  email: string
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  activeNavItem: string
  setActiveNavItem: (item: string) => void
}

// Receipts data moved outside the component to avoid hydration mismatch
const receipts = [
  {
    date: "2025-03-15",
    amount: "$54.30",
    receiptNo: "#000123",
    items: [
      { name: "Bananas (1kg)", price: "$2.50", icon: "🍌" },
      { name: "Milk (2L)", price: "$3.20", icon: "🥛" },
      { name: "Toothpaste", price: "$2.60", icon: "🪥" },
      { name: "Chicken Breast (1kg)", price: "$8.00", icon: "🍗" },
      { name: "Laundry Detergent", price: "$7.00", icon: "🧺" },
      { name: "Shampoo", price: "$5.00", icon: "🧴" },
      { name: "T-shirt", price: "$12.00", icon: "👕" },
      { name: "Potatoes (2kg)", price: "$4.00", icon: "🥔" },
      { name: "Chocolate Bar", price: "$1.50", icon: "🍫" },
      { name: "Notebook", price: "$8.50", icon: "📒" },
    ],
  },
  {
    date: "2025-03-10",
    amount: "$112.90",
    receiptNo: "#000122",
    items: [
      { name: "LED Bulb (2x)", price: "$6.00", icon: "💡" },
      { name: "Ground Coffee", price: "$4.80", icon: "☕" },
      { name: "Olive Oil (1L)", price: "$9.00", icon: "🫒" },
      { name: "Toilet Paper (12 rolls)", price: "$6.50", icon: "🧻" },
      { name: "Frozen Pizza", price: "$5.00", icon: "🍕" },
      { name: "Bluetooth Speaker", price: "$35.00", icon: "🔊" },
      { name: "Running Shoes", price: "$39.00", icon: "👟" },
      { name: "Dish Soap", price: "$2.60", icon: "🧼" },
      { name: "Carrots (1kg)", price: "$2.00", icon: "🥕" },
      { name: "Eggs (12)", price: "$3.00", icon: "🥚" },
    ],
  },
  {
    date: "2025-03-05",
    amount: "$76.40",
    receiptNo: "#000121",
    items: [
      { name: "Rice (5kg)", price: "$7.50", icon: "🍚" },
      { name: "Orange Juice (1L)", price: "$2.80", icon: "🧃" },
      { name: "Vacuum Cleaner", price: "$45.00", icon: "🧹" },
      { name: "Tennis Balls (3x)", price: "$6.00", icon: "🎾" },
      { name: "Cheese (500g)", price: "$5.10", icon: "🧀" },
      { name: "Toaster", price: "$10.00", icon: "🍞" },
    ],
  },
];

export default function FinalStep({
                                    logo,
                                    primaryColor,
                                    secondaryColor,
                                    email,
                                    setPrimaryColor,
                                    setSecondaryColor,
                                    activeNavItem,
                                    setActiveNavItem,
                                  }: FinalStepProps) {
  const [offerModal, setOfferModal] = React.useState<null | { icon: ReactNode, discount: string, item: string, date: string | null }>(null);
  const [expandedReceipt, setExpandedReceipt] = React.useState<number | null>(null);
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [name, setName] = React.useState("Matthew Alan");
  const [emailValue, setEmailValue] = React.useState("matthew.alan@email.com");
  const [notifications, setNotifications] = React.useState(true);
  const [privacy, setPrivacy] = React.useState({ showEmail: true, showProfile: false });
  const [paymentMethods, setPaymentMethods] = React.useState([
    { type: "Visa", last4: "1234" },
    { type: "Mastercard", last4: "5678" },
  ]);
  const [addCardOpen, setAddCardOpen] = React.useState(false);
  const [newCard, setNewCard] = React.useState({ type: "Visa", last4: "" });

  const [filteredReceipts, setFilteredReceipts] = React.useState(receipts || [])

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dateFilterType, setDateFilterType] = React.useState("none")
  const [dateRange, setDateRange] = React.useState({ from: null, to: null })
  const [singleDate, setSingleDate] = React.useState(null)
  const [amountFilterType, setAmountFilterType] = React.useState("none")
  const [singleAmount, setSingleAmount] = React.useState(0)
  const [lowerAmount, setLowerAmount] = React.useState(0)
  const [upperAmount, setUpperAmount] = React.useState(0)

  const maxAmount = Math.max(...receipts.map((receipt) => Number.parseFloat(receipt.amount.replace(/[^0-9.]/g, ""))))

  const [amountRange, setAmountRange] = React.useState<[number, number]>([0, maxAmount]);

  const bucharestCoordinates = {
    lat: 44.4268,
    lng: 26.1025,
  }

  // Apply filters
  useEffect(() => {
    let result = [...receipts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((receipt) => {
        // Search in receipt items
        const itemsMatch = receipt.items.some((item) => item.name.toLowerCase().includes(query))

        return itemsMatch
      })
    }

    // Date filter
    if (dateFilterType === "between" && dateRange.from && dateRange.to) {
      result = result.filter((receipt) => {
        const receiptDate = new Date(receipt.date)
        return receiptDate >= dateRange.from && receiptDate <= dateRange.to
      })
    } else if (dateFilterType === "above" && singleDate) {
      result = result.filter((receipt) => {
        const receiptDate = new Date(receipt.date)
        return receiptDate >= singleDate
      })
    } else if (dateFilterType === "below" && singleDate) {
      result = result.filter((receipt) => {
        const receiptDate = new Date(receipt.date)
        return receiptDate <= singleDate
      })
    }

    // Amount filter
    if (amountFilterType === "between") {
      result = result.filter((receipt) => {
        const amount = Number.parseFloat(receipt.amount.replace(/[^0-9.]/g, ""))
        return amount >= lowerAmount && amount <= upperAmount
      })
    } else if (amountFilterType === "above") {
      result = result.filter((receipt) => {
        const amount = Number.parseFloat(receipt.amount.replace(/[^0-9.]/g, ""))
        return amount >= singleAmount
      })
    } else if (amountFilterType === "below") {
      result = result.filter((receipt) => {
        const amount = Number.parseFloat(receipt.amount.replace(/[^0-9.]/g, ""))
        return amount <= singleAmount
      })
    }

    setFilteredReceipts(result)
  }, [
    receipts,
    searchQuery,
    dateFilterType,
    dateRange,
    singleDate,
    amountFilterType,
    amountRange,
    singleAmount,
    lowerAmount,
    upperAmount
  ])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setDateFilterType("none")
    setDateRange({ from: null, to: null })
    setSingleDate(null)
    setAmountFilterType("none")
    setAmountRange([0, maxAmount])
    setSingleAmount(0)
    setLowerAmount(0)
    setUpperAmount(0)
  }

  // Count active filters
  const activeFilterCount = [
    searchQuery !== "",
    dateFilterType !== "none",
    amountFilterType !== "none"
  ].filter(Boolean).length

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "offers",
      label: "Offers",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      id: "receipts",
      label: "Receipts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "account",
      label: "Account",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Contact className="h-5 w-5" />,
    }
  ]

  const renderPageContent = () => {
    switch (activeNavItem) {
      case "home":
        return (
            <div className="relative h-full w-full">
              <div
                  className="absolute inset-0 top-0 bottom-16 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#8884] scrollbar-track-[#fff0]"
                  style={{ zIndex: 1 }}
              >
                {/* Welcome Banner */}
                <div className="py-8 rounded-b-3xl shadow-md relative overflow-hidden flex flex-col items-center" style={{ background: `linear-gradient(90deg, ${primaryColor}10 60%, ${secondaryColor}10 100%)` }}>
                  <div className="flex items-center gap-6 mb-6">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="User Avatar"
                        className="w-14 h-14 rounded-full border-4 border-white shadow-lg bg-white/40"
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow">Welcome back, John!</h3>
                      <p className="text-sm text-gray-500 font-medium">Loyalty Member</p>
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <div className="bg-white/70 rounded-2xl px-6 py-4 shadow-lg flex flex-col items-center min-w-[170px]">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Your points</p>
                      <p className="text-4xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
                        2,450
                      </p>
                      <div className="w-40 h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                        <div className="h-2 rounded transition-all duration-500" style={{ width: '70%', backgroundColor: secondaryColor }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Next reward at 3,500 pts</p>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none" style={{ fontSize: 120, color: primaryColor }}>
                    ★
                  </div>
                </div>

                {/* Loyalty Card Section */}
                <div className="pt-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Loyalty Card</h3>
                  </div>
                  <div className="relative flex justify-center">
                    {/* Floating logo */}
                    {logo && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full border-4 border-white bg-white" style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={logo || "/placeholder.svg"} alt="Business Logo" className="h-10 w-10 object-contain rounded-full" />
                        </div>
                    )}
                    <div
                        className="w-full rounded-3xl p-6 pt-10 shadow-2xl flex flex-col gap-4 relative"
                        style={{
                          background: `linear-gradient(120deg, ${primaryColor} 60%, ${secondaryColor} 100%)`,
                          boxShadow: `0 10px 32px 0 ${primaryColor}22`,
                          minHeight: 220,
                          overflow: 'visible',
                        }}
                    >
                      {/* Glassmorphism overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-white/30 backdrop-blur-md z-0" style={{ pointerEvents: 'none' }} />
                      {/* Gold Member badge */}
                      <div className="flex justify-end z-10 relative">
                        <span className="bg-white/80 text-yellow-500 font-bold px-4 py-1 rounded-full shadow text-sm tracking-wide border border-yellow-200">Gold Member</span>
                      </div>
                      {/* Card number and barcode */}
                      <div className="flex flex-col items-center gap-2 z-10 relative">
                        <div className="text-2xl font-extrabold tracking-widest text-gray-900/90 drop-shadow-sm font-mono mb-2">
                          123 456 789
                        </div>
                        <div className="bg-white/80 rounded-xl p-2 shadow flex items-center justify-center" style={{ width: '80%', minWidth: 180 }}>
                          <Barcode value="123456789" height={48} width={2} displayValue={false} background="#fff" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Offers */}
                <div className="pt-6 pb-20">
                  <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Latest Offers</h3>
                    <button
                        className="text-sm font-medium"
                        style={{ color: secondaryColor }}
                        onClick={() => setActiveNavItem('offers')}
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-10 justify-center">
                    {[
                      { discount: "5%", item: "All Shoes", date: "2025-06-30", isNew: true, icon: <Footprints className="w-8 h-8" /> },
                      { discount: "10%", item: "Summer Collection", date: "2025-07-15", isNew: false, icon: <Sun className="w-8 h-8 text-yellow-400" /> },
                      { discount: "15%", item: "First Purchase", date: null, isNew: false, icon: <ShoppingBag className="w-8 h-8 text-pink-400" /> },
                    ].map((offer, index) => {
                      // Calculate days left for expiry
                      let daysLeft: number | null = null;
                      if (offer.date) {
                        const today = new Date();
                        const expiry = new Date(offer.date);
                        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
                        const expiryUTC = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
                        daysLeft = Math.max(0, Math.ceil((expiryUTC - todayUTC) / (1000 * 60 * 60 * 24)));
                      }
                      return (
                          <div
                              key={index}
                              className="relative flex flex-col items-center w-full max-w-xs bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30 transition-transform hover:scale-105 hover:shadow-2xl"
                              style={{background: 'rgba(255,255,255,0.25)', borderColor: `${primaryColor}30`}}
                          >
                            {/* Picture */}
                            <img
                                src={
                                  offer.item === "All Shoes"
                                      ? "/shoes.jpg"
                                      : offer.item === "Summer Collection"
                                          ? "/summer.jpg"
                                          : "/purchase.jpg"
                                }
                                alt={offer.item}
                                className="w-full h-[100px] rounded-t-2xl object-cover"
                            />
                            {/* Discount badge */}
                            <div
                                className="absolute -top-4 right-10 translate-x-1/2 px-4 py-1 rounded-full text-white font-bold text-sm shadow"
                                style={{backgroundColor: primaryColor, border: `2px solid #fff`}}
                            >
                              -{offer.discount}
                            </div>
                            <div className="pt-8 pb-2 w-full flex flex-col items-center">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold" style={{color: primaryColor}}>{offer.item}</span>
                                {offer.isNew && (
                                    <span
                                        className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600 font-semibold animate-pulse">NEW</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-700 mb-3 text-center">Exclusive offer just for you!
                              </div>
                              {offer.date && daysLeft !== null && (
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                      <span>Expires in</span>
                                      <span className="font-bold text-gray-600">{daysLeft} days</span>
                                    </div>
                                    <div className="w-full h-1 rounded bg-gray-200 overflow-hidden">
                                      <div style={{
                                        width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%`,
                                        backgroundColor: secondaryColor
                                      }} className="h-1 rounded transition-all duration-300"/>
                                    </div>
                                  </div>
                              )}
                              {!offer.date && <div className="text-xs text-green-600 font-semibold">No expiry</div>}
                            </div>
                            <button
                                className="mt-4 w-full text-sm font-bold px-4 py-2 rounded-full shadow transition-colors"
                                style={{backgroundColor: secondaryColor, color: '#fff'}}
                                onClick={() => setOfferModal(offer)}
                            >
                              Claim Offer
                            </button>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
        )

      case "offers":
        return (
            <div className="relative h-full w-full">
              <div
                  className="absolute inset-0 top-0 bottom-16 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#8884] scrollbar-track-[#fff0]"
                  style={{
                    backgroundImage: "url('/images/background/features-bg.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    minHeight: 0,
                    zIndex: 1,
                  }}
              >
                <h3 className="text-2xl font-bold mb-10">Current Offers</h3>
                <div className="flex flex-wrap gap-10 justify-center pb-32">
                  {[
                    { discount: "5%", item: "All Shoes", date: "2025-06-30", isNew: true, icon: <Footprints className="w-8 h-8" /> },
                    { discount: "10%", item: "Summer Collection", date: "2025-07-15", isNew: false, icon: <Sun className="w-8 h-8 text-yellow-400" /> },
                    { discount: "15%", item: "First Purchase", date: null, isNew: false, icon: <ShoppingBag className="w-8 h-8 text-pink-400" /> },
                  ].map((offer, index) => {
                    // Calculate days left for expiry
                    let daysLeft: number | null = null;
                    if (offer.date) {
                      const today = new Date();
                      const expiry = new Date(offer.date);
                      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
                      const expiryUTC = Date.UTC(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
                      daysLeft = Math.max(0, Math.ceil((expiryUTC - todayUTC) / (1000 * 60 * 60 * 24)));
                    }
                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center w-full max-w-xs bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30 transition-transform hover:scale-105 hover:shadow-2xl"
                            style={{ background: 'rgba(255,255,255,0.25)', borderColor: `${primaryColor}30` }}
                        >
                          {/* Picture */}
                          <img
                              src={
                                offer.item === "All Shoes"
                                    ? "/shoes.jpg"
                                    : offer.item === "Summer Collection"
                                        ? "/summer.jpg"
                                        : "/purchase.jpg"
                              }
                              alt={offer.item}
                              className="w-full h-[100px] rounded-t-2xl object-cover"
                          />
                          {/* Discount badge */}
                          <div
                              className="absolute -top-4 right-10 translate-x-1/2 px-4 py-1 rounded-full text-white font-bold text-sm shadow"
                              style={{backgroundColor: primaryColor, border: `2px solid #fff`}}
                          >
                            -{offer.discount}
                          </div>
                          <div className="pt-8 pb-2 w-full flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold" style={{ color: primaryColor }}>{offer.item}</span>
                              {offer.isNew && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600 font-semibold animate-pulse">NEW</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 mb-3 text-center">Exclusive offer just for you!</div>
                            {offer.date && daysLeft !== null && (
                                <div className="w-full flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span>Expires in</span>
                                    <span className="font-bold text-gray-600">{daysLeft} days</span>
                                  </div>
                                  <div className="w-full h-1 rounded bg-gray-200 overflow-hidden">
                                    <div style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%`, backgroundColor: secondaryColor }} className="h-1 rounded transition-all duration-300" />
                                  </div>
                                </div>
                            )}
                            {!offer.date && <div className="text-xs text-green-600 font-semibold">No expiry</div>}
                          </div>
                          <button
                              className="mt-4 w-full text-sm font-bold px-4 py-2 rounded-full shadow transition-colors"
                              style={{ backgroundColor: secondaryColor, color: '#fff' }}
                              onClick={() => setOfferModal(offer)}
                          >
                            Claim Offer
                          </button>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
        )

      case "receipts":
        return (
            <div className="relative h-full w-full">
              <div
                  className="absolute inset-0 top-0 bottom-16 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#8884] scrollbar-track-[#fff0]"
                  style={{zIndex: 1}}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Recent Receipts</h3>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                        <Badge variant="outline" className="mr-2">
                          <span className="text-[10px]">
                            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active
                          </span>
                        </Badge>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-4 w-4"/>
                          Filters
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Date</h4>
                            <Select value={dateFilterType} onValueChange={setDateFilterType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter by date"/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No date filter</SelectItem>
                                <SelectItem value="between">Between dates</SelectItem>
                                <SelectItem value="above">After date</SelectItem>
                                <SelectItem value="below">Before date</SelectItem>
                              </SelectContent>
                            </Select>

                            {dateFilterType === "between" && (
                                <div className="mt-2 grid gap-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-sm mb-1">From</p>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4"/>
                                            {dateRange.from ? dateRange.from.toLocaleDateString() : "Select date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <CalendarComponent
                                              mode="single"
                                              selected={dateRange.from}
                                              onSelect={(date) => setDateRange({...dateRange, from: date})}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <div>
                                      <p className="text-sm mb-1">To</p>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              className="w-full justify-start text-left font-normal"
                                          >
                                            <Calendar className="mr-2 h-4 w-4"/>
                                            {dateRange.to ? dateRange.to.toLocaleDateString() : "Select date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <CalendarComponent
                                              mode="single"
                                              selected={dateRange.to}
                                              onSelect={(date) => setDateRange({...dateRange, to: date})}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {(dateFilterType === "above" || dateFilterType === "below") && (
                                <div className="mt-2">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm"
                                              className="w-full justify-start text-left font-normal">
                                        <Calendar className="mr-2 h-4 w-4"/>
                                        {singleDate ? singleDate.toLocaleDateString() : "Select date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent mode="single" selected={singleDate} onSelect={setSingleDate}/>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Amount</h4>
                            <Select value={amountFilterType} onValueChange={setAmountFilterType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter by amount"/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No amount filter</SelectItem>
                                <SelectItem value="between">Between amounts</SelectItem>
                                <SelectItem value="above">Above amount</SelectItem>
                                <SelectItem value="below">Below amount</SelectItem>
                              </SelectContent>
                            </Select>

                            {amountFilterType === "between" && (
                                <div className="mt-4 px-1">
                                  <div className="flex justify-between mb-2 text-sm">
                                    <span>Min ${amountRange[0]}</span>
                                    <span>Max ${amountRange[1]}</span>
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <Input
                                        type="number"
                                        placeholder={lowerAmount.toString()}
                                        value={lowerAmount}
                                        onChange={(e) => setLowerAmount(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <Input
                                        type="number"
                                        placeholder={upperAmount.toString()}
                                        value={upperAmount}
                                        onChange={(e) => setUpperAmount(Number(e.target.value))}
                                        className="w-full"
                                    />
                                  </div>
                                </div>
                            )}

                            {(amountFilterType === "above" || amountFilterType === "below") && (
                                <div className="mt-2">
                                  <Input
                                      type="number"
                                      placeholder="Enter amount"
                                      value={singleAmount}
                                      onChange={(e) => setSingleAmount(Number(e.target.value))}
                                      className="w-full"
                                  />
                                </div>
                            )}
                          </div>

                          <Button variant="outline" size="sm" className="w-full mt-2" onClick={resetFilters}>
                            <X className="h-4 w-4 mr-2"/>
                            Reset filters
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input
                        placeholder="Search receipts by products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    {searchQuery && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setSearchQuery("")}
                        >
                          <X className="h-4 w-4 text-gray-400"/>
                        </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredReceipts.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p>No receipts found matching your filters.</p>
                        <Button variant="link" onClick={resetFilters} className="mt-2">
                          Reset all filters
                        </Button>
                      </div>
                  ) : (
                      filteredReceipts.map((receipt, index) => {
                        const isExpanded = expandedReceipt === index
                        return (
                            <div
                                key={index}
                                className={`transition-all duration-200 bg-white/80 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden flex flex-col gap-2 hover:shadow-2xl ${isExpanded ? "ring-2 ring-primary/30" : ""}`}
                            >
                              <div className="flex items-center gap-4 mb-2 p-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow border-2 border-white bg-gray-400">
                                  🧾
                                </div>
                                <div className="flex-1">
                                  <div
                                      className="font-semibold text-base text-gray-900">Receipt
                                  </div>
                                  <div className="text-xs text-gray-400">{receipt.date}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-xs text-gray-400 font-mono">{receipt.receiptNo}</div>
                                  <div className="text-lg font-bold mt-1" style={{color: secondaryColor}}>
                                    {receipt.amount}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end px-4 pb-3">
                                <button
                                    className={`text-xs font-semibold px-4 py-1 rounded-full shadow bg-white/90 hover:bg-white border border-gray-200 transition-colors ${isExpanded ? "text-white" : ""}`}
                                    style={{
                                      color: isExpanded ? "#fff" : secondaryColor,
                                      backgroundColor: isExpanded ? secondaryColor : undefined,
                                    }}
                                    onClick={() => setExpandedReceipt(isExpanded ? null : index)}
                                >
                                  {isExpanded ? "Hide Details" : "View Details"}
                                </button>
                              </div>
                              {isExpanded && (
                                  <div className="animate-fade-in px-4 pb-4">
                                    {/* Receipt Details Accordion Content */}
                                    <div
                                        className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 shadow-xl rounded-xl w-full flex flex-col items-center px-0 py-0 overflow-hidden">
                                      {/* Torn edge top */}
                                      <div className="w-full h-4 bg-white flex items-center justify-between">
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 h-4 rounded-b-full bg-gray-200 mx-0.5"
                                                style={{opacity: i % 2 ? 0.3 : 1}}
                                            />
                                        ))}
                                      </div>
                                      <div className="w-full flex flex-col items-center gap-1 pt-4 pb-2 px-6">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow mb-1 bg-gray-400">
                                          🧾
                                        </div>
                                        <span className="text-lg font-bold tracking-wide text-gray-900">
                                          Receipt
                                        </span>
                                        <span className="text-xs text-gray-400">
                            {receipt.date} &middot; {receipt.receiptNo}
                          </span>
                                      </div>
                                      <div className="w-full border-b border-dashed border-gray-300 my-2"/>
                                      <div className="w-full flex flex-col gap-1 px-6 max-h-48 overflow-y-auto">
                                        {receipt.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm py-1">
                              <span className="text-gray-700">
                                {item.icon} {item.name}
                              </span>
                                              <span className="font-mono">{item.price}</span>
                                            </div>
                                        ))}
                                      </div>
                                      <div className="w-full border-b border-dashed border-gray-300 my-2"/>
                                      <div className="w-full flex flex-col gap-1 px-6">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-500">Subtotal</span>
                                          <span className="font-mono text-gray-700">{receipt.amount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-500">Tax</span>
                                          <span className="font-mono text-gray-700">$0.00</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold mt-1">
                                          <span>Total</span>
                                          <span style={{color: secondaryColor}}>{receipt.amount}</span>
                                        </div>
                                      </div>
                                      <div
                                          className="w-full flex justify-between items-center text-xs text-gray-400 px-6 mt-2 mb-1">
                                        <span>Paid with Card</span>
                                        <span>Thank you!</span>
                                      </div>
                                      <div className="flex justify-center mt-2 mb-2">
                                        <Barcode
                                            value={receipt.receiptNo.replace("#", "")}
                                            height={32}
                                            width={1.5}
                                            displayValue={false}
                                            background="#fff"
                                        />
                                      </div>
                                      {/* Torn edge bottom */}
                                      <div className="w-full h-4 bg-white flex items-center justify-between">
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 h-4 rounded-t-full bg-gray-200 mx-0.5"
                                                style={{opacity: i % 2 ? 0.3 : 1}}
                                            />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                              )}
                            </div>
                        )
                      })
                  )}
                </div>
              </div>
            </div>
        )

      case "account":
        return (
            <div className="relative h-full w-full">
              <div
                  className="absolute inset-0 top-0 bottom-16 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-[#8884] scrollbar-track-[#fff0]"
                  style={{zIndex: 1}}
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-24 h-24 mb-4">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <span
                        className="absolute bottom-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow"
                        style={{color: '#fff', backgroundColor: secondaryColor}}
                    >
                    Gold
                  </span>
                  </div>
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <p className="text-gray-600">{emailValue}</p>
                  <p className="text-gray-400 text-xs mt-1">San Francisco, CA</p>
                </div>

                <div className="space-y-6">
                  {/* Edit Profile */}
                  <div className="bg-white/80 rounded-xl shadow p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Edit Profile</div>
                      <div className="text-xs text-gray-400">Change your name and email</div>
                    </div>
                    <button className="text-sm font-semibold px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                            onClick={() => setEditProfileOpen(true)}>
                      Edit
                    </button>
                  </div>
                  {/* Notification Settings */}
                  <div className="bg-white/80 rounded-xl shadow p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Notification Settings</div>
                      <div className="text-xs text-gray-400">Receive updates and offers</div>
                    </div>
                    <button
                        className={`w-12 h-6 rounded-full flex items-center transition-colors ${notifications ? 'bg-green-400' : 'bg-gray-300'}`}
                        onClick={() => setNotifications(n => !n)}
                    >
                      <span
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`}/>
                    </button>
                  </div>
                  {/* Payment Methods */}
                  <div className="bg-white/80 rounded-xl shadow p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Payment Methods</div>
                      <button className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                              onClick={() => setAddCardOpen(true)}>
                        Add Card
                      </button>
                    </div>
                    <div className="space-y-2">
                      {paymentMethods.map((pm, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                        <span
                            className="inline-block w-20 h-6 rounded bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 border border-gray-300"
                            style={{
                              minWidth: 80,
                              maxWidth: 100,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                          {pm.type}
                        </span>
                            <span className="font-mono tracking-widest text-lg text-gray-800">•••• {pm.last4}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                  {/* Privacy Settings */}
                  <div className="bg-white/80 rounded-xl shadow p-4">
                    <div className="font-semibold mb-2">Privacy Settings</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Show my email</span>
                      <button
                          className={`w-10 h-5 rounded-full flex items-center transition-colors ${privacy.showEmail ? 'bg-green-400' : 'bg-gray-300'}`}
                          onClick={() => setPrivacy(p => ({...p, showEmail: !p.showEmail}))}
                      >
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${privacy.showEmail ? 'translate-x-5' : 'translate-x-1'}`}/>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show my profile publicly</span>
                      <button
                          className={`w-10 h-5 rounded-full flex items-center transition-colors ${privacy.showProfile ? 'bg-green-400' : 'bg-gray-300'}`}
                          onClick={() => setPrivacy(p => ({...p, showProfile: !p.showProfile}))}
                      >
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${privacy.showProfile ? 'translate-x-5' : 'translate-x-1'}`}/>
                      </button>
                    </div>
                  </div>
                  {/* Help & Support */}
                  <div className="bg-white/80 rounded-xl shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Help & Support</div>
                        <div className="text-xs text-gray-400">Contact us for assistance</div>
                      </div>
                      <button className="text-sm font-semibold px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                              onClick={() => setHelpOpen(open => !open)}>
                        {helpOpen ? 'Close' : 'Open'}
                      </button>
                    </div>
                    {helpOpen && (
                        <div className="mt-4 p-4 rounded-lg bg-gray-50 border text-sm animate-fade-in">
                          <div className="font-bold text-lg mb-2">Help & Support</div>
                          <div className="text-gray-600 mb-1">For assistance, contact us at:</div>
                          <div className="font-semibold text-blue-600 mb-1">office@receivt.ro</div>
                          <div className="text-xs text-gray-400">We usually reply within 24 hours.</div>
                        </div>
                    )}
                  </div>
                  {/* Log Out */}
                  <div className="bg-white/80 rounded-xl shadow p-4 flex items-center justify-between">
                    <div className="font-semibold">Log Out</div>
                    <button
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-200 shadow transition-all"
                        onClick={() => alert('Logged out!')}
                    >
                      <LogOut className="w-4 h-4"/>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* Edit Profile Modal */}
                {editProfileOpen && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center"
                         style={{background: 'rgba(0,0,0,0.13)'}}>
                      <div
                          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs flex flex-col gap-4 relative overflow-y-auto max-h-[90vh]">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setEditProfileOpen(false)}>
                          <span className="sr-only">Close</span>
                          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"
                               strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                        <div className="font-bold text-lg mb-2">Edit Profile</div>
                        <input
                            className="border rounded px-3 py-2 text-sm"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Name"
                        />
                        <input
                            className="border rounded px-3 py-2 text-sm"
                            value={emailValue}
                            onChange={e => setEmailValue(e.target.value)}
                            placeholder="Email"
                        />
                        <button
                            className="mt-2 w-full text-sm font-bold px-4 py-2 rounded-full shadow transition-colors bg-blue-600 text-white"
                            onClick={() => setEditProfileOpen(false)}>
                          Save
                        </button>
                      </div>
                    </div>
                )}
                {/* Add Card Modal */}
                {addCardOpen && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center"
                         style={{background: 'rgba(0,0,0,0.13)'}}>
                      <div
                          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs flex flex-col gap-4 relative overflow-y-auto max-h-[90vh]">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setAddCardOpen(false)}>
                          <span className="sr-only">Close</span>
                          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"
                               strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                        <div className="font-bold text-lg mb-2">Add Card</div>
                        <select className="border rounded px-3 py-2 text-sm" value={newCard.type}
                                onChange={e => setNewCard(c => ({...c, type: e.target.value}))}>
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Amex">Amex</option>
                        </select>
                        <input
                            className="border rounded px-3 py-2 text-sm"
                            value={newCard.last4}
                            onChange={e => setNewCard(c => ({...c, last4: e.target.value}))}
                            placeholder="Last 4 digits"
                            maxLength={4}
                        />
                        <button
                            className="mt-2 w-full text-sm font-bold px-4 py-2 rounded-full shadow transition-colors bg-blue-600 text-white"
                            onClick={() => {
                              if (newCard.last4.length === 4) {
                                setPaymentMethods(cards => [...cards, newCard]);
                                setNewCard({type: "Visa", last4: ""});
                                setAddCardOpen(false);
                              }
                            }}
                        >
                          Add Card
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
        )
      case "contact":
        return (
            <div className="container mx-auto py-12 px-4 md:px-6">
              <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

              {/* Social Media Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5"/>
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5"/>
                      Instagram
                    </a>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://receivt.ro" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5"/>
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-5 w-5"/>
                      Facebook
                    </a>
                  </Button>
                </div>
              </section>

              {/* Map Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full h-[400px]">
                      <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91158.11409353752!2d25.99180271640625!3d44.43773116519314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucharest%2C%20Romania!5e0!3m2!1sen!2sus!4v1683900254395!5m2!1sen!2sus"
                          width="100%"
                          height="100%"
                          style={{border: 0}}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Bucharest Map"
                          className="absolute inset-0"
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-4 flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                  <p>Bucharest, Romania</p>
                </div>
              </section>

              {/* Contact Form Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">Keep in Touch With Us</h2>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[120px]"/>
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </section>

              <section>
                <div className="space-y-6 pt-6 pb-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 p-2 rounded-full">
                      <Phone className="h-5 w-5"/>
                    </div>
                    <p>+40 123 456 789</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 p-2 rounded-full">
                      <Mail className="h-5 w-5"/>
                    </div>
                    <p>contact@example.com</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-full mt-0.5">
                      <MapPin className="h-5 w-5"/>
                    </div>
                    <p>123 Business Street, Bucharest, Romania</p>
                  </div>
                </div>
      </section>
      </div>
      )

      default:
        return null
    }
  }

  const phonePreviewRef = React.useRef
      < HTMLDivElement > (null);
  const scrollableContentRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top when any modal is opened
  React.useEffect(() => {
    if (
        offerModal ||
        editProfileOpen ||
        addCardOpen ||
        helpOpen ||
        expandedReceipt
    ) {
      scrollableContentRef.current?.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [offerModal, editProfileOpen, addCardOpen, helpOpen, expandedReceipt]);

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Color customization sidebar */}
        <div className="lg:col-span-1 space-y-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium">Customize Your App</h3>

          {/* Live preview of logo and colors */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center border shadow"
                 style={{backgroundColor: primaryColor}}>
              {logo ? (
                  <img src={logo || "/placeholder.svg"} alt="Logo" className="h-8 w-8 object-contain"/>
              ) : (
                  <span className="text-white text-lg font-bold">R</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Primary</span>
              <div className="w-8 h-4 rounded" style={{backgroundColor: primaryColor}}/>
              <span className="text-xs text-gray-500">Secondary</span>
              <div className="w-8 h-4 rounded" style={{backgroundColor: secondaryColor}}/>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Primary Color</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border shadow-sm" style={{backgroundColor: primaryColor}}></div>
                <div className="flex-1">
                  <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-8 text-sm"
                  />
                </div>
                <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-8"
                />
              </div>
              {/* Color swatches */}
              <div className="flex gap-2 mt-1">
                {["#2563eb", "#16a34a", "#f59e42", "#e11d48", "#7c3aed", "#111827"].map((color) => (
                    <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{
                          backgroundColor: color,
                          outline: primaryColor === color ? `2px solid ${color}` : undefined
                        }}
                        onClick={() => setPrimaryColor(color)}
                        title={color}
                    />
                ))}
              </div>
              <span className="text-xs text-gray-400">Pick a color or use a HEX code</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Secondary Color</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border shadow-sm" style={{backgroundColor: secondaryColor}}></div>
                <div className="flex-1">
                  <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-8 text-sm"
                  />
                </div>
                <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-8 w-8"
                />
              </div>
              {/* Color swatches */}
              <div className="flex gap-2 mt-1">
                {["#f59e42", "#2563eb", "#16a34a", "#e11d48", "#7c3aed", "#111827"].map((color) => (
                    <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: color, outline: secondaryColor === color ? `2px solid ${color}` : undefined }}
                        onClick={() => setSecondaryColor(color)}
                        title={color}
                    />
                ))}
              </div>
              <span className="text-xs text-gray-400">Pick a color or use a HEX code</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Configuration Summary</h3>
            <div className="space-y-2 text-sm">
              {logo && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Logo:</span>
                    <div className="h-6 w-6 overflow-hidden">
                      <img src={logo || "/placeholder.svg"} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                  </div>
              )}
              <div>
                <span className="font-medium">Primary Color:</span> {primaryColor}
              </div>
              <div>
                <span className="font-medium">Secondary Color:</span> {secondaryColor}
              </div>
            </div>
          </div>
        </div>

        {/* Phone preview */}
        <div className="lg:col-span-2 flex justify-center">
          <div ref={phonePreviewRef} className="w-[360px] h-[720px] border-8 border-black rounded-[3rem] overflow-hidden shadow-xl relative">
            <div className="h-full bg-white relative">
              {/* App Header */}
              <div className="h-16 flex items-center justify-center px-6" style={{ backgroundColor: primaryColor }}>
                <div className="w-12 h-12 rounded-full bg-white/80 shadow-lg border-2 border-white flex items-center justify-center mx-auto">
                  {logo ? (
                      <img src={logo || "/placeholder.svg"} alt="Business Logo" className="h-8 w-8 object-contain" />
                  ) : (
                      <span className="text-gray-700 text-xl font-bold">R</span>
                  )}
                </div>
              </div>

              {/* Page Content & Modal strictly inside app area */}
              <div ref={scrollableContentRef} className="h-[calc(100%-4rem)] overflow-y-auto relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                      key={activeNavItem}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="h-full w-full"
                  >
                    {renderPageContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Modals rendered as siblings to scrollable content, overlaying the phone preview */}
              {offerModal && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.18)' }}>
                    <div className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-2xl p-8 max-w-xs w-full flex flex-col items-center gap-4 relative">
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setOfferModal(null)}>
                        <span className="sr-only">Close</span>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white mx-auto" style={{ backgroundColor: secondaryColor }}>
                        {offerModal.icon}
                      </div>
                      <span className="px-4 py-1 rounded-full text-white font-bold text-lg shadow" style={{ backgroundColor: primaryColor, border: `2px solid #fff` }}>
                    -{offerModal.discount}
                  </span>
                      <h2 className="text-2xl font-extrabold tracking-tight text-center">{offerModal.item}</h2>
                      <p className="text-gray-600 text-center">Enjoy this exclusive offer! Use it before it expires.</p>
                      {offerModal.date && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Expires on</span>
                            <span className="font-bold text-gray-600">{offerModal.date}</span>
                          </div>
                      )}
                      {!offerModal.date && <div className="text-xs text-green-600 font-semibold">No expiry</div>}
                      <button
                          className="mt-4 w-full text-base font-bold px-6 py-3 rounded-full shadow transition-colors"
                          style={{ backgroundColor: secondaryColor, color: '#fff' }}
                          onClick={() => setOfferModal(null)}
                      >
                        Claim Now
                      </button>
                    </div>
                  </div>
              )}

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-6 bg-white">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className="flex flex-col items-center gap-1"
                        onClick={() => setActiveNavItem(item.id)}
                    >
                      <div
                          className={activeNavItem === item.id ? "" : "text-gray-400"}
                          style={{ color: activeNavItem === item.id ? primaryColor : undefined }}
                      >
                        {item.icon}
                      </div>
                      <span
                          className={`text-xs ${activeNavItem === item.id ? "font-medium" : "text-gray-400"}`}
                          style={{ color: activeNavItem === item.id ? primaryColor : undefined }}
                      >
                    {item.label}
                  </span>
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
