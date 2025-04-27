"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

type LoyaltyType = "card" | "points" | "tiers"
type PromotionsType = "coupons" | "discounts" | "points"
type ReceiptsType = "list" | "recent"

export default function Configurator() {
  const [step, setStep] = useState(1)
  const [brandName, setBrandName] = useState("")
  const [loyaltyType, setLoyaltyType] = useState<LoyaltyType | null>(null)
  const [promotionsType, setPromotionsType] = useState<PromotionsType | null>(null)
  const [receiptsType, setReceiptsType] = useState<ReceiptsType | null>(null)
  const [email, setEmail] = useState("")
  const [showPreview, setShowPreview] = useState(false)

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["card", "points", "tiers"].map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <div className="relative w-[220px] h-[400px] mb-4 rounded-3xl overflow-hidden border-4 border-gray-200">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-white flex items-center px-4">
                      <div className="text-xs">9:30</div>
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <div className="w-4 h-1 bg-black"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black mx-auto w-1/3"></div>
                  </div>
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full max-w-[220px] ${
                      loyaltyType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setLoyaltyType(type as LoyaltyType)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["coupons", "discounts", "points"].map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <div className="relative w-[220px] h-[400px] mb-4 rounded-3xl overflow-hidden border-4 border-gray-200">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-white flex items-center px-4">
                      <div className="text-xs">9:30</div>
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <div className="w-4 h-1 bg-black"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black mx-auto w-1/3"></div>
                  </div>
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full max-w-[220px] ${
                      promotionsType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setPromotionsType(type as PromotionsType)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {["list", "recent"].map((type) => (
                <div key={type} className="flex flex-col items-center">
                  <div className="relative w-[220px] h-[400px] mb-4 rounded-3xl overflow-hidden border-4 border-gray-200">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-white flex items-center px-4">
                      <div className="text-xs">9:30</div>
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <div className="w-4 h-1 bg-black"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black mx-auto w-1/3"></div>
                  </div>
                  <Button
                    className={`bg-[#26a269] hover:bg-[#26a269]/90 text-white w-full max-w-[220px] ${
                      receiptsType === type ? "ring-2 ring-offset-2 ring-[#083118]" : ""
                    }`}
                    onClick={() => {
                      setReceiptsType(type as ReceiptsType)
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

  const renderPreview = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-[#083118]">Preview the branded app you created:</h2>
        <div className="flex justify-center">
          <div className="relative w-[280px] h-[500px] rounded-3xl overflow-hidden border-4 border-gray-200">
            <div className="absolute top-0 left-0 right-0 h-8 bg-white flex items-center px-4">
              <div className="text-xs">9:30</div>
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-black"></div>
                <div className="w-4 h-1 bg-black"></div>
              </div>
            </div>
            <div className="p-4 bg-white h-full">
              <div className="text-xl font-bold text-[#083118] mb-4">{brandName || "Your Brand"}</div>

              <div className="space-y-4">
                <div className="p-3 bg-[#083118]/5 rounded-lg">
                  <div className="text-sm font-medium text-[#083118]">Loyalty Program</div>
                  <div className="text-xs text-[#083118]/70">
                    {loyaltyType === "card"
                      ? "Card-based loyalty"
                      : loyaltyType === "points"
                        ? "Points-based rewards"
                        : loyaltyType === "tiers"
                          ? "Tier-based membership"
                          : "Custom loyalty program"}
                  </div>
                </div>

                <div className="p-3 bg-[#083118]/5 rounded-lg">
                  <div className="text-sm font-medium text-[#083118]">Promotions</div>
                  <div className="text-xs text-[#083118]/70">
                    {promotionsType === "coupons"
                      ? "Digital coupons"
                      : promotionsType === "discounts"
                        ? "Personalized discounts"
                        : promotionsType === "points"
                          ? "Points-based offers"
                          : "Custom promotions"}
                  </div>
                </div>

                <div className="p-3 bg-[#083118]/5 rounded-lg">
                  <div className="text-sm font-medium text-[#083118]">Digital Receipts</div>
                  <div className="text-xs text-[#083118]/70">
                    {receiptsType === "list"
                      ? "Organized receipt list"
                      : receiptsType === "recent"
                        ? "Recent receipts view"
                        : "Custom receipt format"}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black mx-auto w-1/3"></div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] px-8 py-6 text-lg"
            onClick={() => (window.location.href = "#contact")}
          >
            Get Your Custom App
          </Button>
        </div>
      </div>
    )
  }

  // Previous code remains the same...

  // Previous code remains the same...

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