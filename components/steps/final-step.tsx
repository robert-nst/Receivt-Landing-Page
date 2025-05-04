"use client"

import { Home, Gift, FileText, User } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  ]

  const renderPageContent = () => {
    switch (activeNavItem) {
      case "home":
        return (
          <div className="h-full">
            {/* Welcome Banner */}
            <div className="px-6 py-8" style={{ backgroundColor: `${primaryColor}10` }}>
              <h3 className="text-xl mb-2">Welcome back!</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Your points</p>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>
                    2,450
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Loyalty Card Section */}
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Loyalty Card</h3>
                <button className="text-sm font-medium" style={{ color: secondaryColor }}>
                  View Details
                </button>
              </div>

              <div className="relative">
                <div
                  className="w-full rounded-xl p-6"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 20px ${primaryColor}20`,
                  }}
                >
                  <div className="flex justify-between items-start mb-8">
                    {logo ? (
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Business Logo"
                        className="h-8 object-contain bg-white/20 p-1 rounded"
                      />
                    ) : (
                      <span className="text-white text-xl font-semibold">Receivt</span>
                    )}
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="text-white text-sm">Gold Member</span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="w-full h-12 bg-black/20 rounded mb-2"></div>
                    <p className="text-white text-center font-mono text-lg tracking-wider">123 456 789</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/60 text-xs">Valid Until</p>
                      <p className="text-white text-sm">12/25</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Status</p>
                      <p className="text-white text-sm">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Offers */}
            <div className="px-6 pb-20">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Latest Offers</h3>
                <button className="text-sm font-medium" style={{ color: secondaryColor }}>
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { discount: "5%", item: "All Shoes", date: "30 Jun", isNew: true },
                  { discount: "10%", item: "Summer Collection", date: "15 Jul", isNew: false },
                ].map((offer, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border flex items-start gap-4"
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${secondaryColor}20` }}>
                      <svg
                        className="w-6 h-6"
                        style={{ color: secondaryColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>
                          -{offer.discount} OFF
                        </span>
                        {offer.isNew && (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${secondaryColor}20`,
                              color: secondaryColor,
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{offer.item}</p>
                      <p className="text-xs text-gray-500 mt-1">Valid until {offer.date}</p>
                    </div>
                    <button
                      className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: `${secondaryColor}10`,
                        color: secondaryColor,
                      }}
                    >
                      Use Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "offers":
        return (
          <div className="p-6"
            style={{
              backgroundImage: "url('/images/background/features-bg.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}>
            <h3 className="text-2xl font-bold mb-6">Current Offers</h3>
            <div className="space-y-4">
              {[
                { discount: "5%", item: "All Shoes", date: "30 Jun" },
                { discount: "10%", item: "Summer Collection", date: "15 Jul" },
                { discount: "15%", item: "First Purchase", date: "No expiry" },
              ].map((offer, index) => (
                <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: `${secondaryColor}10` }}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: primaryColor }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: secondaryColor }}>
                        -{offer.discount} OFF
                      </div>
                      <div className="text-lg">{offer.item}</div>
                      <p className="mt-2 text-sm text-gray-600">Available until {offer.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "receipts":
        return (
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6">Recent Receipts</h3>
            <div className="space-y-4">
              {[
                { date: "2024-03-15", amount: "$120.00", items: "3 items" },
                { date: "2024-03-10", amount: "$85.50", items: "2 items" },
                { date: "2024-03-05", amount: "$230.00", items: "4 items" },
              ].map((receipt, index) => (
                <div key={index} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">{receipt.date}</div>
                    <div className="text-sm text-gray-600">{receipt.items}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: secondaryColor }}>
                      {receipt.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "account":
        return (
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: secondaryColor }}
              >
                JD
              </div>
              <h3 className="text-2xl font-bold">John Doe</h3>
              <p className="text-gray-600">{email || "john.doe@example.com"}</p>
            </div>

            <div className="space-y-4">
              {[
                "Edit Profile",
                "Notification Settings",
                "Payment Methods",
                "Privacy Settings",
                "Help & Support",
                "Log Out",
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border rounded-lg flex items-center justify-between hover:bg-gray-50"
                >
                  <span>{item}</span>
                  <svg
                    className="w-5 h-5"
                    style={{ color: secondaryColor }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Color customization sidebar */}
      <div className="lg:col-span-1 space-y-6 p-4 border rounded-lg">
        <h3 className="text-lg font-medium">Customize Your App</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs text-gray-500">Primary Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: primaryColor }}></div>
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
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-500">Secondary Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: secondaryColor }}></div>
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
            <div>
              <span className="font-medium">Email:</span> {email || "Not provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Phone preview */}
      <div className="lg:col-span-2 flex justify-center">
        <div className="w-[360px] h-[720px] border-8 border-black rounded-[3rem] overflow-hidden shadow-xl">
          <div className="h-full bg-white relative">
            {/* App Header */}
            <div className="h-16 flex items-center px-6" style={{ backgroundColor: primaryColor }}>
              {logo && <img src={logo || "/placeholder.svg"} alt="Business Logo" className="h-8 object-contain" />}
              {!logo && <span className="text-white text-xl font-semibold">Receivt</span>}
            </div>

            {/* Page Content */}
            <div className="h-[calc(100%-4rem)] overflow-y-auto">{renderPageContent()}</div>

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
