// services/availability.api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const setAvailability = async (payload: TAvailabilitySlot) => {
  const response = await fetch(`${API_URL}/technician/availability`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to set availability.");
  }

  return result;
};
