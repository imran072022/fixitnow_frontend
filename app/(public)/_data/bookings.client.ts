import type {
  CreateBookingPayload,
  CreateBookingResponse,
} from "../_types/bookings";

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/bookings`;

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response
    .json()
    .catch(() => null)) as CreateBookingResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to create booking request.");
  }

  return result;
}
