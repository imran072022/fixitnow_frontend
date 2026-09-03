import { z } from "zod";

export const createServiceSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
});

export type CreateServiceFormInput = z.input<typeof createServiceSchema>;
export type CreateServiceFormData = z.output<typeof createServiceSchema>;
