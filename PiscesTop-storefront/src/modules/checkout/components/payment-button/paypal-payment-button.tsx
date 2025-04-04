"use client"

import { sdk } from "@lib/config";
import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Define types for missing modules
type PaymentSession = {
  provider_id: string;
  data: Record<string, unknown>;
};

type Cart = {
  id: string;
  payment: {
    provider_id: string;
  };
};

type CartContext = {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
};

type PaymentSessionContext = {
  mutateAsync: (
    data: {
      provider_id: string;
      data: Record<string, unknown>;
    },
    options?: {
      onSuccess?: (data: { cart: Cart }, variables: any, context: any) => Promise<void>;
      onError?: (error: { message: string }, variables: any, context: any) => void;
    }
  ) => Promise<any>;
};

// Mock hooks that would be provided by medusa-react
const useCart = (): CartContext => {
  const [cartState, setCartState] = useState<Cart | null>(null);
  return {
    cart: cartState,
    setCart: setCartState,
  };
};

const useUpdatePaymentSession = (cartId: string): PaymentSessionContext => {
  return {
    mutateAsync: async (data, options) => {
      // This would normally call the Medusa API
      const response = await sdk.client.fetch<any>(`/store/carts/${cartId}/payment-sessions/${data.provider_id}`, {
        method: "POST",
        body: data.data,
      });

      if (options?.onSuccess) {
        await options.onSuccess({ cart: response.cart }, data, {});
      }
      return response;
    },
  };
};

export const PayPalPaymentButton = ({
  session,
  notReady
}: {
  session: PaymentSession;
  notReady: boolean;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { cart, setCart } = useCart();

  const updatePaymentSession = useUpdatePaymentSession(cart?.id || "");

  useEffect(() => {
    if (!session && cart?.payment.provider_id === "paypal") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [session, cart]);

  const handlePayment = async (data: any, actions: any) => {
    return actions.order.authorize().then(async (authorization: any) => {
      if (authorization.status !== "COMPLETED") {
        setErrorMessage(`An error occurred, status: ${authorization.status}`);
        setSubmitting(false);
        return;
      }

      try {
        // Set PayPal as the payment session
        await updatePaymentSession.mutateAsync({
          provider_id: session.provider_id,
          data: { readyToPay: true }
        });

        // Update the payment session with authorization data
        await updatePaymentSession.mutateAsync(
          {
            provider_id: session.provider_id,
            data: { data: authorization }
          },
          {
            onSuccess: async ({ cart }, variables, context) => {
              setCart(cart);
              
              // Complete the cart to create the order
              const { data } = await sdk.client.fetch<any>(
                `/store/carts/${cart.id}/complete`,
                { method: "POST" }
              );
              
              if (!data || data.object !== "order") {
                setSubmitting(false);
                return;
              }
              
              // Redirect to order confirmation page
              window.location.href = `/order/confirmed/${data.id}`;
            },
            onError: (error) => {
              setErrorMessage(`Error processing payment: ${error.message}`);
              setSubmitting(false);
            }
          }
        );
      } catch (error: any) {
        setErrorMessage(`Error: ${error.message}`);
        setSubmitting(false);
      }
    });
  };

  return (
    <>
      <PayPalScriptProvider options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "authorize"
      }}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          disabled={submitting || disabled || notReady}
          createOrder={async () => session.data.id as string}
          onApprove={handlePayment}
        />
      </PayPalScriptProvider>
      
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  );
}; 