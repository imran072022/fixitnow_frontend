import { cookies } from "next/headers";

import type {
  BookingDetailResponse,
  BookingListResponse,
} from "../_types/bookings";

const ENDPOINT = `${process.env.API_URL}/bookings`;

async function getCookieHeader() {
  return (await cookies()).toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { success?: boolean; message?: string })
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch bookings.");
  }

  return result;
}

export async function getBookingsServer(): Promise<BookingListResponse> {
  const response = await fetch(ENDPOINT, {
    headers: { Cookie: await getCookieHeader() },
    cache: "no-store",
  });
  return parseResponse<BookingListResponse>(response);
}

export async function getBookingServer(
  id: string,
): Promise<BookingDetailResponse> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    headers: { Cookie: await getCookieHeader() },
    cache: "no-store",
  });
  return parseResponse<BookingDetailResponse>(response);
}
