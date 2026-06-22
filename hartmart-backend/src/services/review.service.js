import ReviewRespository from "../repositories/review.respository.js";
import VendorRepository from "../repositories/vendor.responsitory.js";
import AppError from "../utils/AppError.js";

class ReviewService {
  static async addReviewService(payload) {
    const { productId, userId, orderId } = payload;

    const existingReview = await ReviewRespository.hasReviewed(
      productId,
      userId,
      orderId,
    );
    if (existingReview) {
      throw new AppError(
        "You have already reviewed this product for this order",
        409,
      );
    }

    return await ReviewRespository.createReview(payload);
  }

  static async getReviews(productId) {
    return await ReviewRespository.getProductsReviews(productId);
  }

  static async respondToReview(reviewId, userId, response) {
    const review = await ReviewRespository.findReviewById(reviewId);

    const vendor = await VendorRepository.findUserId(userId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.product.vendorId !== vendor.id) {
      throw new AppError(
        "You can only respond to reviews on your own products",
        403,
      );
    }

    return await ReviewRespository.createVendorResponse(reviewId, response);
  }

  static async updateReview(userId, reviewId, data) {
    const review = await ReviewRespository.findReviewById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    return ReviewRespository.updateReview(reviewId, {
      rating: data.rating,
      comment: data.comment,
    });
  }

  static async deleteReview(userId, reviewId) {
    const review = await ReviewRespository.findReviewById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    await ReviewRespository.deleteReview(reviewId);
  }

  static async toggleHelpful(reviewId, userId) {
    const review = await ReviewRespository.findReviewById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    const existingVote = await ReviewRespository.findVote(reviewId, userId);

    // 👎 REMOVE LIKE
    if (existingVote) {
      await ReviewRespository.removeVote(reviewId, userId);

      const count = await ReviewRespository.countVotes(reviewId);

      return {
        liked: false,
        helpful: count,
      };
    }

    // 👍 ADD LIKE
    await ReviewRespository.addVote(reviewId, userId);

    const count = await ReviewRespository.countVotes(reviewId);

    return {
      liked: true,
      helpful: count,
    };
  }
}

export default ReviewService;
