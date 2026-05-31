import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.get("/", getAllUsers);



router.patch("/me", updateProfile);

router.get("/:id", getUserById);

export default router;
