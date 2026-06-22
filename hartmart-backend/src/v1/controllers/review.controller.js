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

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewService.getReviews(req.params.productId);

  return res.status(201).json({
    success: true,
    message: "Product reviews retrieved successfully",
    data: reviews,
  });
});

export const respondToReview = asyncHandler(async (req, res) => {
  const reviewRespond = await ReviewService.respondToReview(
    req.params.reviewId,
    req.user.id,
    req.body.response,
  );

  return res.status(201).json({
    success: true,
    message: "Vendor responds successfully",
    data: reviewRespond,
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const updated = await ReviewService.updateReview(
    req.user.id,
    req.params.reviewId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: updated,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await ReviewService.deleteReview(req.user.id, req.params.reviewId);

  return res.status(204).send();
});

export const toggleHelpful = asyncHandler(async (req, res) => {
  const result = await ReviewService.toggleHelpful(
    req.params.reviewId,
    req.user.id,
  );

  return res.status(200).json({
    success: true,
    message: "Toggled successfully",
    data: result,
  });
});
