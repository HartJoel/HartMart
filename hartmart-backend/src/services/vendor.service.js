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
}

export default VendorService;
