import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import BackgroundEffects from "@modules/common/components/background-effects"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Pisces Top - Premium Hoodies and T-Shirts",
  description: "Shop the latest collection of premium hoodies and t-shirts at Pisces Top, with worldwide shipping."
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="bg-gradient-to-b from-white to-amber-50/20 text-ui-fg-base overflow-x-hidden min-h-screen">
        <div className="fixed w-full h-full pointer-events-none z-[-1] bg-gold-sparkle-pattern opacity-[0.01]"></div>
        <BackgroundEffects />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
