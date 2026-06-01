import ProductRepository from "../repositories/product.repository.js";

import slugify from "slugify";
import crypto from "crypto";
import VendorRepository from "../repositories/vendor.responsitory.js";
import CategoryRepository from "../repositories/category.responsitory.js";

class ProductService {
  static async createProduct(vendorUserId, data) {
    const vendor = await VendorRepository.findUserId(vendorUserId);

    if (!vendor) {
      throw Error("Only vendors can create products");
    }

    // FIXED: correct field
    const category = await CategoryRepository.findBySlug(data.categorySlug);

    if (!category) {
      throw Error("Invalid category selected");
    }

    const sku = `SKU-${crypto.randomBytes(4).toString("hex")}`;

    const baseSlug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const slug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;

    return await ProductRepository.create({
      vendorId: vendor.id,
      name: data.name,
      description: data.description,

      categoryId: category.id,

      sku,
      slug,

      basePrice: data.basePrice,
      discountPrice: data.discountPrice,

      totalStock: data.totalStock,
      availableStock: data.totalStock,
      reorderLevel: data.reorderLevel,

      images: data.images,
      weight: data.weight,
      dimensions: data.dimensions,
      attributes: data.attributes,
    });
  }
}

export default ProductService;
