import { TAvailabilitySlot } from "../_types/types";

export const setAvailability = async (payload: TAvailabilitySlot) => {
  const response = await fetch(
    "/api/backend/technicians/me/availability",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to set availability.");
  }

  return result;
};
