import type {
  AvailabilityPayload,
  AvailabilitySlot,
  AvailabilitySlotResponse,
} from "../_types/availability";

const ENDPOINT = "/api/backend/technicians/me/availability";

export async function createAvailability(payload: AvailabilityPayload) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return parseMutationResponse(response);
}

export async function updateAvailability(
  id: string,
  payload: AvailabilityPayload,
): Promise<AvailabilitySlot> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const result = await parseMutationResponse(response);
  return result.data;
}

async function parseMutationResponse(
  response: Response,
): Promise<AvailabilitySlotResponse> {
  const result = (await response
    .json()
    .catch(() => null)) as AvailabilitySlotResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to save availability slot.");
  }

  return result;
}
