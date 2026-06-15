import VendorService from "../../services/vendor.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const applyAsVendor = asyncHandler(async (req, res) => {
  const vendor = await VendorService.applyAsVendor(req.user.id, req.body);

  return res.status(201).json({
    succes: "true",
    message: "Vendor application submitted successfully. Please login again",
    data: vendor,
  });
});

export default applyAsVendor;
