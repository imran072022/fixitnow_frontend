export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  technicianProfile: {
    id: string;
    location: string;
    user: {
      name: string;
    };
  };
  category: {
    name: string;
  };
};

export type GetServicesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    services: Service[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type TGetServicesQuery = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};
