import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createOrder,
  getOrder,
  getTimeline,
  getUserOrders,
  getVendorOrders,
} from "./order.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { createOrderSchema } from "./order.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(createOrderSchema), createOrder);
router.get("/", getUserOrders);
router.get("/vendor", getVendorOrders);
router.get("/:orderId", validateIdParam("orderId"), getOrder);
router.get("/:orderId/timeline", validateIdParam("orderId"), getTimeline);

export default router;
