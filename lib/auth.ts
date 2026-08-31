import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  console.log("NEXT COOKIE:", cookieStore.toString());
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
