import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section id="home" className="w-full py-12 bg-gradient-to-bl from-white to-green-100">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                  <div className="relative inline-block">
                      <p className="text-3xl font-semibold tracking-tighter sm:text-5xl xl:text-8xl/none text-[#083118]">
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
            <div className="relative h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
                <Image
                    src="/group138.svg"
                    alt="Branded loyalty app and happy customers"
                    fill
                    className="object-contain"
                    priority
                />
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
