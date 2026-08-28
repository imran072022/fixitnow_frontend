import {
  GetTechnicianProfileResponse,
  GetTechniciansResponse,
  TGetTechnicianProfilesQuery,
} from "../_types/technicians";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTechnicians = async (
  query: TGetTechnicianProfilesQuery = {},
): Promise<GetTechniciansResponse> => {
  const params = new URLSearchParams();

  if (query.search) params.append("search", query.search);
  if (query.category) params.append("category", query.category);
  if (query.minExperience !== undefined)
    params.append("minExperience", query.minExperience.toString());
  if (query.minRating !== undefined)
    params.append("minRating", query.minRating.toString());
  if (query.sortBy) params.append("sortBy", query.sortBy);
  if (query.sortOrder) params.append("sortOrder", query.sortOrder);
  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.limit !== undefined) params.append("limit", query.limit.toString());

  const res = await fetch(`${API_URL}/technicians?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch technicians");
  }
  return res.json();
};

export const getTechnicianProfile = async (
  id: string,
): Promise<GetTechnicianProfileResponse> => {
  const res = await fetch(`${API_URL}/technicians/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch technician profile");
  }
  return res.json();
};
