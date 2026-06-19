import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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
} from "../controllers/vendor.controller.js";
import { validateRequest } from "../middleware/validate.request.js";
import { vendorApplicationSchema } from "../validators/vendor.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/apply", validateRequest(vendorApplicationSchema), applyAsVendor);

// Public
router.get("/", getAllVendors);
router.get("/top", getTopVendors);

// Vendor
router.get("/me", getMyVendorProfile);
router.patch("/me", updateVendorProfile);
router.get("/me/analytics", getVendorAnalytics);

// Admin
router.post("/:vendorId/verify", verifyVendor);
router.post("/:vendorId/reject", rejectVendor);
router.post("/:vendorId/suspend", suspendVendor);
router.get("/:vendorId/metrics", getVendorMetrics);

router.get("/:vendorId", getVendorProfile);

export default router;
