import AddressRepository from "./address.repository.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/utils/logger.js";

class AddressService {
  static async addAddress(userId, data) {
    try {
      const existingAddresses = await AddressRepository.countByUserId(userId);

      // First address becomes default automatically
      if (existingAddresses === 0) {
        data.isDefault = true;
      }

      if (existingAddresses >= 5) {
        throw new AppError("You can save up to five addresses.", 409);
      }
      const address = await AddressRepository.create({
        ...data,
        userId,
      });
      logger.info("Address created", { userId, addressId: address.id, isDefault: address.isDefault });
      return address;
    } catch (error) {
      throw error;
    }
  }

  static async updateAddress(userId, addressId, data) {
    try {
      const address = await AddressRepository.findById(addressId);

      if (!address) {
        throw new AppError("Address not found", 404);
      }

      if (!address) {
        throw new AppError("Address not found", 404);
      }

      if (address.userId !== userId) {
        throw new AppError("Address not found", 404);
      }

      const updatedAddress = await AddressRepository.update(addressId, data);
      logger.info("Address updated", { userId, addressId });
      return updatedAddress;
    } catch (error) {
      throw error;
    }
  }

  static async getUserAddresses(userId) {
    const addresses = await AddressRepository.findByUserId(userId);
    logger.info("User addresses retrieved", { userId, addressCount: addresses.length });
    return addresses;
  }

  static async deleteAddress(userId, addressId) {
    try {
      const address = await AddressRepository.findById(addressId);

      if (!address) {
        throw new AppError("Address not found", 404);
      }

      if (address.userId !== userId) {
        throw new AppError("Address not found", 404);
      }

      await AddressRepository.delete(addressId);
      logger.info("Address deleted", { userId, addressId });
    } catch (error) {
      throw error;
    }
  }
}

export default AddressService;
