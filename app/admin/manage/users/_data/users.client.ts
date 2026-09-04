import type { AdminUserStatus, AdminUsersResponse } from "../_types/users";

const ENDPOINT = `${process.env.API_URL}/admin/users`;

type UserStatusResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { success?: boolean; message?: string })
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Admin request failed.");
  }

  return result;
}

export async function getAdminUsers(): Promise<AdminUsersResponse> {
  const response = await fetch(ENDPOINT, { credentials: "include" });
  return parseResponse<AdminUsersResponse>(response);
}

export async function updateUserStatus(
  id: string,
  status: AdminUserStatus,
): Promise<UserStatusResponse> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return parseResponse<UserStatusResponse>(response);
}
