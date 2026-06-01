import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import createCategory from "../controllers/category.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createCategory);

export default router;
