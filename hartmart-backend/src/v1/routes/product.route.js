import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.patch("/:id", updateProduct);
router.delete("/:productId", deleteProduct)

export default router;
