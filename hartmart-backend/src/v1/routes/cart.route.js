import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToCart);
router.get("/", getCart);

export default router;
