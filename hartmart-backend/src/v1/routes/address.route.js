import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAddress,
  updateAddress,
  getUserAddresses,
  deleteAddress,
} from "../controllers/address.controller.js";
import { validateRequest } from "../middleware/validate.request.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(createAddressSchema), createAddress);
router.get("/", getUserAddresses);
router.patch(
  "/:addressId",
  validateRequest(updateAddressSchema),
  updateAddress,
);
router.delete("/:addressId", deleteAddress);

export default router;
