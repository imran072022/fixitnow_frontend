import { z } from "zod";

import { availabilityDays } from "../_types/availability";

export const availabilitySchema = z
  .object({
    dayOfWeek: z.enum(availabilityDays),
    startMinute: z.number().int(),
    endMinute: z.number().int(),
  })
  .refine((data) => data.endMinute > data.startMinute, {
    message: "End time must be after start time.",
    path: ["endMinute"],
  });

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;
