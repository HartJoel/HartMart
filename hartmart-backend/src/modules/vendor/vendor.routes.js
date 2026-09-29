import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  applyAsVendor,
  getVendorProfile,
  getMyVendorProfile,
  getAllVendors,
  verifyVendor,
  rejectVendor,
  suspendVendor,
  getVendorAnalytics,
  getVendorMetrics,
  getTopVendors,
  updateVendorProfile,
} from "./vendor.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { rejectVendorSchema, updateVendorProfileSchema, vendorApplicationSchema } from "./vendor.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/apply", validateRequest(vendorApplicationSchema), applyAsVendor);

// Public
router.get("/", getAllVendors);
router.get("/top", getTopVendors);

// Vendor
router.get("/me", getMyVendorProfile);
router.patch("/me", validateRequest(updateVendorProfileSchema), updateVendorProfile);
router.get("/me/analytics", getVendorAnalytics);

// Admin
router.post("/:vendorId/verify", validateIdParam("vendorId"), verifyVendor);
router.post("/:vendorId/reject", validateIdParam("vendorId"), validateRequest(rejectVendorSchema), rejectVendor);
router.post("/:vendorId/suspend", validateIdParam("vendorId"), suspendVendor);
router.get("/:vendorId/metrics", validateIdParam("vendorId"), getVendorMetrics);

router.get("/:vendorId", validateIdParam("vendorId"), getVendorProfile);

export default router;
