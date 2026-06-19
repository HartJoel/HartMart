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

const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await VendorService.getVendorProfile(req.params.vendorId);

  return res.status(200).json({
    succes: "true",
    message: "Vendor Profile",
    data: vendor,
  });
});

const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await VendorService.getMyVendorProfile(req.user.id);

  return res.status(200).json({
    succes: "true",
    message: "Current Vendor Profile",
    data: vendor,
  });
});

const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await VendorService.updateVendorProfile(req.user.id, req.body);

  return res.status(200).json({
    succes: "true",
    message: "update Vendor Profile",
    data: vendor,
  });
});

const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await VendorService.getAllVendors();

  return res.status(200).json({
    succes: "true",
    message: "All Vendors",
    data: vendors,
  });
});

const verifyVendor = asyncHandler(async (req, res) => {
  const vendor = await VendorService.verifyVendor(req.params.vendorId);

  return res.status(200).json({
    succes: "true",
    message: "Verify Vendor",
    data: vendor,
  });
});

const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await VendorService.rejectVendor(
    req.params.vendorId,
    req.body.reason,
  );

  return res.status(200).json({
    succes: "true",
    message: "Reject Vendor",
    data: vendor,
  });
});

const suspendVendor = asyncHandler(async (req, res) => {
  const vendor = await VendorService.suspendVendor(req.params.vendorId);

  return res.status(200).json({
    succes: "true",
    message: "Suspend Vendor",
    data: vendor,
  });
});

const getVendorAnalytics = asyncHandler(async (req, res) => {
  const analytics = await VendorService.getVendorAnalytics(req.user.id);

  return res.status(200).json({
    succes: "true",
    message: "Get Vendor analytics",
    data: analytics,
  });
});

const getVendorMetrics = asyncHandler(async (req, res) => {
  const metrics = await VendorService.getVendorMetrics(req.params.vendorId);

  return res.status(200).json({
    succes: "true",
    message: "Get Vendor metrics",
    data: metrics,
  });
});

const getTopVendors = asyncHandler(async (req, res) => {
  const vendors = await VendorService.getTopVendors();

  return res.status(200).json({
    succes: "true",
    message: "Get 10 Vendors",
    data: vendors,
  });
});

export {
  applyAsVendor,
  getVendorProfile,
  getMyVendorProfile,
  updateVendorProfile,
  getAllVendors,
  verifyVendor,
  rejectVendor,
  suspendVendor,
  getVendorAnalytics,
  getVendorMetrics,
  getTopVendors,
};
