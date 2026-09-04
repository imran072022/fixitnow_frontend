import { cookies } from "next/headers";

import type { AdminUsersResponse } from "../_types/users";

const ENDPOINT = `${process.env.API_URL}/admin/users`;

export async function getAdminUsersServer(): Promise<AdminUsersResponse> {
  const response = await fetch(ENDPOINT, {
    headers: { Cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  const result = (await response
    .json()
    .catch(() => null)) as AdminUsersResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch users.");
  }

  return result;
}
