import z from "zod";
import { loginSchema, registerSchema } from "../_validation/zodSchema";

export type TRegisterFormData = z.infer<typeof registerSchema>;
export type TLoginFormData = z.infer<typeof loginSchema>;
