import { cookies } from "next/headers";

import type { PaymentHistoryResponse } from "../_types/payments";

const ENDPOINT = `${process.env.API_URL}/payments`;

export async function getPaymentsServer(): Promise<PaymentHistoryResponse> {
  const response = await fetch(ENDPOINT, {
    headers: { Cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  const result = (await response
    .json()
    .catch(() => null)) as PaymentHistoryResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch payment history.");
  }

  return result;
}
