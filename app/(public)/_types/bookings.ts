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
