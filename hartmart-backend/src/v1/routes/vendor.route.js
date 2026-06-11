import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import VendorController from "../controllers/vendor.controller.js";
import { validateRequest } from "../middleware/validate.request.js";
import { vendorApplicationSchema } from "../validators/vendor.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/apply",
  validateRequest(vendorApplicationSchema),
  VendorController,
);

export default router;
