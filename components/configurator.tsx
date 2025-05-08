"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoStep from "@/components/steps/logo-step"
import ColorStep from "@/components/steps/color-step"
import EmailStep from "@/components/steps/email-step"
import FinalStep from "@/components/steps/final-step"
import { trackEvent, GA_EVENTS } from "@/lib/analytics"

export default function Configurator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [logo, setLogo] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#00796b")
  const [secondaryColor, setSecondaryColor] = useState("#4db6ac")
  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("home")
  const [extractedPrimaryColor, setExtractedPrimaryColor] = useState<string | null>(null)
  const [extractedSecondaryColor, setExtractedSecondaryColor] = useState<string | null>(null)

  const steps = [
    { id: 1, name: "Logo" },
    { id: 2, name: "Colors" },
    { id: 3, name: "Email" },
    { id: 4, name: "Preview" },
  ]

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackEvent(GA_EVENTS.CONFIGURATOR_STEP_CHANGE, {
        from_step: currentStep,
        to_step: nextStep,
        step_name: steps[nextStep - 1].name
      });
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      trackEvent(GA_EVENTS.CONFIGURATOR_STEP_CHANGE, {
        from_step: currentStep,
        to_step: prevStep,
        step_name: steps[prevStep - 1].name
      });
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

  const handleColorChange = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    trackEvent(GA_EVENTS.CONFIGURATOR_COLOR_CHANGE, {
      primary_color: primary,
      secondary_color: secondary,
      step: currentStep
    });
  }

  return (
    <section
      id="configurator-bg"
      className="w-full pt-20 pb-10 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background/configurator-bg.png')",
        backgroundSize: "100% 100%"
      }}
    >
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold text-center mb-12">
          See in 30 seconds how your app could look like!</h1>
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Progress bar */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex-1 text-center ${step.id === currentStep
                      ? "text-[#083118] font-medium"
                      : step.id < currentStep
                        ? "text-green-600"
                        : "text-gray-400"
                      }`}
                  >
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#083118] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-6">
              {currentStep === 1 && (
                <LogoStep
                  logo={logo}
                  setLogo={(newLogo) => {
                    setLogo(newLogo);
                    if (newLogo) {
                      trackEvent(GA_EVENTS.CONFIGURATOR_LOGO_UPLOAD, {
                        logo_type: newLogo.startsWith('data:') ? 'uploaded' : 'url'
                      });
                    }
                  }}
                  websiteUrl={websiteUrl}
                  setWebsiteUrl={(url) => {
                    setWebsiteUrl(url);
                    if (url) {
                      trackEvent(GA_EVENTS.CONFIGURATOR_WEBSITE_ENTER, {
                        website_url: url
                      });
                    }
                  }}
                  primaryColor={primaryColor}
                  onColorsExtracted={(primary, secondary) => {
                    console.log("Extracted colors:", primary, secondary);
                    handleColorChange(primary, secondary);
                    setExtractedPrimaryColor(primary);
                    setExtractedSecondaryColor(secondary);
                  }}
                />
              )}
              {currentStep === 2 && (
                <ColorStep
                  primaryColor={primaryColor}
                  setPrimaryColor={(color) => handleColorChange(color, secondaryColor)}
                  secondaryColor={secondaryColor}
                  setSecondaryColor={(color) => handleColorChange(primaryColor, color)}
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
                  setPrimaryColor={(color) => handleColorChange(color, secondaryColor)}
                  setSecondaryColor={(color) => handleColorChange(primaryColor, color)}
                  activeNavItem={activeNavItem}
                  setActiveNavItem={setActiveNavItem}
                />
              )}
            </div>

            <div className="border-t p-6 flex justify-between">
              <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length && (
                <Button
                  onClick={goToNextStep}
                  disabled={!isNextButtonEnabled()}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
