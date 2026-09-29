import ProductRepository from "../product/product.repository.js";
import WishlistRepository from "./wishlist.repository.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/utils/logger.js";

class WishlistService {
  static async addToWishList(userId, productId) {
    const product = await ProductRepository.findbyId(productId);

    if (!product) {
      throw new AppError("Product not Found", 404);
    }

    const existing = await WishlistRepository.findItem(userId, productId);

    if (existing) {
      logger.info("Wishlist item already exists", { userId, productId });
      return existing; // already exists, ignore duplicate
    }

    const item = await WishlistRepository.create({
      userId,
      productId,
    });
    logger.info("Product added to wishlist", { userId, productId, wishlistItemId: item.id });
    return item;
  }

  static async getWishlist(userId) {
    const items = await WishlistRepository.getUserWishlist(userId);
    logger.info("Wishlist retrieved", { userId, itemCount: items.length });
    return items;
  }

  static async deleteFromWishlist(userId, wishlistId) {
    const result = await WishlistRepository.removeItem(userId, wishlistId);
    logger.info("Wishlist item removed", { userId, wishlistItemId: wishlistId });
    return result;
  }

  static async checkWishlist(userId, productId) {
    const item = await WishlistRepository.findItem(userId, productId);

    return {
      inWishlist: !!item,
    };
  }
}

export default WishlistService;
