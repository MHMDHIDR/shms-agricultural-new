import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const signInSchema = z.object({
  emailOrPhone: z
    .string({ required_error: "Email or phone number is required" })
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || isValidPhoneNumber(value);
      },
      {
        message: "Please provide a valid email or phone number",
      },
    ),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
