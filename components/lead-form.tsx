"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { addLeadToFirebase } from "@/lib/firebase"
import { Checkbox } from "@/components/ui/checkbox"
import { PrivacyPolicyDialog } from "@/components/privacy-policy-dialog"
import { trackEvent, GA_EVENTS } from "@/lib/analytics"

export default function LeadForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFocus = (fieldName: string) => {
    trackEvent(GA_EVENTS.FORM_FIELD_FOCUS, { field_name: fieldName });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!gdprConsent) {
      trackEvent(GA_EVENTS.FORM_ERROR, { error_type: 'gdpr_consent_required' });
      toast({
        title: "GDPR Consent Required",
        description: "Please accept the privacy policy to continue.",
        variant: "destructive",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addLeadToFirebase(formData)
      trackEvent(GA_EVENTS.FORM_SUBMIT, {
        form_type: 'lead_form',
        company_name: formData.companyName ? 'provided' : 'not_provided',
        phone_provided: !!formData.phone
      });
      toast({
        title: "Form submitted successfully!",
        description: "We'll get back to you shortly.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
      setFormData({
        companyName: "",
        email: "",
        phone: "",
        message: "",
      })
      setGdprConsent(false)
    } catch (error) {
      trackEvent(GA_EVENTS.FORM_ERROR, {
        form_type: 'lead_form',
        error_type: 'submission_failed'
      });
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="w-full pt-20 pb-10 bg-[#083118] text-[#fffff3]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Let's talk about how we can help you
            </h2>
            <p className="text-[#fffff3]/80 md:text-xl">
              If you want to learn more about how we can help your business grow with digital services, leave us a
              message and we'll get back to you.
            </p>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    name="companyName"
                    placeholder="Company Name"
                    className="bg-[#fffff3]/10 border-[#fffff3]/20 text-[#fffff3] placeholder:text-[#fffff3]/50"
                    value={formData.companyName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('company_name')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="bg-[#fffff3]/10 border-[#fffff3]/20 text-[#fffff3] placeholder:text-[#fffff3]/50"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  name="phone"
                  placeholder="Phone (optional)"
                  className="bg-[#fffff3]/10 border-[#fffff3]/20 text-[#fffff3] placeholder:text-[#fffff3]/50"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phone')}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="message"
                  placeholder="Message"
                  className="min-h-[120px] bg-[#fffff3]/10 border-[#fffff3]/20 text-[#fffff3] placeholder:text-[#fffff3]/50"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gdpr"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => {
                    setGdprConsent(checked as boolean);
                    if (checked) {
                      trackEvent(GA_EVENTS.FORM_FIELD_FOCUS, { field_name: 'gdpr_consent' });
                    }
                  }}
                  className="border-[#fffff3]/20 data-[state=checked]:bg-[#fffff3] data-[state=checked]:text-[#083118]"
                />
                <div className="text-sm text-[#fffff3]/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the{" "}
                  <PrivacyPolicyDialog>
                    <span
                      className="underline hover:text-[#fffff3] cursor-pointer"
                      onClick={() => trackEvent(GA_EVENTS.PRIVACY_POLICY_VIEW, { source: 'lead_form' })}
                    >
                      privacy policy
                    </span>
                  </PrivacyPolicyDialog>{" "}
                  and consent to the processing of my personal data.
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#fffff3] text-[#083118] hover:bg-[#fffff3]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Let's talk"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
