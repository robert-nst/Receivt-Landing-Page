"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

type LoyaltyType = "card" | "points" | "tiers"
type PromotionsType = "coupons" | "discounts" | "points"
type ReceiptsType = "list" | "recent"

const loyaltyImages = {
  card: "/images/configurator/loyalty-1.png",
  points: "/images/configurator/loyalty-2.png",
  tiers: "/images/configurator/loyalty-3.png",
};

const promotionsImages = {
  coupons: "/images/configurator/promotions-1.png",
  discounts: "/images/configurator/promotions-2.png",
  points: "/images/configurator/promotions-3.png",
};

const receiptsImages = {
  list: "/images/configurator/receipts-1.png",
  recent: "/images/configurator/receipts-2.png",
};

const imageStyle = { maxWidth: 300, maxHeight: 600 };

const previewTabs = [
  { key: "loyalty", label: "Loyalty" },
  { key: "promotions", label: "Promotions" },
  { key: "receipts", label: "Receipts" },
];

export default function Configurator() {
  const [step, setStep] = useState(1)
  const [brandName, setBrandName] = useState("")
  const [loyaltyType, setLoyaltyType] = useState<LoyaltyType | null>(null)
  const [promotionsType, setPromotionsType] = useState<PromotionsType | null>(null)
  const [receiptsType, setReceiptsType] = useState<ReceiptsType | null>(null)
  const [email, setEmail] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("loyalty")

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      setShowPreview(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">Enter the name of your own brand:</h2>
            <div className="max-w-md mx-auto">
              <Input
                className="h-14 border-[#083118] bg-white text-[#083118]"
                placeholder="Your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button
                className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] px-8 py-6 text-lg"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">Choose your loyalty page appearance:</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              {(["card", "points", "tiers"] as LoyaltyType[]).map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <img
                    src={loyaltyImages[type]}
                    alt={type}
                    style={imageStyle}
                  />
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full mt-4 px-8 py-6 text-lg ${
                      loyaltyType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setLoyaltyType(type)
                      handleNext()
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">Choose your promotions page appearance:</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              {(["coupons", "discounts", "points"] as PromotionsType[]).map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <img
                    src={promotionsImages[type]}
                    alt={type}
                    style={imageStyle}
                  />
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full mt-4 px-8 py-6 text-lg ${
                      promotionsType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setPromotionsType(type)
                      handleNext()
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">
              Choose your digital receipts page appearance:
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              {(["list", "recent"] as ReceiptsType[]).map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <img
                    src={receiptsImages[type]}
                    alt={type}
                    style={imageStyle}
                  />
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full mt-4 px-8 py-6 text-lg ${
                      receiptsType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setReceiptsType(type)
                      handleNext()
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-[#083118]">
              Enter your email to get the result and to stay in touch with us:
            </h2>
            <div className="max-w-md mx-auto">
              <Input
                className="h-14 border-[#083118] bg-white text-[#083118]"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Button
                className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] px-8 py-6 text-lg"
                onClick={handleNext}
              >
                Get Results
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-gray-600" onClick={handleNext}>
                Skip
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Tabbed preview for the last step
  const renderPreview = () => {
    let imageSrc = "";
    let imageAlt = "";

    if (activeTab === "loyalty" && loyaltyType) {
      imageSrc = loyaltyImages[loyaltyType];
      imageAlt = loyaltyType;
    } else if (activeTab === "promotions" && promotionsType) {
      imageSrc = promotionsImages[promotionsType];
      imageAlt = promotionsType;
    } else if (activeTab === "receipts" && receiptsType) {
      imageSrc = receiptsImages[receiptsType];
      imageAlt = receiptsType;
    }

    return (
      <div className="flex flex-col items-center bg-transparent">
        <div className="mb-4 flex justify-center gap-4">
          {previewTabs.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-[#083118] text-[#fffff3]"
                  : "bg-[#e6f4ec] text-[#083118] hover:bg-[#cde9db]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={imageStyle}
          />
        )}
        <Button
          className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] mt-8 px-8 py-6 text-lg"
          onClick={() => (window.location.href = "#contact")}
        >
          Get Your Custom App
        </Button>
      </div>
    );
  };

  const renderProgressBar = () => {
    return (
      <div className="flex items-center justify-center w-full max-w-4xl mx-auto mb-12">
        <div className="relative w-full">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#26a269] -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                  ${stepNumber <= step ? "bg-[#26a269]" : "bg-white border-2 border-[#26a269]"}`}
              >
                {stepNumber < step && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section 
      id="configurator" 
      className="w-full py-20 bg-no-repeat min-h-[85vh] flex flex-col justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/background/configurator-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center"
      }}
    >
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#083118] mb-4">
            Ever wondered how your app could look? See it in 30 seconds!
          </h2>
          <p className="text-[#083118]/70 max-w-2xl mx-auto">
            Follow these simple steps to visualize your own branded digital service app.
          </p>
        </div>

        {!showPreview && renderProgressBar()}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="py-8"
          >
            {showPreview ? renderPreview() : getStepContent()}
          </motion.div>
        </AnimatePresence>

        {!showPreview && step > 1 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="border-[#083118] text-[#083118]" onClick={handleBack}>
              Back
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}