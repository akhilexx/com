"use client"

import { sdk } from "@lib/config";
import { useEffect, useState } from "react";
import { PaymentResponse } from "types/phonepe-types";
import { HttpTypes } from "@medusajs/types";

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

// Simple button component since we can't import the actual one
const Button = ({ 
  children, 
  disabled, 
  onClick 
}: { 
  children: React.ReactNode, 
  disabled?: boolean, 
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void 
}) => (
  <button
    className="w-full bg-pisces-primary hover:bg-pisces-accent text-white py-3 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

// Simple spinner component
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const PhonePePaymentButton = ({
  session,
  notReady
}: {
  session: PaymentSession;
  notReady: boolean;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const { cart, setCart } = useCart();

  const updatePaymentSession = useUpdatePaymentSession(cart?.id || "");
  useEffect(() => {
    console.log(JSON.stringify(session));
    if (!session && cart?.payment.provider_id == "phonepe") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [session, cart]);

  const handlePayment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("this is the current session" + session);
    setSubmitting(true);
    if (!cart) {
      setSubmitting(false);
      return;
    }
    console.log("updating the current session");
    await updatePaymentSession.mutateAsync({
      provider_id: session.provider_id,
      data: { readyToPay: true }
    });
    await updatePaymentSession.mutateAsync(
      {
        provider_id: session.provider_id,
        data: { readyToPay: true }
      },
      {
        onSuccess: async ({ cart }, variables, context) => {
          console.log(
            "checking update successful or not  the current session" +
              JSON.stringify(cart) +
              " variables: ",
            JSON.stringify(variables) + " context :",
            JSON.stringify(context)
          );
          setCart(cart);
          const { cart: updatedCart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
            `/store/carts/${cart.id}`,
            {
              method: "GET",
            }
          );
          console.log(
            "updating the current session cart  : " +
              JSON.stringify(updatedCart)
          );
          
          // Safely access payment session data - in actual storefront code, this would be accessed
          // through cart.payment_collection.payment_sessions
          const paymentData = updatedCart as any;
          const paymentSession = paymentData.payment_session || paymentData.payment_collection?.payment_sessions?.[0];
          
          console.log(
            "cart payment session updated:",
            JSON.stringify(paymentSession)
          );

          console.log(
            "refreshing payment session data" +
              JSON.stringify(paymentSession)
          );
          
          const paymentSessionData = paymentSession?.data as unknown as PaymentResponse;
          const redirectUrl =
            paymentSessionData?.data?.instrumentResponse
              ?.redirectInfo?.url;
          console.log(`redirect url: ${redirectUrl}`);

          if (
            redirectUrl?.includes("https") &&
            redirectUrl.includes("token=")
          ) {
            window.location.replace(redirectUrl);
          } else {
            throw new Error(
              "mutation didn't signal, please click checkout again"
            );
          }
        },
        onError: (error, variables, context) => {
          console.log("message : " + error.message);
          console.log("variables: " + JSON.stringify(variables));
          console.log("context: " + JSON.stringify(context));
          setErrorMessage(
            "error processing request: " + error.message
          );
          setSubmitting(false);
        }
      }
    );
  };

  return (
    <>
      <Button
        disabled={submitting || disabled || notReady}
        onClick={handlePayment}
      >
        {submitting ? <Spinner /> : "Checkout with PhonePe"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  );
}; 