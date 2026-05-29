import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
  createAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.patch("/me", updateProfile);
router.post("/addresses", createAddress);

export default router;
