"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FastAverageColor } from "fast-average-color"

interface LogoStepProps {
  logo: string | null
  setLogo: (logo: string | null) => void
  websiteUrl: string
  setWebsiteUrl: (url: string) => void
  primaryColor: string
  onColorsExtracted?: (primary: string, secondary: string) => void
}

export default function LogoStep({ logo, setLogo, websiteUrl, setWebsiteUrl, primaryColor, onColorsExtracted }: LogoStepProps) {
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const extractColorsFromImage = (imgSrc: string) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    // Use proxy for remote images
    if (imgSrc.startsWith('http')) {
      img.src = `/api/proxy-image?url=${encodeURIComponent(imgSrc)}`;
    } else {
      img.src = imgSrc;
    }
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("No canvas context");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;

        // Count colors
        const colorCount: Record<string, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) continue; // skip transparent
          const hex = rgbToHex(r, g, b);
          colorCount[hex] = (colorCount[hex] || 0) + 1;
        }
        // Sort by frequency
        const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
        const primary = sorted[0]?.[0] || "#00796b";
        const secondary = sorted[1]?.[0] || "#4db6ac";
        if (onColorsExtracted) {
          console.log("Extracted colors:", primary, secondary);
          onColorsExtracted(primary, secondary);
        }
      } catch (e) {
        if (onColorsExtracted) onColorsExtracted("#00796b", "#4db6ac");
      }
    };
    img.onerror = () => {
      setLogoError("Failed to load image for color extraction.");
      if (onColorsExtracted) onColorsExtracted("#00796b", "#4db6ac");
    };
  };

  // Helper function
  function rgbToHex(r: number, g: number, b: number) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  }

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
        if (e.target?.result) {
          extractColorsFromImage(e.target.result as string)
        }
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
      const response = await fetch('/api/extract-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract logo')
      }

      if (data.logoUrl) {
        let logoUrl = data.logoUrl;
        // If the logoUrl is relative, make it absolute using the original website URL
        if (logoUrl.startsWith('/')) {
          const website = new URL(url);
          logoUrl = website.origin + logoUrl;
        }
        setLogo(logoUrl);
        setLogoError(null);
        extractColorsFromImage(logoUrl);
      } else {
        throw new Error('No logo found')
      }
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : 'Error extracting logo. Please try again.')
    } finally {
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
