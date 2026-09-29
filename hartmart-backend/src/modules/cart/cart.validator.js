import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required").trim(),
  quantity: z.coerce.number().int().min(1).max(100),
  selectedVariation: z.record(z.string(), z.unknown()).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(100),
});
