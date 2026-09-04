import { cookies } from "next/headers";

import type { Profile, ProfileResponse } from "../_types/profile";

const PROFILE_ENDPOINT = `${process.env.API_URL}/profile/me`;

export async function getProfile(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const response = await fetch(PROFILE_ENDPOINT, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const result: ProfileResponse = await response.json();
  return result.data;
}
