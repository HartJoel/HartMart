import { prisma } from "../config/db.js";

class CategoryRepository {
  static async create(data) {
    return prisma.category.create({
      data,
    });
  }

  static async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  static async findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
        products: true,
      },
    });
  }

  static async listCategories() {
    return prisma.category.findMany({});
  }

  static async update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteById(id) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export default CategoryRepository;
