import { sdk } from "@lib/config";
import { createPostCheckSumHeader } from "@lib/util/phonepe-create-post-checksum-header";
import { sleep } from "@lib/util/sleep";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { PaymentStatusCodeValues } from "types/phonepe-types";
import { HttpTypes } from "@medusajs/types";

export async function POST(
  request: NextRequest,
  _response: NextResponse
): Promise<NextResponse<unknown>> {
  const urlSplit = request.url.split("//");
  const base = urlSplit[1].split("/")[0];

  const data = await request.formData();

  const receivedChecksum = data.get("checksum");
  const merchantTransactionId = data.get("transactionId");
  const code = data.get("code");
  const merchantId = data.get("merchantId");

  let verificationData = "";

  let cartId = merchantTransactionId?.valueOf() as string;
  const cartIdParts = cartId.split("_");
  cartId = `${cartIdParts[0]}_${cartIdParts[1]}`;
  console.log(`computed cart id: ${cartId} `);
  let redirectPath: string | undefined;
  const redirectErrorPath = `/cart`;

  if (
    code?.valueOf() == PaymentStatusCodeValues.PAYMENT_SUCCESS ||
    code?.valueOf() == PaymentStatusCodeValues.PAYMENT_INITIATED
  ) {
    if (!merchantTransactionId?.valueOf() || !merchantId?.valueOf()) {
      notFound();
    } else if (code?.valueOf() != PaymentStatusCodeValues.PAYMENT_SUCCESS) {
      console.log("invalid code", code?.valueOf());
    } else {
      data.forEach((value, key) => {
        if (key != "checksum") verificationData += value;
      });

      const { checksum } = createPostCheckSumHeader(
        verificationData,
        process.env.PHONEPE_SALT,
        ""
      );
      const checksumReceived = receivedChecksum?.valueOf();
      console.warn(
        `checksum computed = ${checksum} & checksum received = ${checksumReceived}`
      );
      if (checksum == checksumReceived || !process.env.TEST_DISABLED) {
        if (checksum != receivedChecksum?.valueOf()) {
          console.warn("running in test mode.. This is dangerous!! ");
        }

        try {
          try {
            let orderId;
            let count = 0;
            while (!orderId) {
              await sleep(1000);
              count++;
              try {
                const { order } = await sdk.client.fetch<HttpTypes.StoreOrderResponse>(
                  `/store/orders/cart/${cartId}`,
                  {
                    method: "GET",
                  }
                );

                orderId = order.id;
              } catch (e) {
                console.log("order not processed in s2s");
                if (count > 10) {
                  throw new Error(
                    "Order not processed by s2s"
                  );
                }
              }
            }
            redirectPath = `/order/confirmed/${orderId}`;
          } catch (e) {
            const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
              `/store/carts/${cartId}`,
              {
                method: "GET",
              }
            );
            console.log("order incomplete");
            console.error(e);
            redirectPath = redirectErrorPath;
          }
        } catch (e) {
          console.error(e);
          redirectPath = redirectErrorPath;
        }
      } else {
        console.log(
          `checksum mismatch ${checksum} != ${receivedChecksum?.valueOf()}`
        );
        redirectPath = redirectErrorPath;
      }
    }
  } else {
    console.log(`code is not PAYMENT_SUCCESS: ${code?.valueOf()}`);
    redirectPath = redirectErrorPath;
  }

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url), 303);
  }

  return NextResponse.json({ success: false });
} 