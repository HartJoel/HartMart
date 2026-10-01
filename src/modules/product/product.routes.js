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
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { createProductSchema, updateProductSchema, updateProductStockSchema } from "./product.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";
import { productListQuerySchema } from "../../shared/validators/list-query.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.single("image"), validateRequest(createProductSchema), requireRole("VENDOR"), createProduct);
router.get("/", validateRequest(productListQuerySchema, "query"), getAllProducts);
router.get(
  "/vendor/me",
  validateRequest(productListQuerySchema, "query"),
  requireRoles(["ADMIN", "VENDOR"]),
  getVendorProducts,
);
router.get("/vendor/me/low-stock", validateRequest(productListQuerySchema, "query"), requireRole("VENDOR"), getLowStock);
router.get("/:productId", validateIdParam("productId"), getProductById);
router.patch("/:id", validateIdParam("id"), validateRequest(updateProductSchema), requireRole("VENDOR"), updateProduct);
router.patch("/:productId/stock", validateIdParam("productId"), validateRequest(updateProductStockSchema), requireRole("VENDOR"), updateStock);
router.delete("/:productId", validateIdParam("productId"), requireRole("VENDOR"), deleteProduct);

export default router;
