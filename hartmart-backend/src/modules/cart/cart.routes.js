import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateItem,
} from "./cart.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { addCartItemSchema, updateCartItemSchema } from "./cart.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addCartItemSchema), addToCart);
router.get("/", getCart);
router.patch("/:cartItemId", validateIdParam("cartItemId"), validateRequest(updateCartItemSchema), updateItem);
router.delete("/:cartItemId", validateIdParam("cartItemId"), removeFromCart);
router.delete("/", clearCart);

export default router;
