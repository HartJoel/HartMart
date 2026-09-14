import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:categoryId", getCategory);
router.patch("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);

export default router;
