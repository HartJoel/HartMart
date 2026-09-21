import express from "express";
import { confirmPayment, initializePayment } from "./payment.controller.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/initialize", initializePayment);
router.post("/:paymentId/confirm", confirmPayment);

export default router;
