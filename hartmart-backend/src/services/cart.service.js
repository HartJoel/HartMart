import CartRespository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import AppError from "../utils/AppError.js";

class CartService {
  static async addToCart(userId, data) {
    const product = await ProductRepository.findbyId(data.productId);

    if (!product) {
      throw new AppError("Product not Found", 404);
    }

    const existing = await CartRespository.findItem(userId, data.productId);

    if (existing) {
      const newQuantity = existing.quantity + data.quantity;

      // OPTIONAL but important: stock validation
      const product = await ProductRepository.findbyId(data.productId);

      if (newQuantity > product.availableStock) {
        throw new Error("Not enough stock available");
      }

      return await CartRespository.updateQuantity(existing.id, newQuantity);
    }

    return await CartRespository.create({
      userId,
      productId: data.productId,
      quantity: data.quantity,
      selectedVariation: data.selectedVariation || {},
    });
  }

  static async getCart(userId) {
    const items = await CartRespository.getUserCart(userId);

    const total = items.reduce((sum, item) => {
      return sum + item.quantity * Number(item.product.basePrice);
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      total,
      itemCount,
    };
  }

  static async updateCartItem(cartItemId, quantity) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    return CartRespository.updateQuantity(cartItemId, quantity);
  }

  static async removeFromCart(cartItemId) {
    return CartRespository.deleteItem(cartItemId);
  }

  static async clearCart(userId) {
    return CartRespository.clearCart(userId);
  }
}

export default CartService;
