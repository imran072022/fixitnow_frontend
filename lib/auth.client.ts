export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Logout failed.");
  }
  return result;
}
