import ProductRepository from "../repositories/product.repository.js";
import WishlistRepository from "../repositories/wishlist.respository.js";

class WishlistService {
  static async addToWishList(userId, productId) {
    const product = await ProductRepository.findbyId(productId);

    if (!product) {
      throw Error("Product not Found");
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
}

export default WishlistService;
