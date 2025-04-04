export enum PaymentStatusCodeValues {
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_ERROR = "PAYMENT_ERROR",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_USER_DROPPED = "PAYMENT_USER_DROPPED"
}

export interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId: string;
    instrumentResponse?: {
      type: string;
      redirectInfo?: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PaymentInstrumentWeb {
  type: string;
}

export interface PaymentInstrumentUPI {
  type: string;
  utr?: string;
  targetApp?: string;
  accountConstraints?: AccountConstraint[];
}

export interface AccountConstraint {
  accountNumber?: string;
  ifsc?: string;
} 