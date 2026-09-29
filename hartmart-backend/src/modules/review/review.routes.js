import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReviews,
  respondToReview,
  toggleHelpful,
  updateReview,
} from "./review.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { createReviewSchema, reviewResponseSchema, updateReviewSchema } from "./review.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(createReviewSchema), createReview);
router.get("/:productId", validateIdParam("productId"), getReviews);
router.patch("/:reviewId", validateIdParam("reviewId"), validateRequest(updateReviewSchema), updateReview);
router.post("/:reviewId/response", validateIdParam("reviewId"), validateRequest(reviewResponseSchema), respondToReview);
router.delete("/:reviewId", validateIdParam("reviewId"), deleteReview);
router.post("/:reviewId/helpful", validateIdParam("reviewId"), toggleHelpful);

export default router;
