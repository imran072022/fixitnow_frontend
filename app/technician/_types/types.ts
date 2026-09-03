import z from "zod";
import { availabilitySchema } from "../_zodSchema/zodSchema";

// Technician service types
export type Category = {
  id: string;
  name: string;
};

export type CreateServicePayload = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
};

// Availability slot types
export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export type TAvailabilitySlot = {
  dayOfWeek: DayOfWeek;
  startMinute: number;
  endMinute: number;
};
export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;
