import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1).trim(),
  orderId: z.string().min(1).trim(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(10000).trim().optional().nullable(),
});

export const updateReviewSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    comment: z.string().max(10000).trim().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, "Provide a rating or comment to update");

export const reviewResponseSchema = z.object({
  response: z.string().min(1).max(10000).trim(),
});
