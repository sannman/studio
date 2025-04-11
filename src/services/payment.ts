"use server"
/**
 * Represents payment information, including the payment amount.
 */
export interface Payment {
  /**
   * The amount paid.
   */
  amount: number;
  /**
   * The tip amount.
   */
  tip: number;
}

/**
 * Represents the result of processing a payment.
 */
export interface PaymentResult {
  /**
   * Indicates whether the payment was successful.
   */
  success: boolean;
  /**
   * A message providing additional information about the payment result.
   */
  message: string;
}

/**
 * Asynchronously processes a payment.
 *
 * @param payment The payment information.
 * @returns A promise that resolves to a PaymentResult object.
 */
export async function processPayment(payment: Payment): Promise<PaymentResult> {
  // Simulate an API call with a 1-second delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a successful payment
  return {
    success: true,
    message: 'Payment processed successfully.'
  };
}
