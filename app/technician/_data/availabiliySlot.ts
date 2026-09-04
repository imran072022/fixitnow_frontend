import { TAvailabilitySlot } from "../_types/types";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const setAvailability = async (payload: TAvailabilitySlot) => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/technicians/me/availability`,
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
