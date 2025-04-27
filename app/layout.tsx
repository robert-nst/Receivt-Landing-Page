import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Receivt",
  description: "Fast, custom and without a tech team.",
  generator: "v0.dev",
  icons: {
    icon: "/Favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
