import slugify from "slugify";
import CategoryRepository from "../repositories/category.responsitory.js";

class CategoryService {
  static async createCategory(data) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    // Optional: validate parent category
    if (data.parentId) {
      const parent = await CategoryRepository.findById(data.parentId);

      if (!parent) {
        throw Error("Parent category not found");
      }
    }

    return await CategoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon,
      parentId: data.parentId || null,
    });
  }
}

export default CategoryService;
