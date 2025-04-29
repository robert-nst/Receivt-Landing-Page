import { BadgeCheck, CreditCard, Gift, Receipt, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import FeatureContent from "@/components/feature-content";
import { useState } from "react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState("white-label");

  const features = [
    {
      id: "white-label",
      title: "White-Label Branding",
      description: "Fully branded app with your own identity.",
      points: [
        "Custom domain integration",
        "<strong>Logo and color scheme</strong> customization",
        "Personalized email templates",
        "<strong>Branded mobile</strong> experience",
      ],
      icon: <BadgeCheck className="h-8 w-8 text-[#083118]" />,
    },
    {
      id: "loyalty",
      title: "Loyalty Program",
      description: "Choose the loyalty style that suits your business.",
      points: [
        "Points-based <strong>rewards system</strong>",
        "Tiered membership levels",
        "Custom rewards and incentives",
        "<strong>Analytics</strong> and performance tracking",
      ],
      icon: <CreditCard className="h-8 w-8 text-[#083118]" />,
    },
    {
      id: "promo",
      title: "One-Click Away Campaigns",
      description: "Manage promotions that boost your sales.",
      points: [
        "Time-limited offers",
        "Discount code generation",
        "<strong>Multi-channel campaign</strong> distribution",
        "Performance metrics and <strong>ROI tracking</strong>",
      ],
      icon: <Gift className="h-8 w-8 text-[#083118]" />,
    },
    {
      id: "digital-receipts",
      title: "Digital Receipts",
      description: "Offer digital receipts for customers.",
      points: [
        "Easy access to <strong>receipts</strong>",
        "Environmentally friendly",
        "<strong>Integration</strong> with loyalty programs",
        "Improved customer experience",
      ],
      icon: <Receipt className="h-8 w-8 text-[#083118]" />,
    },
    {
      id: "support",
      title: "Easy Integration & Support",
      description: "Connect with your systems & get 24/7 support.",
      points: [
        "24/7 technical support",
        "API documentation and resources",
        "Integration with major <strong>CRM systems</strong>",
        "Regular updates and <strong>maintenance</strong>",
      ],
      icon: <Headphones className="h-8 w-8 text-[#083118]" />,
    },
  ];

  return (
      <section
          id="features"
          className="w-full py-20 bg-no-repeat min-h-[85vh] flex flex-col justify-center relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/background/features-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
      >
        <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#083118] mb-16">
            Discover our features
          </h1>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              {features.map((feature) => (
                  <div key={feature.id}>
                    <button
                        onClick={() => setActiveFeature(feature.id)}
                        className={cn(
                            "w-full text-left px-6 py-5 rounded-lg transition-all duration-300",
                            activeFeature === feature.id
                                ? "bg-green-100 text-green-900 font-semibold shadow-sm text-xl"
                                : "bg-white/50 text-gray-500 hover:bg-white/80 text-lg"
                        )}
                    >
                      {feature.title}
                    </button>

                    {/* Render FeatureContent below the active feature for mobile */}
                    {activeFeature === feature.id && (
                        <div className="block md:hidden mt-4 bg-white rounded-lg shadow-lg p-6">
                          <FeatureContent feature={feature} />
                        </div>
                    )}
                  </div>
              ))}
            </div>

            {/* Render FeatureContent in a fixed position for desktop */}
            <div className="hidden md:block bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
              <FeatureContent feature={features.find((f) => f.id === activeFeature)!} />
            </div>
          </div>
        </div>
      </section>
  );
}