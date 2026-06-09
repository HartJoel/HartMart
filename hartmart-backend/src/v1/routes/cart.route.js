import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToCart);
router.get("/", getCart);
router.patch("/:cartItemId", updateItem);
router.delete("/:cartItemId", removeFromCart);
router.delete("/", clearCart);

export default router;
