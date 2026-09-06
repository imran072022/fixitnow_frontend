import { Category, CreateServicePayload } from "../_types/types";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/categories`, {
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch categories.");
  }
  return result.data;
};

export const createService = async (payload: CreateServicePayload) => {
  const response = await fetch("/api/backend/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to create service.");
  }
  return result;
};
