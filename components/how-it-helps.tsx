import {Collapsible} from "@/components/collapsible";
import Image from "next/image";

export default function HowItHelps() {
  return (
    <section id="how-it-helps" className="w-full py-12 bg-gradient-to-br from-green-100 to-white">
      <div className="container px-4 md:px-6">=
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#083118] mb-4">
              Businesses grow when customers return
            </h1>
            <p className="text-lg text-center text-[#083118] max-w-4xl mx-auto mb-16">
              <span className="font-semibold">Receivt</span> helps any business to have its own digital system with
              loyalty
              and promotions so you keep customers engaged and reduce operational waste.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Collapsible
                    title="Launch digital services without a tech team."
                    defaultOpen={true}
                    content={
                      <div className="space-y-4 pt-4">
                        <p className="text-[#083118]">No coding. No external developers.</p>
                        <p className="text-[#083118]">
                          You go live in days and stay in full control of your customer experience.
                        </p>
                      </div>
                    }
                />

                <Collapsible
                    title="Boost customer loyalty and retention"
                    content={
                      <div className="space-y-4 pt-4">
                        <p className="text-[#083118]">
                          Create personalized loyalty programs that keep customers coming back.
                        </p>
                        <p className="text-[#083118]">
                          Implement rewards, points systems, and special promotions to increase retention.
                        </p>
                      </div>
                    }
                />

                <Collapsible
                    title="Save on paper costs"
                    content={
                      <div className="space-y-4 pt-4">
                        <p className="text-[#083118]">Eliminate paper receipts and physical loyalty cards.</p>
                        <p className="text-[#083118]">Reduce your environmental impact while cutting operational
                          expenses.</p>
                      </div>
                    }
                />

                <Collapsible
                    title="Gain insights into customer behavior"
                    content={
                      <div className="space-y-4 pt-4">
                        <p className="text-[#083118]">Track purchasing patterns and customer preferences.</p>
                        <p className="text-[#083118]">
                          Use data-driven insights to optimize your offerings and marketing strategies.
                        </p>
                      </div>
                    }
                />
              </div>

              <div className="relative">
                <div className="w-full h-[500px]">
                  <Image
                      src="benefits.svg"
                      alt="Laptop with Receivt dashboard showing customer interactions"
                      fill
                      className="object-contain"
                      priority
                  />
                </div>
              </div>
            </div>
          </div>=
    </section>
  )
}
