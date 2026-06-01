import VendorService from "../../services/vendor.service.js";

const applyAsVendor = async (req, res) => {
  try {
    const vendor = await VendorService.applyAsVendor(req.user.id, req.body);

    return res.status(201).json({
      succes: "true",
      message: "Vendor application submitted successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export default applyAsVendor;
