export async function logout() {
  const response = await fetch(`${process.env.API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Logout failed.");
  }
  return result;
}
