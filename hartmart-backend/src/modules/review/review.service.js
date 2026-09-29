import ReviewRespository from "./review.repository.js";
import VendorRepository from "../vendor/vendor.repository.js";
import AppError from "../../shared/utils/AppError.js";
import EventService from "../../events/eventService.js";
import EventTypes from "../../events/eventTypes.js";
import ProductRepository from "../product/product.repository.js";
import logger from "../../shared/utils/logger.js";

class ReviewService {
  static async addReviewService(payload) {
    const { productId, userId, orderId } = payload;

    const product = await ProductRepository.findbyId(productId);

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

    const review = await ReviewRespository.createReview(payload);

    EventService.emit(EventTypes.REVIEW_POSTED, {
      review,
      product,
      customerId: review.userId,
      vendorId: product.vendorId,
    });
    logger.info("Review created", { reviewId: review.id, productId, userId, vendorId: product.vendorId, rating: review.rating });
    return review;
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

    const updatedReview = await ReviewRespository.createVendorResponse(reviewId, response);

    EventService.emit(EventTypes.REVIEW_RESPONSE, {
      review,
      product: review.product,
      customerId: review.userId,
      vendorId: vendor.id,
      vendorUserId: userId,
    });
    logger.info("Vendor responded to review", { reviewId, vendorId: vendor.id, customerId: review.userId });
    return updatedReview;
  }

  static async updateReview(userId, reviewId, data) {
    const review = await ReviewRespository.findReviewById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const updatedReview = await ReviewRespository.updateReview(reviewId, {
      rating: data.rating,
      comment: data.comment,
    });
    EventService.emit(EventTypes.REVIEW_UPDATED, { userId, review: updatedReview });
    logger.info("Review updated", { reviewId, userId, rating: updatedReview.rating });
    return updatedReview;
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
    EventService.emit(EventTypes.REVIEW_DELETED, { userId, review });
    logger.info("Review deleted", { reviewId, userId, productId: review.productId });
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
      logger.info("Review helpful vote removed", { reviewId, userId, helpfulVoteCount: count });

      return {
        liked: false,
        helpful: count,
      };
    }

    await ReviewRespository.addVote(reviewId, userId);

    const count = await ReviewRespository.countVotes(reviewId);
    logger.info("Review marked helpful", { reviewId, userId, helpfulVoteCount: count });

    return {
      liked: true,
      helpful: count,
    };
  }
}

export default ReviewService;
