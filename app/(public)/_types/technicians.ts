export type Technician = {
  id: string;
  location: string;
  experience: number;
  ratingAverage: number;
  reviewCount: number;
  user: {
    name: string;
    phone: string | null;
    photoUrl: string | null;
  };
  services: {
    name: string;
    price: number;
  }[];
};

export type GetTechniciansResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    technicianProfiles: Technician[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type TGetTechnicianProfilesQuery = {
  search?: string;
  category?: string;
  minExperience?: number;
  minRating?: number;
  sortBy?: "experience" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};
