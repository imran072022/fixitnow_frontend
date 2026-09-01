import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-cache",
  });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  const result = await response.json();
  return result.data;
}

export async function refreshAccessToken() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (!response.ok) {
    return false;
  }
  return true;
}
