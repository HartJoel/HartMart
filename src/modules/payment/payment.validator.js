import { z } from "zod";

export const initializePaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required").trim(),
});

export const paystackWebhookSchema = z.object({
  event: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});
