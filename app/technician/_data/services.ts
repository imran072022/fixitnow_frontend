const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Category = {
  id: string;
  name: string;
};

export type CreateServicePayload = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch categories.");
  }
  return result.data;
};

export const createService = async (payload: CreateServicePayload) => {
  const response = await fetch(`${API_URL}/services`, {
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
