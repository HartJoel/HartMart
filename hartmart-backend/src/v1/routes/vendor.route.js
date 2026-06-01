import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import VendorController from "../controllers/vendor.controller.js";


const router = express.Router();

router.use(authMiddleware);

router.post("/apply", VendorController)

export default router;
