import type { ProfileResponse, UpdateProfilePayload } from "../_types/profile";

const PROFILE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/profile/me`;

type ProfileApiErrorItem = {
  field: string;
  message: string;
};

type ProfileErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors?: ProfileApiErrorItem[];
};

export class ProfileApiError extends Error {
  statusCode: number;
  errors?: ProfileApiErrorItem[];

  constructor(
    message: string,
    statusCode: number,
    errors?: ProfileApiErrorItem[],
  ) {
    super(message);
    this.name = "ProfileApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

function isProfileErrorResponse(
  result: ProfileResponse | ProfileErrorResponse,
): result is ProfileErrorResponse {
  return result.success === false;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  const response = await fetch(PROFILE_ENDPOINT, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as
    | ProfileResponse
    | ProfileErrorResponse;

  if (!response.ok || isProfileErrorResponse(result)) {
    if (isProfileErrorResponse(result)) {
      throw new ProfileApiError(
        result.message || "Failed to update profile.",
        result.statusCode,
        result.errors,
      );
    }

    throw new ProfileApiError("Failed to update profile.", response.status);
  }

  return result;
}
