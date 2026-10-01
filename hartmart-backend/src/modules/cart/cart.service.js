import CartRespository from "./cart.repository.js";
import ProductRepository from "../product/product.repository.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/utils/logger.js";

class CartService {
  static async addToCart(userId, data) {
    const product = await ProductRepository.findbyId(data.productId);

    if (!product) {
      throw new AppError("The selected product was not found.", 404);
    }

    const existing = await CartRespository.findItem(userId, data.productId);

    if (existing) {
      const newQuantity = existing.quantity + data.quantity;

      // OPTIONAL but important: stock validation
      const product = await ProductRepository.findbyId(data.productId);

      if (newQuantity > product.availableStock) {
        throw new AppError("The requested quantity exceeds available stock.", 409);
      }

      const item = await CartRespository.updateQuantity(existing.id, newQuantity);
      logger.info("Cart item quantity increased", { userId, cartItemId: item.id, productId: data.productId, quantity: newQuantity });
      return item;
    }

    const item = await CartRespository.create({
      userId,
      productId: data.productId,
      quantity: data.quantity,
      selectedVariation: data.selectedVariation || {},
    });
    logger.info("Item added to cart", { userId, cartItemId: item.id, productId: data.productId, quantity: item.quantity });
    return item;
  }

  static async getCart(userId) {
    const items = await CartRespository.getUserCart(userId);

    const total = items.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.basePrice);
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    logger.info("Cart retrieved", { userId, itemCount, totalAmount: total });

    return {
      items,
      total,
      itemCount,
    };
  }

  static async updateCartItem(cartItemId, quantity) {
    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than zero.", 400);
    }

    const item = await CartRespository.updateQuantity(cartItemId, quantity);
    logger.info("Cart item updated", { cartItemId, quantity });
    return item;
  }

  static async removeFromCart(cartItemId) {
    const result = await CartRespository.deleteItem(cartItemId);
    logger.info("Cart item removed", { cartItemId });
    return result;
  }

  static async clearCart(userId) {
    const result = await CartRespository.clearCart(userId);
    logger.info("Cart cleared", { userId, removedItemCount: result.count });
    return result;
  }
}

export default CartService;
