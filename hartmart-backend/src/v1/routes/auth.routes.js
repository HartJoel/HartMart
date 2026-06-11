import express from "express";
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.request.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator.js";
const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/verify-email", verifyEmail);
router.post("/login", validateRequest(loginSchema) ,login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);

export default router;
