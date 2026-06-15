import AddressService from "../../services/address.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createAddress = asyncHandler(async (req, res) => {
  const address = await AddressService.addAddress(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Address Created",
    message: "Add new address to profile",
    data: address,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
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
});

const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await AddressService.getUserAddresses(req.user.id);

  res.status(200).json({
    success: true,
    message: "Get Users Addresses",
    data: addresses,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  await AddressService.deleteAddress(req.user.id, req.params.addressId);

  res.status(204).send();
});

export { createAddress, updateAddress, getUserAddresses, deleteAddress };
