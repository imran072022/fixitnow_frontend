import type {
  BookingDetailResponse,
  BookingListResponse,
  CreateCheckoutSessionResponse,
  CreateBookingPayload,
  CreateBookingResponse,
  CreateReviewPayload,
  ReviewResponse,
  UpdateBookingStatusPayload,
  UpdateBookingStatusResponse,
} from "../_types/bookings";

const ENDPOINT = `${process.env.API_URL}/bookings`;
const PAYMENT_ENDPOINT = `${process.env.API_URL}/payments/create-checkout-session`;
const REVIEW_ENDPOINT = `${process.env.API_URL}/reviews`;

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

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { success?: boolean; message?: string })
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Booking request failed.");
  }

  return result;
}

export async function getBookings(): Promise<BookingListResponse> {
  const response = await fetch(ENDPOINT, { credentials: "include" });
  return parseResponse<BookingListResponse>(response);
}

export async function getBooking(id: string): Promise<BookingDetailResponse> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    credentials: "include",
  });
  return parseResponse<BookingDetailResponse>(response);
}

export async function updateBookingStatus(
  id: string,
  payload: UpdateBookingStatusPayload,
): Promise<UpdateBookingStatusResponse> {
  const response = await fetch(`${ENDPOINT}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return parseResponse<UpdateBookingStatusResponse>(response);
}

export async function createCheckoutSession(
  bookingId: string,
): Promise<CreateCheckoutSessionResponse> {
  const response = await fetch(PAYMENT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id: bookingId }),
  });
  return parseResponse<CreateCheckoutSessionResponse>(response);
}

export async function createReview(
  payload: CreateReviewPayload,
): Promise<ReviewResponse> {
  const response = await fetch(REVIEW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return parseResponse<ReviewResponse>(response);
}
