import { Heading, Text, clx, Button } from "@medusajs/ui"
import { useState } from "react"

type CryptoPaymentProps = {
  isSelected?: boolean
}

const CryptoPayment = ({ isSelected = false }: CryptoPaymentProps) => {
  const [copied, setCopied] = useState(false)
  const cryptoAddress = "0x1234567890abcdef1234567890abcdef12345678"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div
      className={clx(
        "relative flex flex-col gap-y-4 border rounded-lg p-6 transition-colors",
        {
          "border-ui-border-interactive bg-ui-bg-subtle": isSelected,
          "border-ui-border-base": !isSelected,
        }
      )}
    >
      <div className="flex flex-col gap-y-1">
        <Heading level="h3" className="font-medium">
          Pay with Cryptocurrency
        </Heading>
        <Text className="text-ui-fg-subtle">
          Complete your purchase using cryptocurrency
        </Text>
      </div>
      {isSelected && (
        <div className="flex flex-col gap-y-4 mt-2">
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-base font-medium">Wallet Address:</Text>
            <div className="w-full flex items-center gap-x-2 bg-ui-bg-field border border-ui-border-base rounded-md p-2">
              <Text className="text-ui-fg-subtle flex-1 break-all font-mono text-sm">
                {cryptoAddress}
              </Text>
              <Button 
                variant="secondary" 
                size="small" 
                className="sparkle-btn"
                onClick={handleCopyAddress}
              >
                {copied ? "Copied!" : "Copy Address"}
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <Text className="text-ui-fg-subtle text-sm">
              1. Copy the wallet address above
              <br />
              2. Send the exact amount from your crypto wallet
              <br />
              3. Once confirmed (may take a few minutes), your order will be processed
              <br />
              4. We accept BTC, ETH, USDC, and other major cryptocurrencies
            </Text>
          </div>
          <div className="p-4 bg-ui-bg-subtle rounded-md border border-ui-border-base mt-2">
            <Text className="text-ui-fg-base font-medium">Important:</Text>
            <Text className="text-ui-fg-subtle text-sm mt-1">
              • Please send only the exact amount shown at checkout
              <br />
              • Include your order number in the transaction memo if possible
              <br />
              • Transactions typically take 10-60 minutes to be confirmed
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default CryptoPayment 