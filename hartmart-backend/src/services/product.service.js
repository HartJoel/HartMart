import ProductRepository from "../repositories/product.repository.js";
import slugify from "slugify";
import crypto from "crypto";
import VendorRepository from "../repositories/vendor.responsitory.js";
import CategoryRepository from "../repositories/category.responsitory.js";
import { prisma } from "../config/db.js";

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

  static async getAllProducts() {
    const products = await ProductRepository.getProducts();
    return products;
  }

  static async getProductById(id) {
    const product = await ProductRepository.findbyId(id);
    return product;
  }

  static async updateProduct(productId, userId, data) {
    const vendor = await VendorRepository.findUserId(userId);

    if (!vendor) {
      throw new Error("Only vendors can update products");
    }

    const product = await ProductRepository.findbyId(productId);

    if (!product) {
      throw new Error("Product not Found");
    }

    if (product.vendorId !== vendor.id) {
      throw new Error("You are not allowed to update this product");
    }

    let categoryId = undefined;

    if (data.categorySlug) {
      const category = await CategoryRepository.findBySlug(data.categorySlug);

      if (!category) {
        throw new Error("Invalid category selected");
      }

      categoryId = category.id;
    }

    let slug;

    if (data.name) {
      const baseSlug = slugify(data.name, {
        lower: true,
        strict: true,
      });

      slug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;
    }

    const updatedData = {
      ...data,
      ...(categoryId && { categoryId }),
      ...(slug && { slug }),
    };

    return await ProductRepository.updateProduct(productId, updatedData);
  }

  static async deleteProduct(productId, userId) {
    const vendor = await VendorRepository.findUserId(userId);

    if (!vendor) {
      throw new Error("Only vendors can delete products");
    }

    const product = await ProductRepository.findbyId(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.vendorId !== vendor.id) {
      throw new Error("You are not allowed to delete this product");
    }

    if (product.deletedAt) {
      throw new Error("Product already deleted");
    }

    return await ProductRepository.softDeleteProduct(productId);
  }
}

export default ProductService;
