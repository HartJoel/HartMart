import { prisma } from "../../config/db.js";
import QueryBuilder from "../../shared/utils/queryBuilder.js";

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

  static async findByReference(reference) {
    return prisma.payment.findUnique({
      where: {
        reference,
      },
    });
  }

  static async findAll(query) {
    return new QueryBuilder(prisma.payment, query)
      .filter()
      .sort()
      .paginate()
      .exec();
  }

  static async findById(paymentId) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
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
