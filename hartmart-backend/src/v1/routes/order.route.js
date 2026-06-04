import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import createOrder from "../controllers/order.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);

export default router;
