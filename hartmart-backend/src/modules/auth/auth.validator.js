import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(20, "Name cannot exceed 20 characters")
    .trim(),

  email: z.string().email("Invalid email address").trim().toLowerCase(),

  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),

  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password cannot exceed 100 characters"),
});
