import { prisma } from "../config/db.js";

class ProductRepository {
  static async findBySku(sku) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  static async create(data) {
    return prisma.product.create({
      data,
    });
  }

  static async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  static async findbyId(id) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  static async getProducts() {
    return prisma.product.findMany({});
  }
}

export default ProductRepository;
