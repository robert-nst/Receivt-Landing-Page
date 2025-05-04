"use client"
import { Input } from "@/components/ui/input"

interface ColorStepProps {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  secondaryColor: string
  setSecondaryColor: (color: string) => void
}

export default function ColorStep({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
}: ColorStepProps) {
  const predefinedColors = [
    { name: "Green", primary: "#00796b", secondary: "#4db6ac" },
    { name: "Blue", primary: "#1976d2", secondary: "#64b5f6" },
    { name: "Purple", primary: "#7b1fa2", secondary: "#ba68c8" },
    { name: "Red", primary: "#d32f2f", secondary: "#ef5350" },
    { name: "Orange", primary: "#f57c00", secondary: "#ffb74d" },
  ]

  return (
    <div className="max-w-2xl mx-auto"
      style={{
        backgroundImage: "url('/images/background/features-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Colors</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Primary Color</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: primaryColor }}></div>
              <div className="flex-1">
                <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              </div>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 p-1 rounded cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">Used for headers, buttons, and important elements</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Secondary Color</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: secondaryColor }}></div>
              <div className="flex-1">
                <Input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
              </div>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 p-1 rounded cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">Used for accents, highlights, and secondary elements</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Color Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {predefinedColors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrimaryColor(color.primary)
                  setSecondaryColor(color.secondary)
                }}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                  primaryColor === color.primary && secondaryColor === color.secondary ? "ring-2 ring-offset-2" : ""
                }`}
                style={{
                  ringColor: color.primary,
                }}
              >
                <div className="flex justify-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.secondary }}></div>
                </div>
                <p className="text-sm text-center">{color.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 border rounded-lg overflow-hidden">
          <h3 className="text-lg font-medium p-4 border-b">Preview</h3>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: primaryColor }}>
                <h4 className="text-xl font-bold text-white mb-2">Primary Color</h4>
                <p className="text-white/80">This is how your primary color looks as a background.</p>
                <button className="mt-4 px-4 py-2 bg-white rounded-md font-medium" style={{ color: primaryColor }}>
                  Button Example
                </button>
              </div>

              <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: secondaryColor }}>
                <h4 className="text-xl font-bold text-white mb-2">Secondary Color</h4>
                <p className="text-white/80">This is how your secondary color looks as a background.</p>
                <button className="mt-4 px-4 py-2 bg-white rounded-md font-medium" style={{ color: secondaryColor }}>
                  Button Example
                </button>
              </div>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                Text with Primary Color
              </h4>
              <p className="mb-4">This is how regular text looks with your primary color as headings.</p>
              <div className="flex gap-4">
                <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                  Primary Button
                </button>
                <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: secondaryColor }}>
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
