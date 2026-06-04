import { prisma } from "../config/db.js";

class WishlistRepository {
  static async findItem(userId, productId) {
    return prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  static async create(data) {
    return prisma.wishlistItem.create({ data });
  }

  static async getUserWishlist(userId) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}

export default WishlistRepository;
