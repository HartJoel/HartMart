import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToWishList,
  checkWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWishList);
router.get("/", getWishlist);
router.get("/:productId/check", checkWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
