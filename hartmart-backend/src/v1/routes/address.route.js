import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAddress,
  updateAddress,
  getUserAddresses,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createAddress);
router.get("/", getUserAddresses);
router.patch("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
