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

export type AvailabilitySlot = {
  id: string;
  dayOfWeek: string;
  startMinute: number;
  endMinute: number;
};

export type TechnicianService = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type Reviewer = {
  name: string;
  photoUrl: string | null;
};

export type Review = {
  id: string;
  rating: number;
  review: string;
  createdAt: string;
  reviewer: Reviewer;
};

export type BookingWithReview = {
  review: Review | null;
};

export type TechnicianProfileUser = {
  name: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
};

export type TechnicianProfile = {
  id: string;
  dob: string;
  location: string;
  experience: number;
  isOnVacation: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  user: TechnicianProfileUser;
  availabilitySlots: AvailabilitySlot[];
  services: TechnicianService[];
  bookings: BookingWithReview[];
  isBookable: boolean;
};

export type GetTechnicianProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: TechnicianProfile;
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
