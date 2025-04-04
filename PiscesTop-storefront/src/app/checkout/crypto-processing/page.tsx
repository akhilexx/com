import { Heading, Text, Container, Button } from "@medusajs/ui"
import Link from "next/link"

export default function CryptoProcessingPage() {
  return (
    <div className="bg-white relative">
      <div className="absolute inset-0 bg-sparkle-pattern opacity-[0.02]"></div>
      <div className="h-full w-full flex flex-col items-center justify-center py-32">
        <Container className="max-w-4xl bg-white p-8 rounded-lg shadow-lg border border-pisces-secondary">
          <div className="flex flex-col items-center text-center mb-8">
            <Heading className="text-pisces-primary text-4xl mb-2">
              Processing Your Cryptocurrency Payment
            </Heading>
            <div className="w-16 h-1 bg-pisces-secondary rounded mb-6"></div>
            <Text className="text-ui-fg-base text-xl">
              Thank you for your purchase with cryptocurrency!
            </Text>
          </div>
          
          <div className="bg-pisces-light/40 p-6 rounded-md mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Text className="font-semibold text-pisces-accent">Your order has been received</Text>
                <Text className="text-ui-fg-subtle">
                  Your payment is being processed. Once confirmed on the blockchain, your order will be shipped.
                </Text>
              </div>
              
              <div className="flex flex-col gap-1">
                <Text className="font-semibold text-pisces-accent">Confirmation Time</Text>
                <Text className="text-ui-fg-subtle">
                  Depending on the network congestion, it may take between 10-60 minutes for your transaction to be confirmed.
                </Text>
              </div>
              
              <div className="flex flex-col gap-1">
                <Text className="font-semibold text-pisces-accent">Order Updates</Text>
                <Text className="text-ui-fg-subtle">
                  You will receive email updates as your payment is confirmed and when your order is shipped.
                </Text>
              </div>
            </div>
          </div>
          
          <div className="animate-pulse flex justify-center items-center mb-8">
            <div className="h-2 w-2 bg-pisces-secondary rounded-full mx-1"></div>
            <div className="h-2 w-2 bg-pisces-secondary rounded-full mx-1 animation-delay-300"></div>
            <div className="h-2 w-2 bg-pisces-secondary rounded-full mx-1 animation-delay-600"></div>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <Text className="text-ui-fg-subtle text-center max-w-lg">
              We appreciate your business and your support for cryptocurrency adoption!
            </Text>
            <Link href="/" passHref>
              <Button variant="secondary" className="min-w-[200px]">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  )
} 