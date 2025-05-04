"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoStep from "@/components/steps/logo-step"
import ColorStep from "@/components/steps/color-step"
import EmailStep from "@/components/steps/email-step"
import FinalStep from "@/components/steps/final-step"

export default function Configurator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [logo, setLogo] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#00796b")
  const [secondaryColor, setSecondaryColor] = useState("#4db6ac")
  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("home")

  const steps = [
    { id: 1, name: "Logo" },
    { id: 2, name: "Colors" },
    { id: 3, name: "Email" },
    { id: 4, name: "Preview" },
  ]

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Determine if the next button should be enabled
  const isNextButtonEnabled = () => {
    switch (currentStep) {
      case 1: // Logo step
        return logo !== null
      case 2: // Colors step
        return true // Always enabled for colors
      case 3: // Email step
        return isEmailValid
      default:
        return true
    }
  }

  return (
      <section id="configurator" className="container mx-auto px-4 py-12"
        style={{
          backgroundImage: "url('/images/background/features-bg.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}>
        <h1 className="text-3xl font-bold text-center mb-12">Loyalty App Preview Generator</h1>
        <div className="rounded-xl shadow-lg overflow-hidden">
          {/* Step indicator */}
          <div className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
                </h2>
                <div className="flex gap-2">
                  {steps.map((step) => (
                      <div
                          key={step.id}
                          className={`w-3 h-3 rounded-full ${
                              currentStep === step.id ? "bg-primary" : currentStep > step.id ? "bg-primary/50" : "bg-gray-200"
                          }`}
                          style={{
                            backgroundColor:
                                currentStep === step.id ? primaryColor : currentStep > step.id ? `${primaryColor}80` : "",
                          }}
                      ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="p-6">
            {currentStep === 1 && (
                <LogoStep
                    logo={logo}
                    setLogo={setLogo}
                    websiteUrl={websiteUrl}
                    setWebsiteUrl={setWebsiteUrl}
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    setSecondaryColor={setSecondaryColor}
                />
            )}
            {currentStep === 2 && (
                <ColorStep
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    secondaryColor={secondaryColor}
                    setSecondaryColor={setSecondaryColor}
                />
            )}
            {currentStep === 3 && (
                <EmailStep
                    email={email}
                    setEmail={setEmail}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    setIsEmailValid={setIsEmailValid}
                />
            )}
            {currentStep === 4 && (
                <FinalStep
                    logo={logo}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    email={email}
                    setPrimaryColor={setPrimaryColor}
                    setSecondaryColor={setSecondaryColor}
                    activeNavItem={activeNavItem}
                    setActiveNavItem={setActiveNavItem}
                />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 1}>
              <ArrowLeft className="mr-2 h-4 w-4"/>
              Previous
            </Button>

            {currentStep < steps.length && (
                <Button
                    onClick={goToNextStep}
                    disabled={!isNextButtonEnabled()}
                    style={{
                      backgroundColor: primaryColor,
                      color: "white",
                      opacity: isNextButtonEnabled() ? 1 : 0.5,
                    }}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
          </div>
        </div>
      </section>
  )
}
