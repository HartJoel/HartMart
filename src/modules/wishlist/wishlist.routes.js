import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  addToWishList,
  checkWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import { addWishlistItemSchema } from "./wishlist.validator.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateRequest(addWishlistItemSchema), addToWishList);
router.get("/", getWishlist);
router.get("/:productId/check", validateIdParam("productId"), checkWishlist);
router.delete("/:productId", validateIdParam("productId"), removeFromWishlist);

export default router;
