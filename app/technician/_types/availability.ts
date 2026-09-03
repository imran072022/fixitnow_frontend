export const availabilityDays = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export type DayOfWeek = (typeof availabilityDays)[number];

export type AvailabilitySlot = {
  id: string;
  technicianProfileId: string;
  dayOfWeek: DayOfWeek;
  startMinute: number;
  endMinute: number;
  createdAt: string;
  updatedAt: string;
};

export type AvailabilityPayload = {
  dayOfWeek: DayOfWeek;
  startMinute: number;
  endMinute: number;
};

export type AvailabilityResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: AvailabilitySlot[];
};

export type AvailabilitySlotResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: AvailabilitySlot;
};
