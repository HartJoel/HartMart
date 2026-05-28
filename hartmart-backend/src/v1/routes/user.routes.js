import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile)

export default router;
