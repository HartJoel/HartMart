import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReviews,
  respondToReview,
  toggleHelpful,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createReview);
router.get("/:productId", getReviews);
router.patch("/:reviewId", updateReview);
router.post("/:reviewId/response", respondToReview);
router.delete("/:reviewId", deleteReview);
router.post("/:reviewId/helpful", toggleHelpful);

export default router;
