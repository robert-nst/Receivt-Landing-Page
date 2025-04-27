"use client";

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import HowItHelps from "@/components/how-it-helps"
import Features from "@/components/features"
import Configurator from "@/components/configurator"
import LeadForm from "@/components/lead-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffff3]">
      <Navbar />
      <Hero />
      <HowItHelps />
      <Features />
      <Configurator />
      <LeadForm />
    </main>
  )
}
