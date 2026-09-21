import express from "express";
import {
  confirmPayment,
  getPayment,
  getPayments,
  initializePayment,
  paystackWebhook,
} from "./payment.controller.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { requireRole } from "../../shared/middleware/rbac.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/initialize", initializePayment);
router.post("/:paymentId/confirm", confirmPayment);
router.post("/webhooks/paystack", paystackWebhook);
router.get("/", requireRole("ADMIN"), getPayments);
router.get("/:paymentId", getPayment);

export default router;
