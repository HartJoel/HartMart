import ReviewRespository from "../repositories/review.respository.js";

class ReviewService {
  static async addReviewService(payload) {
    return await ReviewRespository.createReview(payload);
  }

  static async getReviewsService(productId) {
    return await ReviewRespository.getProductsReviews(productId);
  }

  static async respondToReviewService(reviewId, vendorId, response) {
    const review = await ReviewRespository.findReviewById(reviewId);

    // optional: validate vendor owns product here
    return await ReviewRespository.createVendorResponse(reviewId, response);
  }
}

export default ReviewService;
