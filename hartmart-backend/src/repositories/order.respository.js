import { prisma } from "../config/db.js";

class OrderRespository {
  static async create(data) {
    return prisma.order.create({
      data,
    });
  }

  static async createOrderItems(items) {
    return prisma.orderItem.createMany({
      data: items,
    });
  }

  static async findByCustomer(customerId) {
    return prisma.order.findMany({
      where: { customerId },
    });
  }

  static async findById(orderId) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        timeline: true,
      },
    });
  }

  static async getTimeline(orderId) {
    return prisma.orderTimeline.findMany({
      where: { orderId },
    });
  }

  static async addTimeline(data) {
    return prisma.orderTimeline.create({
      data,
    });
  }

  static async clearCart(userId) {
    return prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  static async getCart(userId) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  static async getDefaultAddress(userId) {
    return prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });
  }
}

export default OrderRespository;
