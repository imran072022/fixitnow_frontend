import { GetCategoriesResponse } from "../_types/categories";

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Categories API failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
};
