"use client"

import { CheckCircleSolid } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const OrderConfirmed = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    // You can add any additional logic here, like sending confirmation emails
    // or updating order status
  }, [orderId])

  return (
    <Container className="flex flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircleSolid className="h-6 w-6 text-green-600" />
        </div>
        <Text className="mt-4 text-2xl-semi">Thank you</Text>
        <Text className="mt-4 text-center text-base-regular text-gray-700">
          Your order was placed successfully
        </Text>
        {orderId && (
          <Text className="mt-2 text-center text-base-regular text-gray-700">
            Order ID: {orderId}
          </Text>
        )}
      </div>
    </Container>
  )
}

export default OrderConfirmed 