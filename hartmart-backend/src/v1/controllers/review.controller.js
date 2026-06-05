import ReviewService from "../../services/review.service.js";

export const createReview = async (req, res) => {
  try {
    const review = await ReviewService.addReviewService({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
