import { z } from "zod";

export const createOrderSchema = z.object({
  customerNotes: z.string().max(5000).trim().optional().nullable(),
});
