import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createReview } from "../controllers/review.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createReview);

export default router;
