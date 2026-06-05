import { prisma } from "../config/db.js";

class ReviewRespository {
  static async createReview(data) {
    return prisma.review.create({
      data,
    });
  }

  static async getProductsReviews(productId) {
    return prisma.review.findMany({
      where: { productId },
    });
  }

  static async createVendorResponse(reviewId, response) {
    return prisma.review.create({
      data: {
        reviewId,
        response,
      },
    });
  }

  static async findReviewById(reviewId) {
    return prisma.review.findUnique({
      where: { id: reviewId },
    });
  }
}

export default ReviewRespository