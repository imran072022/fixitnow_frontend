import type {
  Category,
  GetCategoriesResponse,
} from "@/app/(public)/_types/categories";

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

type CategoryMutationResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { success?: boolean; message?: string })
    | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Category request failed.");
  }

  return result;
}

export async function getAdminCategories(): Promise<GetCategoriesResponse> {
  const response = await fetch(ENDPOINT, { credentials: "include" });
  return parseResponse<GetCategoriesResponse>(response);
}

export async function createCategory(
  categoryName: string,
): Promise<CategoryMutationResponse> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ categoryName }),
  });
  return parseResponse<CategoryMutationResponse>(response);
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<CategoryMutationResponse> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  return parseResponse<CategoryMutationResponse>(response);
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return parseResponse<{ message: string }>(response);
}
