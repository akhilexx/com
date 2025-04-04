import { Button, Heading, Text } from "@medusajs/ui"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="h-[80vh] w-full border-b border-ui-border-base relative bg-gradient-to-r from-pisces-light to-white overflow-hidden">
      <div className="absolute inset-0 bg-sparkle-pattern opacity-[0.05]"></div>
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span className="animate-fade-in-top">
          <Heading
            level="h1"
            className="text-4xl small:text-5xl leading-10 text-pisces-primary font-bold mb-4"
          >
            PISCES TOP
          </Heading>
          <Heading
            level="h2"
            className="text-2xl small:text-3xl leading-9 text-pisces-accent font-medium"
          >
            Premium Clothing & Accessories
          </Heading>
          <Text className="max-w-lg mx-auto mt-6 text-ui-fg-subtle">
            Explore our exclusive collection of high-quality apparel. 
            Now accepting Bitcoin, Ethereum, and other cryptocurrencies.
          </Text>
        </span>
        <div className="flex flex-col small:flex-row gap-3 mt-6">
          <Link href="/store">
            <Button variant="primary" className="btn-primary min-w-[180px]">
              Shop Now
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="secondary" className="btn-secondary min-w-[180px]">
              View Collections
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-[40%] bg-gradient-to-t from-white/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/50 to-transparent"></div>
    </div>
  )
}

export default Hero
