import { cookies } from "next/headers";

import type {
  AvailabilityResponse,
  AvailabilitySlot,
} from "../_types/availability";

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/technicians/me/availability`;

export async function getMyAvailability(): Promise<AvailabilitySlot[]> {
  const cookieStore = await cookies();
  const response = await fetch(ENDPOINT, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  const result = (await response
    .json()
    .catch(() => null)) as AvailabilityResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch availability slots.");
  }

  return result.data;
}
