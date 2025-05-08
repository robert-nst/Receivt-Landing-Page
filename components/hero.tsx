import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section
      id="home"
      className="w-full pt-32 pb-20 bg-no-repeat bg-cover bg-center min-h-[85vh] flex flex-col justify-center relative"
      style={{
        backgroundImage: "url('/images/background/hero-bg.png')",
        backgroundSize: "100% 100%"
      }}
    >
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="relative inline-block">
                <p className="text-3xl font-semibold tracking-tighter sm:text-5xl xl:text-7xl/none text-[#083118]">
                  Launch digital services under your  <span className="relative">
                    own brand
                    <Image
                      src="/green-line.svg"
                      alt="Branded loyalty app and happy customers"
                      fill
                      className="absolute left-0 bottom-0 translate-y-[50%] object-contain"
                      priority
                    />
                  </span>
                  .
                </p>
              </div>
              {/*<p className="max-w-[600px] text-[#083118] md:text-xl">Fast, custom and without a tech team.</p>*/}
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden flex items-center justify-center">
            <div className="relative w-full h-full max-w-[420px] lg:max-w-[600px] mx-auto">
              <Image
                src="/images/background/hero.png"
                alt="Branded loyalty app and happy customers"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 400px"
                priority
                quality={100}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-10">
          <Button className="bg-[#083118] hover:bg-[#083118]/90 text-[#fffff3] rounded-full p-8 text-3xl"
            size="lg" asChild>
            <Link href="#how-it-helps" className="font-semibold">Discover how</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}