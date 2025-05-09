import { useState } from "react";
import { Collapsible } from "@/components/collapsible";
import Image from "next/image";

export default function HowItHelps() {
    const [openCollapsible, setOpenCollapsible] = useState<string | null>("1"); // Default open to the first collapsible

    const handleToggle = (id: string) => {
        setOpenCollapsible((prev) => (prev === id ? null : id));
    };

    return (
        <section 
            id="how-it-helps" 
            className="w-full pt-20 bg-no-repeat min-h-[85vh] flex flex-col justify-center relative overflow-hidden"
            style={{
                backgroundImage: "url('/images/background/how-it-helps-bg.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center"
            }}
        >
            <div className="container px-4 md:px-6 relative z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#083118] mb-4">
                    Businesses grow when customers return
                </h1>
                <p className="text-lg text-center text-[#083118] max-w-4xl mx-auto mb-16">
                    <span className="font-semibold">Receivt</span> helps any business to have its own digital system with loyalty
                    and promotions so you keep customers engaged and reduce operational waste.
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <Collapsible
                            id="1"
                            title="Launch digital services without a tech team."
                            isOpen={openCollapsible === "1"}
                            onToggle={handleToggle}
                            content={
                                <div className="space-y-4 pt-4">
                                    <p className="text-[#083118]">No coding. No external developers.</p>
                                    <p className="text-[#083118]">
                                        <strong>You go live in days</strong> and stay in full control of your customer
                                            experience.
                                    </p>
                                </div>
                            }
                        />

                        <Collapsible
                            id="2"
                            title="Boost customer loyalty and retention"
                            isOpen={openCollapsible === "2"}
                            onToggle={handleToggle}
                            content={
                                <div className="space-y-4 pt-4">
                                    <p className="text-[#083118]">
                                        Create personalized loyalty programs that <strong>keep customers coming back</strong>.
                                    </p>
                                    <p className="text-[#083118]">
                                        Implement rewards, points systems, and special promotions to increase retention.
                                    </p>
                                </div>
                            }
                        />

                        <Collapsible
                            id="3"
                            title="Save on paper costs"
                            isOpen={openCollapsible === "3"}
                            onToggle={handleToggle}
                            content={
                                <div className="space-y-4 pt-4">
                                    <p className="text-[#083118]">Eliminate paper receipts.</p>
                                    <p className="text-[#083118]">Reduce your environmental impact while <strong>cutting
                                        operational expenses</strong>.</p>
                                </div>
                            }
                        />

                        <Collapsible
                            id="4"
                            title="Gain insights into customer behavior"
                            isOpen={openCollapsible === "4"}
                            onToggle={handleToggle}
                            content={
                                <div className="space-y-4 pt-4">
                                    <p className="text-[#083118]">Track purchasing patterns and customer preferences.</p>
                                    <p className="text-[#083118]">
                                        Use data-driven insights to <strong>optimize your offerings</strong> and
                                        marketing strategies.
                                    </p>
                                </div>
                            }
                        />
                    </div>

                    <div className="relative">
                        <div className="w-full h-[500px]">
                            <Image
                                src="/images/background/how-it-helps.png"
                                alt="Laptop with Receivt dashboard showing customer interactions"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}