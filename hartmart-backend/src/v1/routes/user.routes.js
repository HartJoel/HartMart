import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.get("/", getAllUsers);
router.patch("/me", upload.single("avatar"), updateProfile);
router.get("/:id", getUserById);

export default router;
