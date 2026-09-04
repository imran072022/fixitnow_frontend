export const bookingStatuses = [
  "REQUESTED",
  "DENIED",
  "ACCEPTED",
  "PAID",
  "CANCELLED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export type CreateBookingPayload = {
  serviceId: string;
  bookingDate: string;
  location: string;
  bookingDetails: string;
};

export type CreateBookingResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
};

export type CreateCheckoutSessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: { checkoutUrl: string | null };
};

export type BookingPerson = {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  photoUrl?: string | null;
};

export type BookingService = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: { id: string; name: string };
};

export type BookingTechnicianProfile = {
  id: string;
  location: string;
  experience: number;
  isOnVacation: boolean;
  ratingAverage: number;
  reviewCount: number;
  user: BookingPerson;
};

export type BookingReview = {
  id: string;
  reviewerId: string;
  bookingId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  customerId: string;
  technicianProfileId: string;
  serviceId: string;
  bookingDetails: string;
  location: string;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  service?: BookingService;
  technicianProfile?: BookingTechnicianProfile;
  customer?: BookingPerson;
  review: BookingReview | null;
};

export type BookingListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: { total: number; bookings: Booking[] };
};

export type BookingDetailResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Booking;
};

export type UpdateBookingStatusPayload = { status: BookingStatus };

export type UpdateBookingStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Booking;
};

export type CreateReviewPayload = {
  bookingId: string;
  rating: number;
  review: string;
};

export type ReviewResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingReview;
};
