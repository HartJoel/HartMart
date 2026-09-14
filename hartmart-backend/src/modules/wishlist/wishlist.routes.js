import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  addToWishList,
  checkWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWishList);
router.get("/", getWishlist);
router.get("/:productId/check", checkWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
