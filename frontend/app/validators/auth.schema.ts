import { z } from "zod";

export const artistRegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username is required")
    .max(30, "Username must be at most 30 characters long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  // confirmPassword: z.string().min(1, "Confirm password is required"),
});

export type ArtistRegistrationFormData = z.infer<
  typeof artistRegistrationSchema
>;
