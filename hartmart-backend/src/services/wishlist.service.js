import ProductRepository from "../repositories/product.repository.js";
import WishlistRepository from "../repositories/wishlist.respository.js";
import AppError from "../utils/AppError.js";

class WishlistService {
  static async addToWishList(userId, productId) {
    const product = await ProductRepository.findbyId(productId);

    if (!product) {
      throw new AppError("Product not Found", 404);
    }

    const existing = await WishlistRepository.findItem(userId, productId);

    if (existing) {
      return existing; // already exists, ignore duplicate
    }

    return await WishlistRepository.create({
      userId,
      productId,
    });
  }

  static async getWishlist(userId) {
    return await WishlistRepository.getUserWishlist(userId);
  }

  static async deleteFromWishlist(userId, wishlistId) {
    return await WishlistRepository.removeItem(userId, wishlistId);
  }

  static async checkWishlist(userId, productId) {
    const item = await WishlistRepository.findItem(userId, productId);

    return {
      inWishlist: !!item,
    };
  }
}

export default WishlistService;
