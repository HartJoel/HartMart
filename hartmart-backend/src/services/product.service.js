import ProductRepository from "../repositories/product.repository.js";
import slugify from "slugify";
import crypto from "crypto";
import VendorRepository from "../repositories/vendor.responsitory.js";
import CategoryRepository from "../repositories/category.responsitory.js";
import { prisma } from "../config/db.js";
import { uploadProductToCloudinary } from "../utils/uploadToCloudinary.js";

class ProductService {
  static async createProduct(vendorUserId, data, file) {
    const vendor = await VendorRepository.findUserId(vendorUserId);

    if (!vendor) {
      throw Error("Only vendors can create products");
    }

    // FIXED: correct field
    const category = await CategoryRepository.findBySlug(data.categorySlug);

    if (!category) {
      throw Error("Invalid category selected");
    }

    let imageData = null;

    if (file) {
      const uploadedImage = await uploadProductToCloudinary(file.buffer);

      imageData = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
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

      basePrice: Number(data.basePrice),
      discountPrice: Number(data.discountPrice),

      totalStock: Number(data.totalStock),
      availableStock: Number(data.totalStock),
      reorderLevel: Number(data.reorderLevel),

      weight: data.weight ? Number(data.weight) : null,

      images: imageData ? [imageData] : [],

      dimensions: data.dimensions,
      attributes: data.attributes,
    });
  }

  static async getAllProducts(query) {
    const products = await ProductRepository.getProducts(query);
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

  static async getVendorProduct(userId, query) {
    const vendor = await VendorRepository.findUserId(userId);
    return ProductRepository.findVendorProducts(vendor.id, query);
  }

  static async getLowStockProducts(userId, query) {
    const vendor = await VendorRepository.findUserId(userId);

    if (!vendor) throw new Error("Only vendors allowed");

    return ProductRepository.getLowStockProducts(vendor.id, query);
  }

  static async updateStock(productId, userId, data) {
    const vendor = await VendorRepository.findUserId(userId);

    if (!vendor) throw new Error("Only vendors allowed");

    const product = await ProductRepository.findbyId(productId);
    if (!product) throw new Error("Product not found");

    if (product.vendorId !== vendor.id) {
      throw new Error("Unauthorized");
    }

    if (data.reservedStock > data.totalStock) {
      throw new Error("Invalid stock values");
    }

    return ProductRepository.updateStock(productId, data);
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
