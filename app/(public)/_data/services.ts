import { GetServicesResponse, TGetServicesQuery } from "../_types/services";

export const getServices = async (
  query: TGetServicesQuery = {},
): Promise<GetServicesResponse> => {
  const params = new URLSearchParams();

  if (query.search) params.append("search", query.search);
  if (query.category) params.append("category", query.category);
  if (query.minPrice !== undefined)
    params.append("minPrice", query.minPrice.toString());
  if (query.maxPrice !== undefined)
    params.append("maxPrice", query.maxPrice.toString());
  if (query.sortBy) params.append("sortBy", query.sortBy);
  if (query.sortOrder) params.append("sortOrder", query.sortOrder);
  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.limit !== undefined) params.append("limit", query.limit.toString());

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services?${params.toString()}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }
  return res.json();
};
