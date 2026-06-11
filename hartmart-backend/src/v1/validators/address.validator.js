import { z } from "zod";

export const createAddressSchema = z.object({
  addressLine: z
    .string()
    .min(3, "Address line must be at least 3 characters")
    .max(255, "Address line cannot exceed 255 characters")
    .trim(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters")
    .trim(),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters")
    .trim(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country cannot exceed 100 characters")
    .trim(),

  zipCode: z
    .string()
    .min(3, "Zip code is too short")
    .max(20, "Zip code is too long")
    .trim(),

});


export const updateAddressSchema = z.object({
  addressLine: z
    .string()
    .min(3, "Address line must be at least 3 characters")
    .max(255, "Address line cannot exceed 255 characters")
    .trim()
    .optional(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters")
    .trim()
    .optional(),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters")
    .trim()
    .optional(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country cannot exceed 100 characters")
    .trim()
    .optional(),

  zipCode: z
    .string()
    .min(3, "Zip code is too short")
    .max(20, "Zip code is too long")
    .trim()
    .optional(),

  isDefault: z.boolean().optional(),
});