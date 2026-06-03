import CartRespository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";

class CartService {
  static async addToCart(userId, data) {
    const product = await ProductRepository.findbyId(data.productId);

    if (!product) {
      throw Error("Product not Found");
    }

    const existing = await CartRespository.findItem(userId, data.productId);

    if (existing) {
      return await CartRespository.updateQuantity(
        existing.id,
        existing.quantity + data.quantity,
      );
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
}

export default CartService;
