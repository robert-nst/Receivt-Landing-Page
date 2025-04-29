import { CheckCircle } from "lucide-react"
import { BadgeCheck, CreditCard, Gift, Receipt, Headphones } from "lucide-react"
interface Feature {
  id: string
  title: string
  description: string
  points: string[]
  icon: BadgeCheck | CreditCard | Gift | Receipt | Headphones
}

interface FeatureContentProps {
  feature: Feature
}

export default function FeatureContent({ feature }: FeatureContentProps) {
  return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-green-800">{feature.title}</h2>
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                {feature.icon}
              </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{feature.description}</p>

          <div className="space-y-3 pt-4">
              {feature.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"/>
                      <span
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{__html: point}}
                      />
                  </div>
              ))}
          </div>
      </div>
  )
}
