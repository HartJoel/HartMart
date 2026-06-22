import { prisma } from "../config/db.js";

class ReviewRespository {
  static async createReview(data) {
    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async getProductsReviews(productId) {
    return prisma.review.findMany({
      where: { productId },
    });
  }

  static async createVendorResponse(reviewId, response) {
    return prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        vendorResponse: response,
        vendorResponseAt: new Date(),
      },
    });
  }

  static async updateReview(reviewId, data) {
    return prisma.review.update({
      where: { id: reviewId },
      data,
    });
  }

  static async deleteReview(reviewId) {
    return prisma.review.delete({
      where: { id: reviewId },
    });
  }

  static async hasReviewed(productId, userId, orderId) {
    return prisma.review.findFirst({
      where: {
        productId,
        userId,
        orderId,
      },
    });
  }

  static async findReviewById(reviewId) {
    return prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        product: {
          select: {
            id: true,
            vendorId: true,
          },
        },
      },
    });
  }


  static async findVote(reviewId, userId) {
    return prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });
  }

  static async addVote(reviewId, userId) {
    return prisma.reviewHelpful.create({
      data: {
        reviewId,
        userId,
      },
    });
  }

  static async removeVote(reviewId, userId) {
    return prisma.reviewHelpful.delete({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });
  }

  static async countVotes(reviewId) {
    return prisma.reviewHelpful.count({
      where: { reviewId },
    });
  }
}


export default ReviewRespository;
