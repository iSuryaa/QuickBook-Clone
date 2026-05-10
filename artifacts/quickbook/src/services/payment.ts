const IS_SIMULATION = true;

export interface PaymentResult {
  paymentId: string;
  status: "success" | "failed";
}

export async function processPayment(amountInPaise: number): Promise<PaymentResult> {
  if (IS_SIMULATION) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      paymentId: `pay_sim_${Date.now()}`,
      status: "success",
    };
  }
  throw new Error("Real payment not configured");
}
