import AddressRepository from "../repositories/address.respository.js";

class AddressService {
  static async addAddress(userId, data) {
    try {
      const existingAddresses = await AddressRepository.countByUserId(userId);

      // First address becomes default automatically
      if (existingAddresses === 0) {
        data.isDefault = true;
      }

      if (existingAddresses >= 5) {
        throw new Error("Maximum address limit reached");
      }
      return AddressRepository.create({
        ...data,
        userId,
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateAddress(userId, addressId, data) {
    try {
      const address = await AddressRepository.findById(addressId);

      if (!address) {
        throw new Error("Address not found");
      }

      if (!address) {
        throw new Error("Address not found");
      }

      if (address.userId !== userId) {
        throw new Error("Unauthorized");
      }

      return AddressRepository.update(addressId, data);
    } catch (error) {
      throw error;
    }
  }

  static async getUserAddresses(userId) {
    return AddressRepository.findByUserId(userId);
  }

  static async deleteAddress(userId, addressId) {
    try {
      const address = await AddressRepository.findById(addressId);

      if (!address) {
        throw new Error("Address not found");
      }

      if (address.userId !== userId) {
        throw new Error("Unauthorized");
      }

      await AddressRepository.delete(addressId);
    } catch (error) {
      throw error;
    }
  }
}

export default AddressService;
