import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  bookingDate: z.string().min(1, "Please select a date."),
  bookingTime: z.string().min(1, "Please select a time."),
  location: z
    .string()
    .trim()
    .min(1, "Please enter the service location.")
    .max(100, "Location cannot exceed 100 characters."),
  bookingDetails: z
    .string()
    .trim()
    .min(1, "Please add some details about the work.")
    .max(250, "Booking details cannot exceed 250 characters."),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
