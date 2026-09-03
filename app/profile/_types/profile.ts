import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(30, "Name cannot exceed 30 characters."),

  photoUrl: z
    .string()
    .trim()
    .max(500, "Photo URL cannot exceed 500 characters."),

  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValidPhoneNumber(value),
      "Invalid phone number.",
    ),

  dob: z
    .string()
    .refine((value) => value !== "", "Date of birth is required.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime());
    }, "Invalid date of birth.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return date <= new Date();
    }, "Date of birth cannot be in the future."),

  location: z
    .string()
    .trim()
    .max(120, "Location cannot exceed 120 characters."),

  experience: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 80),
      "Experience must be a whole number between 0 and 80.",
    ),
});

export type ProfileRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type TechnicianProfile = {
  id: string;
  userId: string;
  dob: string;
  location: string;
  experience: number;
  isOnVacation: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isBookable: boolean;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: ProfileRole;
  photoUrl: string | null;
  phone: string | null;
  technicianProfile?: TechnicianProfile;
};

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type ProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile;
};

export type UpdateProfilePayload = {
  name: string;
  photoUrl: string | null;
  phone: string | null;
  dob?: string;
  location?: string;
  experience?: number;
};
export type ProfileApiError = {
  field?: string;
  message: string;
};

export type ProfileErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors?: ProfileApiError[];
};
