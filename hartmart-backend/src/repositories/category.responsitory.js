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
    });
  }
}

export default CategoryRepository;
