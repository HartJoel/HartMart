import VendorRepository from "../repositories/vendor.responsitory.js";
import slugify from "slugify";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import UserRepository from "../repositories/user.repository.js";

class VendorService {
  static async applyAsVendor(userId, data) {
    const existingVendor = await VendorRepository.findUserId(userId);

    if (existingVendor) {
      if (existingVendor) {
        throw new AppError("You already have a vendor account", 404);
      }
    }

    const storeSlug = `${slugify(data.storeName, { lower: true, strict: true })}-${crypto.randomBytes(2).toString("hex")}`;

    const existingStore = await VendorRepository.findByStoreSlug(storeSlug);

    if (existingStore) {
      throw new AppError("Store name already exists", 404);
    }

    await UserRepository.upadateRole(userId);

    return await VendorRepository.create({
      userId,

      storeName: data.storeName,
      storeSlug,

      storeDescription: data.storeDescription,
      storeCategory: data.storeCategory,

      businessRegistration: data.businessRegistration,
      taxId: data.taxId,

      businessAddress: data.businessAddress,

      businessPhone: data.businessPhone,

      bankName: data.bankName,

      bankAccountNumber: data.bankAccountNumber,
      bankAccountName: data.bankAccountName,

      bankCode: data.bankCode,
    });
  }

  static async getVendorProfile(vendorId) {
    return VendorRepository.findById(vendorId);
  }

  static async getMyVendorProfile(userId) {
    return VendorRepository.findUserId(userId);
  }

  static async updateVendorProfile(userId, data) {
    const vendor = await VendorRepository.findUserId(userId);

    return VendorRepository.updateVendor(vendor.id, data);
  }

  static async getAllVendors() {
    return VendorRepository.getAllVendors();
  }

  static async verifyVendor(vendorId) {
    return VendorRepository.verifyVendor(vendorId);
  }

  static async rejectVendor(vendorId, reason) {
    return VendorRepository.rejectVendor(vendorId, reason);
  }

  static async suspendVendor(vendorId) {
    return VendorRepository.suspendVendor(vendorId);
  }

  static async getVendorAnalytics(userId) {
    const vendor = await VendorRepository.findUserId(userId);

    // Build analytics later
    return {
      vendorId: vendor.id,
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      fulfillmentRate: 0,
      cancellationRate: 0,
      returnRate: 0,
      monthlyData: [],
    };
  }

  static async getVendorMetrics(vendorId) {
    return VendorRepository.getVendorMetrics(vendorId);
  }

  static async getTopVendors() {
    return VendorRepository.getTopVendors();
  }
}

export default VendorService;
