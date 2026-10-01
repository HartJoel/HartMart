import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createAddress,
  updateAddress,
  getUserAddresses,
  deleteAddress,
} from "./address.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(createAddressSchema), createAddress);
router.get("/", getUserAddresses);
router.patch(
  "/:addressId",
  validateIdParam("addressId"),
  validateRequest(updateAddressSchema),
  updateAddress,
);
router.delete("/:addressId", validateIdParam("addressId"), deleteAddress);

export default router;
