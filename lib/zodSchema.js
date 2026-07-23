import z from "zod";

export const zSchema = z.object({
  email: z.string().email("Invalid email format"),

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

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  _id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Mongo ObjectId"),
  alt: z
    .string()
    .trim()
    .min(1, "Alt is required")
    .max(160, "Alt must be <= 160 characters"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be <= 120 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug must be at most 80 characters")
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens only",
    ),
  category: z.string().min(3, "Category Is Required"),
  mrp: z.union([
    z.number().positive("Expected Positive Value "),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, "Please Enter a Valid Value"),
  ]),
  sellingPrice: z.union([
    z.number().positive("Expected Positive Value "),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, "Please Enter a Valid Value"),
  ]),
  discountPercentage: z.union([
    z.number().positive("Expected Positive Value "),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, "Please Enter a Valid Value"),
  ]),
});
