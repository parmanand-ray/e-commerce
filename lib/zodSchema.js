import z from "zod";

export const zSchema = z.object({
    email: z
    .string()
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number"),

    name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[A-Za-z ]+$/, "Name can contain only letters and spaces"),

      otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});