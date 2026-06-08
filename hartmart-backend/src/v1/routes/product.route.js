import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getLowStock,
  getProductById,
  getVendorProducts,
  updateProduct,
  updateStock,
} from "../controllers/product.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/vendor/me", getVendorProducts);
router.get("/vendor/me/low-stock", getLowStock);
router.get("/:productId", getProductById);
router.patch("/:id", updateProduct);
router.patch("/:productId/stock", updateStock);
router.delete("/:productId", deleteProduct);

export default router;
