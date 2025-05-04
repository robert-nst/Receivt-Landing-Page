"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LogoStepProps {
  logo: string | null
  setLogo: (logo: string | null) => void
  websiteUrl: string
  setWebsiteUrl: (url: string) => void
  primaryColor: string
}

export default function LogoStep({ logo, setLogo, websiteUrl, setWebsiteUrl, primaryColor }: LogoStepProps) {
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

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
    if (file.type.startsWith("image/")) {
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
    const websiteRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    return websiteRegex.test(input)
  }

  const handleLogoExtraction = async (url: string) => {
    try {
      setIsLoading(true)
      // In a real app, this would call an API to extract the logo
      // For this demo, we'll simulate it with a timeout
      setTimeout(() => {
        // Simulate a successful logo extraction with a placeholder
        setLogo("/placeholder.svg?height=100&width=200")
        setLogoError(null)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      setLogoError("Error extracting logo. Please try again.")
      setIsLoading(false)
    }
  }

  const handleWebsiteSubmit = async () => {
    if (!websiteUrl) {
      setLogoError("Please enter a website URL")
      return
    }

    if (validateInput(websiteUrl)) {
      setLogoError(null)
      const formattedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
      await handleLogoExtraction(formattedUrl)
    } else {
      setLogoError("Please enter a valid website (e.g., example.com).")
    }
  }

  return (
    <div className="max-w-2xl mx-auto"
      style={{
        backgroundImage: "url('/images/background/features-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Upload or Download Logo</h2>

      <Tabs defaultValue="download" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger
              value="download"
              className="data-[state=active]:bg-[#0F4D2B] data-[state=active]:text-white"
          >
            Download from URL
          </TabsTrigger>
          <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-[#0F4D2B] data-[state=active]:text-white"
          >
            Upload Logo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Website URL</label>
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
                    color: "white",
                  }}
                >
                  {isLoading ? "Loading..." : "Extract Logo"}
                </Button>
              </div>
              {logoError && <p className="text-sm text-red-600">{logoError}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            style={{ borderColor: isDragging ? primaryColor : "" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <label
                htmlFor="logo-upload"
                className="text-lg font-medium cursor-pointer hover:underline"
                style={{ color: primaryColor }}
              >
                Click to upload
              </label>
              <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
              <p className="text-sm text-gray-500">Or drag and drop</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {logo && (
        <div className="mt-8 border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="flex justify-center">
            <img src={logo || "/placeholder.svg"} alt="Logo preview" className="max-h-40 object-contain" />
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setLogo(null)
                setWebsiteUrl("")
                setLogoError(null)
              }}
            >
              Remove Logo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
