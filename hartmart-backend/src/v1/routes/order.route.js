import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getOrder,
  getTimeline,
  getUserOrders,
  getVendorOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/vendor", getVendorOrders);
router.get("/:orderId", getOrder);
router.get("/:orderId/timeline", getTimeline);

export default router;
