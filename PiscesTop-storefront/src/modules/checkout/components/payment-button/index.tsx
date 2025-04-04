"use client"

import { isManual, isStripe, isCrypto, isPaypal } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useRouter } from "next/navigation"
import { initiatePaymentSession } from "@lib/data/cart"
import { PayPalPaymentButton } from "./paypal-payment-button"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: PaymentButtonProps) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isPaypal(paymentSession?.provider_id):
      return (
        <PayPalPaymentButton
          session={paymentSession as any}
          notReady={notReady}
        />
      )
    case isManual(paymentSession?.provider_id):
      return <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
    case isCrypto(paymentSession?.provider_id):
      return <CryptoPaymentButton notReady={notReady} cart={cart} data-testid={dataTestId} />
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onPaymentCompleted = async () => {
    await router.push("/us/checkout/confirmed")
  }

  const handlePayment = () => {
    setSubmitting(true)
    setErrorMessage(null)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={submitting || notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="w-full"
      >
        Complete order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const CryptoPaymentButton = ({ 
  notReady, 
  cart,
  "data-testid": dataTestId 
}: { 
  notReady: boolean 
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onPaymentCompleted = async () => {
    await router.push("/checkout/crypto-processing")
  }

  const handlePayment = () => {
    setSubmitting(true)
    setErrorMessage(null)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={submitting || notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="w-full btn-primary"
        data-testid={dataTestId}
      >
        Complete with Cryptocurrency
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="crypto-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
