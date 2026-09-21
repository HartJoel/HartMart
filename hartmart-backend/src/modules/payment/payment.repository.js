import { prisma } from "../../config/db.js";

class PaymentRepository {
  static async create(data) {
    return prisma.payment.create({
      data,
    });
  }

  static async findById(id) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  static async findByOrderId(orderId) {
    return prisma.payment.findFirst({
      where: {
        orderId,
      },
    });
  }

  static async updateById(id, data) {
    return prisma.payment.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default PaymentRepository;
