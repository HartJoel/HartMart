import AddressService from "../../services/address.service.js";

const createAddress = async (req, res) => {
  try {
    const address = await AddressService.addAddress(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Address Created",
      message: "Add new address to profile",
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await AddressService.updateAddress(
      req.user.id,
      req.params.addressId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await AddressService.getUserAddresses(req.user.id);

    res.status(200).json({
      success: true,
      message: "Get Users Addresses",
      data: addresses,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await AddressService.deleteAddress(req.user.id, req.params.addressId);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export { createAddress, updateAddress, getUserAddresses, deleteAddress };
