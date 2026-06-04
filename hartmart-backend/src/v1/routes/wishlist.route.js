import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToWishList,
  getWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWishList);
router.get("/", getWishlist);

export default router;
