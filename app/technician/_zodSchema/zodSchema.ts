import { z } from "zod";
import { DayOfWeek } from "../_types/types";

export const createServiceSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
});

export type CreateServiceFormInput = z.input<typeof createServiceSchema>;
export type CreateServiceFormData = z.output<typeof createServiceSchema>;

export const availabilitySchema = z
  .object({
    dayOfWeek: z.enum([
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ]),
    startMinute: z.number().int(),
    endMinute: z.number().int(),
  })
  .refine((data) => data.endMinute > data.startMinute, {
    message: "End time must be after start time.",
    path: ["endMinute"],
  });
