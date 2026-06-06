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
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  static async getProducts() {
    return prisma.product.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  static async updateProduct(id, data) {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,

        basePrice: data.basePrice,
        discountPrice: data.discountPrice,

        totalStock: data.totalStock,
        availableStock: data.availableStock,
        reservedStock: data.reservedStock,
        reorderLevel: data.reorderLevel,

        images: data.images,

        weight: data.weight,
        dimensions: data.dimensions,

        attributes: data.attributes,

        categoryId: data.categoryId,
        slug: data.slug,
      },
    });
  }

  static async softDeleteProduct(productId) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  static async restoreProduct(productId) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        deletedAt: null,
      },
    });
  }
}

export default ProductRepository;
