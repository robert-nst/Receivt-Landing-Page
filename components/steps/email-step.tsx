"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, Link, Loader2 } from "lucide-react"
import { saveEmail } from "@/app/actions"
import { toast } from "@/hooks/use-toast"
import { PrivacyPolicyDialog } from "../privacy-policy-dialog"

interface EmailStepProps {
  email: string
  setEmail: (email: string) => void
  primaryColor: string
  secondaryColor: string
  setIsEmailValid: (isValid: boolean) => void
}

export default function EmailStep({ email, setEmail, primaryColor, secondaryColor, setIsEmailValid }: EmailStepProps) {
  const [localEmail, setLocalEmail] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  useEffect(() => {
    // Update parent component with email validity
    setIsEmailValid(isValid && submitted)
  }, [isValid, submitted, setIsEmailValid])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setLocalEmail(newEmail)

    if (newEmail.trim() === "") {
      setIsValid(false)
      setError(null)
    } else if (!validateEmail(newEmail)) {
      setIsValid(false)
      setError("Please enter a valid email address")
    } else {
      setIsValid(true)
      setError(null)
    }

    setSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (localEmail.trim() === "") {
      setError("Email is required")
      return
    }

    if (!validateEmail(localEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      await saveEmail(localEmail)
      setLocalEmail("")
      setError(null)
      setIsValid(true)
      setSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your email. Please try again.",
        variant: "destructive",
      })
      console.error("Error saving email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto"
      style={{
        backgroundImage: "url('/images/background/features-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Email</h2>

      <div className="text-center mb-8">
        <Mail className="h-16 w-16 mx-auto mb-4" />
        <p className="text-gray-600">
          Enter your email address to receive updates about your app and important notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={localEmail}
            onChange={handleEmailChange}
            className={`${isValid ? "border-green-500" : error ? "border-red-500" : ""}`}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || submitted || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : submitted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Email Confirmed
            </>
          ) : (
            "Confirm Email"
          )}
        </Button>
        <label
          htmlFor="gdpr_email"
          className="text-xs text-[#000000]/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          By clicking this button, I agree the {" "}
          <PrivacyPolicyDialog><span className="underline cursor-pointer">privacy policy</span></PrivacyPolicyDialog>{" "}
          and consent to the processing of my personal data.
        </label>
      </form>

      {submitted && (
        <div className="mt-8 p-4 rounded-lg text-center" style={{ backgroundColor: `${secondaryColor}20` }}>
          <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: secondaryColor }} />
          <h3 className="text-lg font-medium" style={{ color: secondaryColor }}>
            Email Confirmed!
          </h3>
          <p className="text-gray-600">You can now proceed to the final step.</p>
        </div>
      )}
    </div>
  )
}