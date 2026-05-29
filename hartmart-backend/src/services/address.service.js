import AddressRepository from "../repositories/address.respository.js";

class AddressService {
  static async addAddress(userId, data) {
   try{
     const existingAddresses = await AddressRepository.countByUserId(userId);

    if (existingAddresses >= 5) {
      throw new Error("Maximum address limit reached");
    }
    return AddressRepository.create({
      ...data,
      userId,
    });
   }catch(error){
    throw error
   }

}
}

export default AddressService;
