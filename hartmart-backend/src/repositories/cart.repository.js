import { prisma } from "../config/db.js";

class CartRespository {
  static async findItem(userId, productId) {
    return prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  static async create(data) {
    return prisma.cartItem.create({
      data,
    });
  }

  static async updateQuantity(id, quantity) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  static async getUserCart(userId) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}

export default CartRespository;
