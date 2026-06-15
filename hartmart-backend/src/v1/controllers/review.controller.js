import ReviewService from "../../services/review.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await ReviewService.addReviewService({
    ...req.body,
    userId: req.user.id,
  });

  return res.status(201).json({
    success: true,
    data: review,
  });
});
