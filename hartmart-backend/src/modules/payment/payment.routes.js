import express from "express";
import { initializePayment } from "./payment.controller.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/initialize", initializePayment);

export default router;
