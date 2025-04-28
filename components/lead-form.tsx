"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function LeadForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
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
    }, 1500)
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
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="message"
                  placeholder="Message"
                  className="min-h-[120px] bg-[#fffff3]/10 border-[#fffff3]/20 text-[#fffff3] placeholder:text-[#fffff3]/50"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#fffff3] text-[#083118] hover:bg-[#fffff3]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Request a Presentation"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
