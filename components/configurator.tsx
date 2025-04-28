"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Configurator() {
  const [logo, setLogo] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [logoError, setLogoError] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#00796b")
  const [secondaryColor, setSecondaryColor] = useState("#4db6ac")
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("home")
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState("#000000")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
        setLogoError(null)
      }
      reader.onerror = () => {
        setLogoError("Error reading file. Please try again.")
      }
      reader.readAsDataURL(file)
    } else {
      setLogoError("Please upload an image file.")
    }
  }

  const validateInput = (input: string) => {
    // Regex to match a valid website format (e.g., anything.domain)
    const websiteRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return websiteRegex.test(input);
  };

  const extractColorsFromLogo = async (logoUrl: string) => {
    try {
      const response = await fetch(`/api/extract-colors?url=${encodeURIComponent(logoUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to extract colors');
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setExtractedColors(data.colors);
        // Set the first two colors as primary and secondary if available
        if (data.colors.length >= 2) {
          setPrimaryColor(data.colors[0]);
          setSecondaryColor(data.colors[1]);
        }
      }
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  };

  const handleLogoExtraction = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/extract-logo?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }
      const data = await response.json();
      if (data.logoUrl) {
        setLogo(data.logoUrl);
        setLogoError(null);
        // Extract colors from the logo
        await extractColorsFromLogo(data.logoUrl);
      } else {
        setLogoError("No logo found for this website.");
      }
    } catch (error) {
      setLogoError("Error extracting logo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteSubmit = async () => {
    if (!websiteUrl) {
      setLogoError("Please enter a website URL");
      return;
    }

    if (validateInput(websiteUrl)) {
      setLogoError(null);
      const formattedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
      await handleLogoExtraction(formattedUrl);
    } else {
      setLogoError("Please enter a valid website (e.g., example.com).");
    }
  };

  const predefinedColors = [
    "#00796b", "#2E7D32", "#D32F2F", "#F57C00", "#7B1FA2", "#006064",
    "#4db6ac", "#81c784", "#e57373", "#ffb74d", "#ba68c8", "#4dd0e1"
  ]

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "offers",
      label: "Offers",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "receipts",
      label: "Receipts",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "account",
      label: "Account",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

  const renderPageContent = () => {
    switch (activeNavItem) {
      case 'home':
        return (
          <div className="h-full">
            {/* Welcome Banner */}
            <div 
              className="px-6 py-8"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <h3 className="text-xl mb-2">Welcome back!</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Your points</p>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>2,450</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
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
                <button 
                  className="text-sm font-medium"
                  style={{ color: primaryColor }}
                >
                  View Details
                </button>
              </div>
              
              <div className="relative">
                <div 
                  className="w-full rounded-xl p-6"
                  style={{ 
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 20px ${primaryColor}20`
                  }}
                >
                  <div className="flex justify-between items-start mb-8">
                    {logo ? (
                      <img src={logo} alt="Business Logo" className="h-8 object-contain" />
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
                <button 
                  className="text-sm font-medium"
                  style={{ color: primaryColor }}
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { discount: '5%', item: 'All Shoes', date: '30 Jun', isNew: true },
                  { discount: '10%', item: 'Summer Collection', date: '15 Jul', isNew: false }
                ].map((offer, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border flex items-start gap-4"
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <div 
                      className="p-2 rounded-lg shrink-0"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <svg 
                        className="w-6 h-6"
                        style={{ color: primaryColor }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
                              backgroundColor: `${primaryColor}10`,
                              color: primaryColor
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
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor
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
      
      case 'offers':
        return (
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6">Current Offers</h3>
            <div className="space-y-4">
              {[
                { discount: '5%', item: 'All Shoes', date: '30 Jun' },
                { discount: '10%', item: 'Summer Collection', date: '15 Jul' },
                { discount: '15%', item: 'First Purchase', date: 'No expiry' }
              ].map((offer, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: primaryColor }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: primaryColor }}>-{offer.discount} OFF</div>
                      <div className="text-lg">{offer.item}</div>
                      <p className="mt-2 text-sm text-gray-600">Available until {offer.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'receipts':
        return (
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6">Recent Receipts</h3>
            <div className="space-y-4">
              {[
                { date: '2024-03-15', amount: '$120.00', items: '3 items' },
                { date: '2024-03-10', amount: '$85.50', items: '2 items' },
                { date: '2024-03-05', amount: '$230.00', items: '4 items' }
              ].map((receipt, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{receipt.date}</div>
                    <div className="text-sm text-gray-600">{receipt.items}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: primaryColor }}>{receipt.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'account':
        return (
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: primaryColor }}
              >
                JD
              </div>
              <h3 className="text-2xl font-bold">John Doe</h3>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
            
            <div className="space-y-4">
              {[
                'Edit Profile',
                'Notification Settings',
                'Payment Methods',
                'Privacy Settings',
                'Help & Support',
                'Log Out'
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border rounded-lg flex items-center justify-between hover:bg-gray-50"
                >
                  <span>{item}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Loyalty App Preview Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Customization Panel */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Customize Your App</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your website (e.g., example.com)"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleWebsiteSubmit}
                      disabled={isLoading}
                      style={{ 
                        backgroundColor: primaryColor,
                        color: 'white'
                      }}
                    >
                      {isLoading ? "Loading..." : "Extract Logo"}
                    </Button>
                  </div>
                  {logoError && (
                    <p className="text-sm text-red-600">{logoError}</p>
                  )}
                  {logo && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium mb-2">Extracted Logo:</p>
                      <img src={logo} alt="Extracted Logo" className="max-h-20 object-contain" />
                      <Button
                        onClick={() => {
                          setLogo(null)
                          setWebsiteUrl("")
                          setLogoError(null)
                        }}
                        variant="outline"
                        className="mt-2 text-sm"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Colors</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="text-xs"
                    >
                      {showColorPicker ? "Hide Picker" : "Add Custom Color"}
                    </Button>
                  </div>

                  {showColorPicker && (
                    <div className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-12 h-12 p-1 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="px-3 py-2 border rounded-md w-32"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!extractedColors.includes(customColor)) {
                              setExtractedColors([...extractedColors, customColor]);
                            }
                            setShowColorPicker(false);
                          }}
                        >
                          Add Color
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Primary Color</label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-12 p-1 rounded cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="px-3 py-2 border rounded-md w-32"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Secondary Color</label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-12 h-12 p-1 rounded cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="px-3 py-2 border rounded-md w-32"
                        />
                      </div>
                    </div>
                  </div>

                  {extractedColors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Colors from Logo</p>
                      <div className="flex flex-wrap gap-2">
                        {extractedColors.map((color, index) => (
                          <button
                            key={index}
                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                              (primaryColor === color || secondaryColor === color) ? 'ring-2 ring-offset-2 ring-[#00796b]' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              if (index % 2 === 0) {
                                setPrimaryColor(color);
                              } else {
                                setSecondaryColor(color);
                              }
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="relative">
          <div className="w-[360px] h-[720px] mx-auto border-8 border-black rounded-[3rem] overflow-hidden shadow-xl">
            <div className="h-full bg-white relative">
              {/* App Header */}
              <div className="h-16 flex items-center px-6" style={{ backgroundColor: primaryColor }}>
                {logo && (
                  <img src={logo} alt="Business Logo" className="h-8 object-contain" />
                )}
                {!logo && (
                  <span className="text-white text-xl font-semibold">Receivt</span>
                )}
              </div>

              {/* Page Content */}
              <div className="h-[calc(100%-4rem)] overflow-y-auto">
                {renderPageContent()}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center px-6 bg-white">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className="flex flex-col items-center gap-1"
                    onClick={() => setActiveNavItem(item.id)}
                  >
                    <div className={`w-6 h-6 ${activeNavItem === item.id ? `text-[${primaryColor}]` : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span 
                      className={`text-xs ${activeNavItem === item.id ? `text-[${primaryColor}]` : 'text-gray-400'}`}
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
    </section>
  )
}