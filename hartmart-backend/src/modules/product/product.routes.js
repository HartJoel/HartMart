import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getLowStock,
  getProductById,
  getVendorProducts,
  updateProduct,
  updateStock,
} from "./product.controller.js";
import { upload } from "../../shared/middleware/upload.js";
import { requireRole, requireRoles } from "../../shared/middleware/rbac.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.single("image"), requireRole("VENDOR"), createProduct);
router.get("/", getAllProducts);
router.get(
  "/vendor/me",
  requireRoles(["ADMIN", "VENDOR"]),
  getVendorProducts,
);
router.get("/vendor/me/low-stock", requireRole("VENDOR"), getLowStock);
router.get("/:productId", getProductById);
router.patch("/:id", requireRole("VENDOR"), updateProduct);
router.patch("/:productId/stock", requireRole("VENDOR"), updateStock);
router.delete("/:productId", requireRole("VENDOR"), deleteProduct);

export default router;
